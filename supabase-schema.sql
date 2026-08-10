-- EMOREV Supabase production setup
-- Run this in Supabase SQL Editor, then create/invite your admin user in Supabase Auth.
-- Replace the email in the admin_users insert with your real owner email if needed.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'owner' check (role in ('primary-owner', 'owner')),
  created_at timestamptz not null default now()
);

create or replace function public.is_emorev_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users admins
    where lower(admins.email) = lower(auth.email())
  );
$$;

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric not null default 0,
  sale_price numeric,
  discount integer,
  category text not null check (category in ('women', 'men', 'kids')),
  size text[] not null default array['S','M','L'],
  description text not null default '',
  image_url text not null default '',
  image_path text,
  stock integer not null default 0,
  is_new boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  review text not null,
  date text not null,
  avatar text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_questions (
  id text primary key,
  name text not null,
  email text not null,
  message text not null,
  order_info text,
  date text not null,
  status text not null default 'open' check (status in ('open', 'replied', 'resolved')),
  reply text,
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id text primary key default 'main',
  whatsapp_number text not null default '+1234567890',
  store_name text not null default 'EMOREV Fashion',
  store_email text not null default 'support@emorev.com',
  store_phone text not null default '+1 (555) 123-4567',
  store_address text not null default '123 Fashion Avenue, New York, NY 10001',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id)
values ('main')
on conflict (id) do nothing;

insert into public.admin_users (email, role)
values ('deathlegend804@gmail.com', 'primary-owner')
on conflict (email) do update set role = excluded.role;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.customer_questions enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users" on public.admin_users for select
using (public.is_emorev_admin() or lower(email) = lower(auth.email()));

drop policy if exists "Admins can insert admin users" on public.admin_users;
create policy "Admins can insert admin users" on public.admin_users for insert
with check (public.is_emorev_admin());

drop policy if exists "Admins can delete non-primary admin users" on public.admin_users;
create policy "Admins can delete non-primary admin users" on public.admin_users for delete
using (public.is_emorev_admin() and role <> 'primary-owner');

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products" on public.products for select
using (is_published = true or public.is_emorev_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert
with check (public.is_emorev_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete
using (public.is_emorev_admin());

drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews" on public.reviews for select
using (is_approved = true or public.is_emorev_admin());

drop policy if exists "Public can submit reviews" on public.reviews;
create policy "Public can submit reviews" on public.reviews for insert
with check (true);

drop policy if exists "Admins can update reviews" on public.reviews;
create policy "Admins can update reviews" on public.reviews for update
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

drop policy if exists "Admins can delete reviews" on public.reviews;
create policy "Admins can delete reviews" on public.reviews for delete
using (public.is_emorev_admin());

drop policy if exists "Public can submit customer questions" on public.customer_questions;
create policy "Public can submit customer questions" on public.customer_questions for insert
with check (true);

drop policy if exists "Admins can read customer questions" on public.customer_questions;
create policy "Admins can read customer questions" on public.customer_questions for select
using (public.is_emorev_admin());

drop policy if exists "Admins can update customer questions" on public.customer_questions;
create policy "Admins can update customer questions" on public.customer_questions for update
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

drop policy if exists "Admins can delete customer questions" on public.customer_questions;
create policy "Admins can delete customer questions" on public.customer_questions for delete
using (public.is_emorev_admin());

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings" on public.store_settings for select
using (true);

drop policy if exists "Admins can manage store settings" on public.store_settings;
create policy "Admins can manage store settings" on public.store_settings for all
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_emorev_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images" on storage.objects for update
using (bucket_id = 'product-images' and public.is_emorev_admin())
with check (bucket_id = 'product-images' and public.is_emorev_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images" on storage.objects for delete
using (bucket_id = 'product-images' and public.is_emorev_admin());

alter table public.products replica identity full;
alter table public.store_settings replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.products;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.store_settings;
exception
  when duplicate_object then null;
end $$;