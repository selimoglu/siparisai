export type Restaurant = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  phone: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  about: string | null;
  hours: string | null;
  primary_color: string;
  delivery_fee: number;
  min_order: number;
  direct_discount_pct: number;
  accepts_delivery: boolean;
  accepts_pickup: boolean;
  is_open: boolean;
  published: boolean;
  custom_domain: string | null;
  sms_footer: string | null;
};

export type Category = { id: string; restaurant_id: string; name: string; position: number };

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
  position: number;
};

export type OrderLine = { id: string; name: string; price: number; qty: number };

export type OrderStatus = "new" | "preparing" | "on_the_way" | "ready" | "completed" | "cancelled";

export type Order = {
  id: string;
  order_no: number;
  restaurant_id: string;
  customer_name: string;
  phone: string;
  address: string | null;
  note: string | null;
  fulfillment: "delivery" | "pickup";
  payment_method: "cash" | "card_on_delivery";
  source: string;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  marketing_consent: boolean;
  birthday: string | null;
  order_count: number;
  total_spent: number;
  first_order_at: string | null;
  last_order_at: string | null;
};
