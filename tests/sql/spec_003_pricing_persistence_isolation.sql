-- SPEC-003 | Entrega B | Pricing persistence, RLS and isolation tests.
-- Run only against a disposable local/test database. This file is wrapped in a
-- transaction and must finish with rollback.

begin;

create temporary table spec003_ids (
  key text primary key,
  value uuid not null
) on commit drop;

grant all on spec003_ids to authenticated;

insert into auth.users (id, email)
values
  ('00000000-0000-0000-0000-0000000030a1', 'spec003-owner-a@example.test'),
  ('00000000-0000-0000-0000-0000000030b1', 'spec003-owner-b@example.test'),
  ('00000000-0000-0000-0000-0000000030c1', 'spec003-admin-a@example.test'),
  ('00000000-0000-0000-0000-0000000030d1', 'spec003-operator-a@example.test'),
  ('00000000-0000-0000-0000-0000000030e1', 'spec003-inactive-a@example.test'),
  ('00000000-0000-0000-0000-0000000030f1', 'spec003-external@example.test');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000030a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.tenants (id, name, created_by)
values ('30000000-0000-0000-0000-0000000000a1', 'SPEC-003 Tenant A', '00000000-0000-0000-0000-0000000030a1');

insert into public.tenant_members (tenant_id, user_id, role, is_active)
values
  ('30000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000030c1', 'admin', true),
  ('30000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000030d1', 'operator', true),
  ('30000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000030e1', 'admin', false);

insert into public.commercial_profiles (
  id,
  tenant_id,
  profile_key,
  name,
  fixed_fee_cents,
  tax_bps,
  created_by,
  updated_by
) values (
  '31000000-0000-0000-0000-0000000000a1',
  '30000000-0000-0000-0000-0000000000a1',
  'PIX',
  'Pix Tenant A',
  0,
  1000,
  '00000000-0000-0000-0000-0000000030a1',
  '00000000-0000-0000-0000-0000000030a1'
);

select public.create_pricing_calculation_tx(
  '30000000-0000-0000-0000-0000000000a1',
  'Anel Tenant A',
  'Teste transacional',
  null,
  '{"costs":{"pieceCostCents":"1000"}}'::jsonb,
  '{"pricingMode":"FIXED_PROFIT","costBaseCents":"2000","lossAmountCents":"0","costTotalCents":"2000"}'::jsonb,
  '[{"commercialProfileId":"31000000-0000-0000-0000-0000000000a1","profileSnapshot":{"key":"PIX","name":"Pix Tenant A"},"breakEvenPriceCents":"2223","minimumRecommendedPriceCents":"3334","technicalPriceCents":"3334","suggestedPriceCents":"3334","approvedPriceCents":"","effectivePriceCents":"3334","grossProfitCents":"1334","netProfitCents":"1001","netMarginBps":"3002","alerts":[],"errors":[]}]'::jsonb,
  'pricing-engine@0.1.0'
) as tenant_a_pricing_id \gset
insert into spec003_ids (key, value) values ('tenant_a_pricing_id', :'tenant_a_pricing_id'::uuid);

select public.approve_pricing_calculation_tx((select value from spec003_ids where key = 'tenant_a_pricing_id'));
select public.duplicate_pricing_calculation_tx((select value from spec003_ids where key = 'tenant_a_pricing_id')) as tenant_a_duplicate_id \gset
insert into spec003_ids (key, value) values ('tenant_a_duplicate_id', :'tenant_a_duplicate_id'::uuid);
select public.inactivate_pricing_calculation_tx((select value from spec003_ids where key = 'tenant_a_pricing_id'));

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000030b1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.tenants (id, name, created_by)
values ('30000000-0000-0000-0000-0000000000b1', 'SPEC-003 Tenant B', '00000000-0000-0000-0000-0000000030b1');

insert into public.commercial_profiles (
  id,
  tenant_id,
  profile_key,
  name,
  created_by,
  updated_by
) values (
  '31000000-0000-0000-0000-0000000000b1',
  '30000000-0000-0000-0000-0000000000b1',
  'PIX',
  'Pix Tenant B',
  '00000000-0000-0000-0000-0000000030b1',
  '00000000-0000-0000-0000-0000000030b1'
);

select public.create_pricing_calculation_tx(
  '30000000-0000-0000-0000-0000000000b1',
  'Anel Tenant B',
  null,
  null,
  '{"costs":{"pieceCostCents":"1000"}}'::jsonb,
  '{"pricingMode":"FIXED_PROFIT","costBaseCents":"1000","lossAmountCents":"0","costTotalCents":"1000"}'::jsonb,
  '[{"commercialProfileId":"31000000-0000-0000-0000-0000000000b1","profileSnapshot":{"key":"PIX","name":"Pix Tenant B"},"breakEvenPriceCents":"1000","minimumRecommendedPriceCents":"1000","technicalPriceCents":"1000","suggestedPriceCents":"1000","approvedPriceCents":"","effectivePriceCents":"1000","grossProfitCents":"0","netProfitCents":"0","netMarginBps":"0","alerts":[],"errors":[]}]'::jsonb,
  'pricing-engine@0.1.0'
) as tenant_b_pricing_id \gset
insert into spec003_ids (key, value) values ('tenant_b_pricing_id', :'tenant_b_pricing_id'::uuid);

-- Tenant B cannot see, update, delete or operate Tenant A data.
do $$
declare
  affected_rows integer;
begin
  if exists (select 1 from public.pricing_calculations where id = (select value from spec003_ids where key = 'tenant_a_pricing_id')) then
    raise exception 'Tenant B can see Tenant A pricing calculation';
  end if;

  if exists (select 1 from public.commercial_profiles where id = '31000000-0000-0000-0000-0000000000a1') then
    raise exception 'Tenant B can see Tenant A commercial profile';
  end if;

  update public.pricing_calculations
  set piece_name = 'Cross tenant update'
  where id = (select value from spec003_ids where key = 'tenant_a_pricing_id');
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then
    raise exception 'Tenant B updated Tenant A pricing calculation';
  end if;

  delete from public.pricing_calculations
  where id = (select value from spec003_ids where key = 'tenant_a_duplicate_id');
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then
    raise exception 'Tenant B deleted Tenant A draft duplicate';
  end if;

  begin
    perform public.approve_pricing_calculation_tx((select value from spec003_ids where key = 'tenant_a_pricing_id'));
  exception when others then
    null;
  end;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000030d1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- Operator is a member but not authorized for MVP pricing persistence.
do $$
begin
  begin
    insert into public.commercial_profiles (tenant_id, name, created_by, updated_by)
    values ('30000000-0000-0000-0000-0000000000a1', 'Operator Profile', '00000000-0000-0000-0000-0000000030d1', '00000000-0000-0000-0000-0000000030d1');
  exception when others then
    null;
  end;

  if exists (select 1 from public.commercial_profiles where name = 'Operator Profile') then
    raise exception 'Operator created commercial profile';
  end if;

  begin
    perform public.create_pricing_calculation_tx(
      '30000000-0000-0000-0000-0000000000a1',
      'Operator Pricing',
      null,
      null,
      '{}'::jsonb,
      '{"pricingMode":"FIXED_PROFIT","costBaseCents":"1","lossAmountCents":"0","costTotalCents":"1"}'::jsonb,
      '[]'::jsonb,
      'pricing-engine@0.1.0'
    );
  exception when others then
    null;
  end;

  if exists (select 1 from public.pricing_calculations where piece_name = 'Operator Pricing') then
    raise exception 'Operator created pricing calculation';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000030e1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- Inactive admin membership is blocked.
do $$
begin
  if public.has_tenant_role('30000000-0000-0000-0000-0000000000a1', array['admin']::public.member_role[]) then
    raise exception 'Inactive admin passed has_tenant_role';
  end if;

  if exists (select 1 from public.pricing_calculations where id = (select value from spec003_ids where key = 'tenant_a_pricing_id')) then
    raise exception 'Inactive member can see pricing calculation';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000030c1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- Admin can create profile in own tenant and cannot create invalid percent or manipulated tenant rows.
insert into public.commercial_profiles (tenant_id, name, profile_key, created_by, updated_by)
values ('30000000-0000-0000-0000-0000000000a1', 'Admin Profile', 'CUSTOM', '00000000-0000-0000-0000-0000000030c1', '00000000-0000-0000-0000-0000000030c1');

do $$
begin
  if not exists (select 1 from public.commercial_profiles where name = 'Admin Profile') then
    raise exception 'Admin could not create own tenant profile';
  end if;

  begin
    insert into public.commercial_profiles (tenant_id, name, tax_bps, commission_bps, created_by, updated_by)
    values ('30000000-0000-0000-0000-0000000000a1', 'Invalid Percent', 9000, 1000, '00000000-0000-0000-0000-0000000030c1', '00000000-0000-0000-0000-0000000030c1');
  exception when others then
    null;
  end;

  if exists (select 1 from public.commercial_profiles where name = 'Invalid Percent') then
    raise exception 'Invalid denominator commercial profile was inserted';
  end if;

  begin
    update public.commercial_profiles
    set tenant_id = '30000000-0000-0000-0000-0000000000b1', updated_by = '00000000-0000-0000-0000-0000000030c1'
    where id = '31000000-0000-0000-0000-0000000000a1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.commercial_profiles
    where id = '31000000-0000-0000-0000-0000000000a1'
      and tenant_id = '30000000-0000-0000-0000-0000000000b1'
  ) then
    raise exception 'commercial profile tenant_id was changed';
  end if;
end;
$$;

-- Snapshot/result rows are immutable and approved pricing cannot be physically deleted.
do $$
begin
  begin
    update public.pricing_versions
    set engine_version = 'tampered'
    where pricing_calculation_id = (select value from spec003_ids where key = 'tenant_a_pricing_id');
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.pricing_versions
    where pricing_calculation_id = (select value from spec003_ids where key = 'tenant_a_pricing_id')
      and engine_version = 'tampered'
  ) then
    raise exception 'pricing version snapshot was mutated';
  end if;

  begin
    update public.pricing_profile_results
    set effective_price_cents = 1
    where pricing_calculation_id = (select value from spec003_ids where key = 'tenant_a_pricing_id');
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.pricing_profile_results
    where pricing_calculation_id = (select value from spec003_ids where key = 'tenant_a_pricing_id')
      and effective_price_cents = 1
  ) then
    raise exception 'pricing profile result was mutated';
  end if;

  begin
    delete from public.pricing_calculations
    where id = (select value from spec003_ids where key = 'tenant_a_pricing_id');
  exception when others then
    null;
  end;

  if not exists (select 1 from public.pricing_calculations where id = (select value from spec003_ids where key = 'tenant_a_pricing_id')) then
    raise exception 'approved/inactive pricing calculation was physically deleted';
  end if;
end;
$$;

-- Draft duplicate can be physically deleted by authorized admin before consolidation.
select public.delete_pricing_calculation_draft_tx((select value from spec003_ids where key = 'tenant_a_duplicate_id'));

do $$
begin
  if exists (select 1 from public.pricing_calculations where id = (select value from spec003_ids where key = 'tenant_a_duplicate_id')) then
    raise exception 'draft duplicate was not deleted by authorized admin';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000030f1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- User without membership is fully blocked.
do $$
begin
  if exists (select 1 from public.pricing_calculations) then
    raise exception 'External user can see pricing calculations';
  end if;

  begin
    perform public.duplicate_pricing_calculation_tx((select value from spec003_ids where key = 'tenant_b_pricing_id'));
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.pricing_calculations
    where source_pricing_calculation_id = (select value from spec003_ids where key = 'tenant_b_pricing_id')
  ) then
    raise exception 'External user duplicated pricing calculation';
  end if;
end;
$$;

rollback;