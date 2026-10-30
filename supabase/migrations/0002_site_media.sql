-- Site şablonu için görseller, tanıtım metni ve "en çok sevilenler"

alter table public.restaurants
  add column if not exists logo_url text,
  add column if not exists cover_url text,
  add column if not exists tagline text;

-- Görseller: herkes okuyabilir, her restoran sahibi sadece kendi klasörüne yükler.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "owner uploads own media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_owner(((storage.foldername(name))[1])::uuid));
create policy "owner updates own media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_owner(((storage.foldername(name))[1])::uuid));
create policy "owner deletes own media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_owner(((storage.foldername(name))[1])::uuid));

-- Son 60 günde en çok satan ürünler (sipariş bilgisi açılmadan, sadece ürün kimliği ve adet).
create or replace function public.popular_items(p_restaurant uuid, p_limit int default 6)
returns table (item_id uuid, qty bigint)
language sql stable security definer set search_path = public as $$
  select (l->>'id')::uuid, sum((l->>'qty')::int)::bigint
  from orders o
  join restaurants r on r.id = o.restaurant_id and r.published
  cross join lateral jsonb_array_elements(o.items) l
  where o.restaurant_id = p_restaurant
    and o.status <> 'cancelled'
    and o.created_at > now() - interval '60 days'
  group by 1
  order by 2 desc
  limit least(greatest(p_limit, 1), 12);
$$;
grant execute on function public.popular_items(uuid, int) to anon, authenticated;
