\set ON_ERROR_STOP on

-- Local-only helper for Supabase CLI databases.
-- Usage:
--   Get-Content -LiteralPath 'scripts\local\prepare-local-pricing-profiles.sql' |
--     docker exec -i supabase_db_maried-university psql -U postgres -d postgres -v test_email='user@example.test'
--
-- This script never stores passwords and must only run against the local Docker
-- database. Rates below are synthetic test data for visual/functional validation;
-- they are not MARIED UNIVERSITY production defaults.

\if :{?test_email}
\else
  \echo 'Missing required psql variable: test_email'
  \quit 1
\endif

begin;

create temp table local_pricing_profile_input (
  email text not null
) on commit drop;

insert into local_pricing_profile_input (email)
values (:'test_email');

do $$
declare
  selected_email text;
  selected_user_id uuid;
  selected_tenant_id uuid;
  existing_profile_id uuid;
  profile record;
begin
  select lower(trim(email))
    into selected_email
  from local_pricing_profile_input
  limit 1;

  if selected_email is null or selected_email = '' then
    raise exception 'test_email must not be empty';
  end if;

  select u.id
    into selected_user_id
  from auth.users u
  where lower(u.email) = selected_email
  order by u.created_at desc
  limit 1;

  if selected_user_id is null then
    raise exception 'No local auth.users row found for %', selected_email;
  end if;

  select tm.tenant_id
    into selected_tenant_id
  from public.tenant_members tm
  join public.tenants t on t.id = tm.tenant_id
  where tm.user_id = selected_user_id
    and tm.is_active = true
    and tm.role in ('owner', 'admin')
    and t.status in ('trial', 'active')
    and t.deleted_at is null
  order by t.created_at desc
  limit 1;

  if selected_tenant_id is null then
    raise exception 'No active local owner/admin tenant found for %', selected_email;
  end if;

  for profile in
    select *
    from (values
      ('PIX'::public.commercial_profile_key, 'Pix', 'Venda direta por Pix', 0::bigint, 0, 0, 0, 0, 0, 'NONE'::public.pricing_rounding_rule, 1),
      ('CARD'::public.commercial_profile_key, 'Cartao', 'Venda direta no cartao', 99::bigint, 350, 0, 0, 0, 0, 'NONE'::public.pricing_rounding_rule, 2),
      ('RESELLER'::public.commercial_profile_key, 'Revendedora', 'Venda para revendedora', 0::bigint, 0, 1200, 0, 0, 0, 'NONE'::public.pricing_rounding_rule, 3),
      ('WHOLESALE'::public.commercial_profile_key, 'Atacado', 'Pedido de atacado', 0::bigint, 0, 0, 800, 0, 0, 'NONE'::public.pricing_rounding_rule, 4),
      ('MARKETPLACE'::public.commercial_profile_key, 'Marketplace', 'Venda em marketplace', 199::bigint, 0, 0, 0, 0, 1600, 'NONE'::public.pricing_rounding_rule, 5),
      ('CUSTOM'::public.commercial_profile_key, 'Personalizado', 'Perfil personalizado de teste local', 0::bigint, 150, 300, 0, 200, 0, 'NONE'::public.pricing_rounding_rule, 6)
    ) as profile_data(profile_key, name, description, fixed_fee_cents, tax_bps, commission_bps, discount_bps, taxes_bps, marketplace_bps, default_rounding_rule, display_order)
  loop
    select id
      into existing_profile_id
    from public.commercial_profiles cp
    where cp.tenant_id = selected_tenant_id
      and cp.profile_key = profile.profile_key
      and cp.deleted_at is null
    order by cp.created_at desc
    limit 1;

    if existing_profile_id is null then
      insert into public.commercial_profiles (
        tenant_id,
        profile_key,
        name,
        description,
        fixed_fee_cents,
        tax_bps,
        commission_bps,
        discount_bps,
        taxes_bps,
        marketplace_bps,
        default_rounding_rule,
        is_active,
        display_order,
        created_by,
        updated_by
      ) values (
        selected_tenant_id,
        profile.profile_key,
        profile.name,
        profile.description,
        profile.fixed_fee_cents,
        profile.tax_bps,
        profile.commission_bps,
        profile.discount_bps,
        profile.taxes_bps,
        profile.marketplace_bps,
        profile.default_rounding_rule,
        true,
        profile.display_order,
        selected_user_id,
        selected_user_id
      );
    else
      update public.commercial_profiles
         set name = profile.name,
             description = profile.description,
             fixed_fee_cents = profile.fixed_fee_cents,
             tax_bps = profile.tax_bps,
             commission_bps = profile.commission_bps,
             discount_bps = profile.discount_bps,
             taxes_bps = profile.taxes_bps,
             marketplace_bps = profile.marketplace_bps,
             default_rounding_rule = profile.default_rounding_rule,
             is_active = true,
             display_order = profile.display_order,
             updated_by = selected_user_id,
             updated_at = now()
       where id = existing_profile_id;
    end if;
  end loop;
end $$;

commit;

select
  cp.profile_key,
  cp.name,
  cp.is_active,
  cp.display_order,
  cp.fixed_fee_cents,
  cp.tax_bps,
  cp.commission_bps,
  cp.discount_bps,
  cp.taxes_bps,
  cp.marketplace_bps,
  cp.default_rounding_rule
from auth.users u
join public.tenant_members tm on tm.user_id = u.id
join public.commercial_profiles cp on cp.tenant_id = tm.tenant_id
where lower(u.email) = lower(:'test_email')
  and tm.is_active = true
  and cp.deleted_at is null
order by cp.display_order, cp.name;
