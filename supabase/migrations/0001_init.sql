-- SiparişAI: ilk veritabanı şeması
-- Supabase SQL Editor'de bir kez çalıştırılır.

create extension if not exists pgcrypto;

-- ───────────── Tablolar ─────────────

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])$'),
  name text not null,
  phone text,
  address text,
  district text,
  city text default 'İstanbul',
  about text,
  hours text,
  primary_color text not null default '#c2410c',
  delivery_fee numeric(10,2) not null default 0,
  min_order numeric(10,2) not null default 0,
  direct_discount_pct int not null default 10 check (direct_discount_pct between 0 and 50),
  accepts_delivery boolean not null default true,
  accepts_pickup boolean not null default true,
  is_open boolean not null default true,
  published boolean not null default false,
  custom_domain text unique,
  sms_footer text,
  created_at timestamptz not null default now()
);
create index on public.restaurants(owner_id);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  position int not null default 0
);
create index on public.menu_categories(restaurant_id);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid references public.menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  available boolean not null default true,
  position int not null default 0
);
create index on public.menu_items(restaurant_id);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  phone text not null,
  marketing_consent boolean not null default false,
  consent_at timestamptz,
  birthday date,
  order_count int not null default 0,
  total_spent numeric(12,2) not null default 0,
  first_order_at timestamptz,
  last_order_at timestamptz,
  created_at timestamptz not null default now(),
  unique (restaurant_id, phone)
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  segment text not null,
  channel text not null default 'sms' check (channel in ('sms','whatsapp')),
  message text not null,
  status text not null default 'draft' check (status in ('draft','sent','failed')),
  recipients int not null default 0,
  dry_run boolean not null default false,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.campaigns(restaurant_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no bigint generated always as identity,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text,
  note text,
  fulfillment text not null check (fulfillment in ('delivery','pickup')),
  payment_method text not null check (payment_method in ('cash','card_on_delivery')),
  source text not null default 'site' check (source in ('site','qr','whatsapp','phone')),
  items jsonb not null,
  subtotal numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  status text not null default 'new'
    check (status in ('new','preparing','on_the_way','ready','completed','cancelled')),
  created_at timestamptz not null default now()
);
create index on public.orders(restaurant_id, created_at desc);

-- ───────────── Yetki (RLS) ─────────────

create or replace function public.is_owner(rid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from restaurants where id = rid and owner_id = auth.uid());
$$;

alter table public.restaurants enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.customers enable row level security;
alter table public.campaigns enable row level security;
alter table public.orders enable row level security;

-- Restoran sahibi kendi kaydını yönetir; yayındaki restoranı herkes görür.
create policy "owner manages restaurant" on public.restaurants
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "public reads published restaurant" on public.restaurants
  for select using (published);

create policy "owner manages categories" on public.menu_categories
  for all using (public.is_owner(restaurant_id)) with check (public.is_owner(restaurant_id));
create policy "public reads published categories" on public.menu_categories
  for select using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.published));

create policy "owner manages items" on public.menu_items
  for all using (public.is_owner(restaurant_id)) with check (public.is_owner(restaurant_id));
create policy "public reads published items" on public.menu_items
  for select using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.published));

create policy "owner manages customers" on public.customers
  for all using (public.is_owner(restaurant_id)) with check (public.is_owner(restaurant_id));
create policy "owner manages campaigns" on public.campaigns
  for all using (public.is_owner(restaurant_id)) with check (public.is_owner(restaurant_id));
create policy "owner manages orders" on public.orders
  for all using (public.is_owner(restaurant_id)) with check (public.is_owner(restaurant_id));

-- ───────────── Sipariş verme ─────────────
-- Müşteri sitesi siparişi bu fonksiyonla verir. Fiyatlar her zaman
-- veritabanındaki menüden yeniden hesaplanır; tarayıcıdan gelen fiyata güvenilmez.

create or replace function public.place_order(
  p_slug text,
  p_items jsonb,            -- [{ "id": "<menu_item uuid>", "qty": 2 }]
  p_name text,
  p_phone text,
  p_fulfillment text,
  p_payment text,
  p_address text default null,
  p_note text default null,
  p_consent boolean default false,
  p_source text default 'site',
  p_campaign uuid default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  r restaurants%rowtype;
  line jsonb;
  mi menu_items%rowtype;
  q int;
  lines jsonb := '[]'::jsonb;
  sub numeric := 0;
  disc numeric;
  fee numeric;
  tot numeric;
  cust_id uuid;
  phone_clean text;
  new_order orders%rowtype;
begin
  select * into r from restaurants where slug = p_slug and published;
  if not found then raise exception 'restaurant_not_found'; end if;
  if not r.is_open then raise exception 'restaurant_closed'; end if;

  phone_clean := regexp_replace(coalesce(p_phone,''), '\D', '', 'g');
  if phone_clean like '90%' then phone_clean := substr(phone_clean, 3); end if;
  if phone_clean like '0%' then phone_clean := substr(phone_clean, 2); end if;
  if length(phone_clean) <> 10 then raise exception 'invalid_phone'; end if;
  if length(trim(coalesce(p_name,''))) < 2 then raise exception 'invalid_name'; end if;
  if p_fulfillment not in ('delivery','pickup') then raise exception 'invalid_fulfillment'; end if;
  if p_fulfillment = 'delivery' and not r.accepts_delivery then raise exception 'no_delivery'; end if;
  if p_fulfillment = 'pickup' and not r.accepts_pickup then raise exception 'no_pickup'; end if;
  if p_fulfillment = 'delivery' and length(trim(coalesce(p_address,''))) < 5 then raise exception 'invalid_address'; end if;
  if p_payment not in ('cash','card_on_delivery') then raise exception 'invalid_payment'; end if;
  if p_source not in ('site','qr','whatsapp','phone') then p_source := 'site'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then raise exception 'empty_cart'; end if;
  if jsonb_array_length(p_items) > 50 then raise exception 'too_many_items'; end if;

  for line in select * from jsonb_array_elements(p_items) loop
    q := greatest(1, least(50, coalesce((line->>'qty')::int, 1)));
    select * into mi from menu_items
      where id = (line->>'id')::uuid and restaurant_id = r.id and available;
    if not found then raise exception 'item_unavailable'; end if;
    lines := lines || jsonb_build_object('id', mi.id, 'name', mi.name, 'price', mi.price, 'qty', q);
    sub := sub + mi.price * q;
  end loop;

  if sub < r.min_order then raise exception 'below_min_order'; end if;
  disc := round(sub * r.direct_discount_pct / 100.0, 2);
  fee := case when p_fulfillment = 'delivery' then r.delivery_fee else 0 end;
  tot := sub - disc + fee;

  insert into customers (restaurant_id, name, phone, marketing_consent, consent_at,
                         order_count, total_spent, first_order_at, last_order_at)
  values (r.id, trim(p_name), phone_clean, p_consent, case when p_consent then now() end,
          1, tot, now(), now())
  on conflict (restaurant_id, phone) do update set
    name = excluded.name,
    marketing_consent = customers.marketing_consent or excluded.marketing_consent,
    consent_at = coalesce(customers.consent_at, excluded.consent_at),
    order_count = customers.order_count + 1,
    total_spent = customers.total_spent + excluded.total_spent,
    last_order_at = now()
  returning id into cust_id;

  if p_campaign is not null and not exists (
    select 1 from campaigns where id = p_campaign and restaurant_id = r.id) then
    p_campaign := null;
  end if;

  insert into orders (restaurant_id, customer_id, campaign_id, customer_name, phone, address, note,
                      fulfillment, payment_method, source, items, subtotal, discount, delivery_fee, total)
  values (r.id, cust_id, p_campaign, trim(p_name), phone_clean,
          case when p_fulfillment = 'delivery' then trim(p_address) end,
          nullif(trim(coalesce(p_note,'')), ''),
          p_fulfillment, p_payment, p_source, lines, sub, disc, fee, tot)
  returning * into new_order;

  return jsonb_build_object('order_no', new_order.order_no, 'total', tot,
                            'discount', disc, 'subtotal', sub, 'delivery_fee', fee);
end;
$$;

revoke all on function public.place_order from public;
grant execute on function public.place_order to anon, authenticated;

-- Panelde yeni siparişlerin anında görünmesi için
alter publication supabase_realtime add table public.orders;
