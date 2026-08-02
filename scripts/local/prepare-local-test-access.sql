\set ON_ERROR_STOP on

-- Local-only helper for Supabase CLI databases.
-- Usage:
--   Get-Content -LiteralPath 'scripts\local\prepare-local-test-access.sql' |
--     docker exec -i supabase_db_maried-university psql -U postgres -d postgres -v test_email='user@example.test'
--
-- This script does not create Auth users and never stores passwords.
-- Create the test user manually in local Supabase Auth first, then run this
-- against the local Docker database only.

\if :{?test_email}
\else
  \echo 'Missing required psql variable: test_email'
  \quit 1
\endif

begin;

create temp table local_test_access_input (
  email text not null
) on commit drop;

insert into local_test_access_input (email)
values (:'test_email');

do $$
declare
  selected_email text;
  selected_user_id uuid;
  selected_tenant_id uuid;
begin
  select lower(trim(email))
    into selected_email
  from local_test_access_input
  limit 1;

  if selected_email is null or selected_email = '' then
    raise exception 'test_email must not be empty';
  end if;

  select id
    into selected_user_id
  from auth.users
  where lower(email) = selected_email
  order by created_at desc
  limit 1;

  if selected_user_id is null then
    raise exception 'No local auth.users row found for %', selected_email;
  end if;

  if not exists (
    select 1
    from auth.users
    where id = selected_user_id
      and email_confirmed_at is not null
      and confirmed_at is not null
  ) then
    raise exception 'Local Auth user % is not confirmed', selected_email;
  end if;

  insert into public.profiles (id, full_name, is_platform_admin)
  values (selected_user_id, 'Usuario Local MARIED', false)
  on conflict (id) do update
    set updated_at = now(),
        is_platform_admin = false;

  select id
    into selected_tenant_id
  from public.tenants
  where created_by = selected_user_id
    and name = 'Tenant Local de Teste MARIED'
    and deleted_at is null
  order by created_at desc
  limit 1;

  if selected_tenant_id is null then
    insert into public.tenants (
      name,
      trade_name,
      email,
      status,
      timezone,
      locale,
      created_by
    )
    values (
      'Tenant Local de Teste MARIED',
      'MARIED Local',
      selected_email,
      'active',
      'America/Fortaleza',
      'pt-BR',
      selected_user_id
    )
    returning id into selected_tenant_id;
  else
    update public.tenants
       set status = 'active',
           timezone = 'America/Fortaleza',
           locale = 'pt-BR',
           updated_at = now()
     where id = selected_tenant_id;
  end if;

  insert into public.tenant_members (
    tenant_id,
    user_id,
    role,
    is_active
  )
  values (
    selected_tenant_id,
    selected_user_id,
    'owner',
    true
  )
  on conflict (tenant_id, user_id) do update
    set role = 'owner',
        is_active = true,
        updated_at = now();
end $$;

commit;

select
  left(u.id::text, 8) as user_id_prefix,
  u.email_confirmed_at is not null as email_confirmed,
  p.id is not null as has_profile,
  left(t.id::text, 8) as tenant_id_prefix,
  t.status as tenant_status,
  tm.role,
  tm.is_active as membership_active
from auth.users u
join public.profiles p on p.id = u.id
join public.tenant_members tm on tm.user_id = u.id
join public.tenants t on t.id = tm.tenant_id
where lower(u.email) = lower(:'test_email')
order by t.created_at desc;
