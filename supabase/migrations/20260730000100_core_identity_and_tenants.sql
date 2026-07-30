-- Core identity and tenants baseline captured from the current remote public schema.
-- This file intentionally contains only portable domain schema required before SPEC-001.

create extension if not exists pgcrypto with schema extensions;

create type public.member_role as enum (
  'owner',
  'admin',
  'manager',
  'operator',
  'viewer'
);

create type public.tenant_status as enum (
  'trial',
  'active',
  'past_due',
  'suspended',
  'cancelled'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  is_platform_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trade_name text,
  document_type text,
  document_number text,
  email text,
  phone text,
  status public.tenant_status not null default 'trial',
  timezone text not null default 'America/Fortaleza',
  locale text not null default 'pt-BR',
  stripe_customer_id text unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint tenants_document_type_check
    check (document_type = any (array['cpf'::text, 'cnpj'::text]) or document_type is null)
);

create table public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'operator',
  is_active boolean not null default true,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index tenant_members_user_idx
  on public.tenant_members using btree (user_id, tenant_id)
  where is_active = true;

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = target_tenant
      and tm.user_id = (select auth.uid())
      and tm.is_active = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy tenants_insert_authenticated
  on public.tenants
  for insert
  to authenticated
  with check (created_by = (select auth.uid()));

create policy tenants_select_members
  on public.tenants
  for select
  to authenticated
  using (public.is_tenant_member(id));

create policy tenant_members_select_members
  on public.tenant_members
  for select
  to authenticated
  using (public.is_tenant_member(tenant_id));

grant usage on schema public to anon, authenticated, service_role;
grant execute on function public.is_tenant_member(uuid) to anon, authenticated, service_role;

grant all on table public.profiles to anon, authenticated, service_role;
grant all on table public.tenants to anon, authenticated, service_role;
grant all on table public.tenant_members to anon, authenticated, service_role;
