-- EMOREV additive settings/chat/security tables
-- Safe additive script: creates new tables/policies only if they do not exist.
-- It does not delete, reset, or modify existing rows.

create extension if not exists pgcrypto;

create table if not exists public.website_settings (
  id text primary key default 'main',
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.website_settings (id, config)
values (
  'main',
  '{
    "websiteName":"EMOREV",
    "websiteTitle":"EMOREV - Premium Fashion Store",
    "websiteDescription":"Premium fashion with a futuristic EMOREV identity.",
    "websitePronouns":"we/us",
    "backgroundColor":"#000000",
    "backgroundImage":"",
    "logoColors":["#ef4444","#2563eb","#facc15","#9333ea","#ec4899","#f97316"],
    "currencyCode":"USD",
    "paymentMethods":{"cod":true,"jazzcash":false,"easypaisa":false,"paypal":false}
  }'::jsonb
)
on conflict (id) do nothing;

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null default 'Customer',
  customer_email text,
  status text not null default 'open' check (status in ('open', 'answered', 'read')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('customer', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  detail text not null,
  severity text not null default 'low' check (severity in ('low', 'medium', 'high')),
  client_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.blocked_clients (
  id uuid primary key default gen_random_uuid(),
  client_ref text not null,
  reason text not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.website_settings enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.security_events enable row level security;
alter table public.blocked_clients enable row level security;

drop policy if exists "Public can read website settings" on public.website_settings;
create policy "Public can read website settings" on public.website_settings for select using (true);

drop policy if exists "Admins can manage website settings" on public.website_settings;
create policy "Admins can manage website settings" on public.website_settings for all
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

drop policy if exists "Customers can create chat conversations" on public.chat_conversations;
create policy "Customers can create chat conversations" on public.chat_conversations for insert with check (true);

drop policy if exists "Admins can manage chat conversations" on public.chat_conversations;
create policy "Admins can manage chat conversations" on public.chat_conversations for all
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

drop policy if exists "Customers can create chat messages" on public.chat_messages;
create policy "Customers can create chat messages" on public.chat_messages for insert with check (sender = 'customer');

drop policy if exists "Public can read chat messages" on public.chat_messages;
create policy "Public can read chat messages" on public.chat_messages for select using (true);

drop policy if exists "Admins can manage chat messages" on public.chat_messages;
create policy "Admins can manage chat messages" on public.chat_messages for all
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

drop policy if exists "Public can write security events" on public.security_events;
create policy "Public can write security events" on public.security_events for insert with check (true);

drop policy if exists "Admins can read security events" on public.security_events;
create policy "Admins can read security events" on public.security_events for select using (public.is_emorev_admin());

drop policy if exists "Admins can manage blocked clients" on public.blocked_clients;
create policy "Admins can manage blocked clients" on public.blocked_clients for all
using (public.is_emorev_admin()) with check (public.is_emorev_admin());

alter table public.website_settings replica identity full;
alter table public.chat_conversations replica identity full;
alter table public.chat_messages replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.website_settings;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.chat_conversations;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null;
end $$;