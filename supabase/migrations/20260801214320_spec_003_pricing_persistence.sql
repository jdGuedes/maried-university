-- SPEC-003 | Entrega B | Secure server-side pricing persistence
-- Local migration only. Do not apply to the remote Supabase project without explicit authorization.

create type public.pricing_status as enum (
  'RASCUNHO',
  'CALCULADA',
  'APROVADA',
  'INATIVA'
);

create type public.pricing_mode as enum (
  'FIXED_PROFIT',
  'COST_MARKUP',
  'NET_MARGIN'
);

create type public.pricing_freight_mode as enum (
  'NONE',
  'UNIT',
  'TOTAL_BY_QUANTITY'
);

create type public.pricing_loss_mode as enum (
  'NONE',
  'FIXED',
  'PERCENT'
);

create type public.pricing_rounding_rule as enum (
  'NONE',
  'UP_TO_CENT',
  'ENDING_90',
  'ENDING_99'
);

create type public.commercial_profile_key as enum (
  'PIX',
  'CARD',
  'RESELLER',
  'WHOLESALE',
  'MARKETPLACE',
  'CUSTOM'
);

create table public.commercial_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  profile_key public.commercial_profile_key,
  name text not null,
  description text,
  fixed_fee_cents bigint not null default 0,
  tax_bps integer not null default 0,
  commission_bps integer not null default 0,
  discount_bps integer not null default 0,
  taxes_bps integer not null default 0,
  marketplace_bps integer not null default 0,
  desired_profit_cents bigint,
  desired_margin_bps integer,
  default_rounding_rule public.pricing_rounding_rule not null default 'NONE',
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_by uuid not null references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (tenant_id, id),
  constraint commercial_profiles_name_length_check check (char_length(btrim(name)) between 2 and 120),
  constraint commercial_profiles_money_check check (
    fixed_fee_cents >= 0
    and (desired_profit_cents is null or desired_profit_cents >= 0)
  ),
  constraint commercial_profiles_bps_check check (
    tax_bps between 0 and 10000
    and commission_bps between 0 and 10000
    and discount_bps between 0 and 10000
    and taxes_bps between 0 and 10000
    and marketplace_bps between 0 and 10000
    and (desired_margin_bps is null or desired_margin_bps between 0 and 9999)
  ),
  constraint commercial_profiles_denominator_check check (
    tax_bps + commission_bps + discount_bps + taxes_bps + marketplace_bps < 10000
  ),
  constraint commercial_profiles_display_order_check check (display_order >= 0)
);

create unique index commercial_profiles_tenant_name_active_idx
  on public.commercial_profiles (tenant_id, lower(name))
  where deleted_at is null;

create unique index commercial_profiles_tenant_key_active_idx
  on public.commercial_profiles (tenant_id, profile_key)
  where profile_key is not null and deleted_at is null;

create index commercial_profiles_tenant_active_order_idx
  on public.commercial_profiles (tenant_id, is_active, display_order)
  where deleted_at is null;

create table public.tenant_pricing_settings (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  default_commercial_profile_id uuid,
  default_rounding_rule public.pricing_rounding_rule not null default 'NONE',
  created_by uuid not null references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_pricing_settings_default_profile_fkey
    foreign key (tenant_id, default_commercial_profile_id)
    references public.commercial_profiles(tenant_id, id)
);

create table public.pricing_calculations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  product_id uuid,
  source_pricing_calculation_id uuid,
  piece_name text not null,
  notes text,
  status public.pricing_status not null default 'RASCUNHO',
  current_version_id uuid,
  created_by uuid not null references auth.users(id),
  updated_by uuid references auth.users(id),
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  inactivated_by uuid references auth.users(id),
  inactivated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint pricing_calculations_piece_name_length_check check (char_length(btrim(piece_name)) between 2 and 120),
  constraint pricing_calculations_notes_length_check check (notes is null or char_length(notes) <= 2000),
  constraint pricing_calculations_approved_state_check check (
    (status <> 'APROVADA')
    or (current_version_id is not null and approved_by is not null and approved_at is not null)
  ),
  constraint pricing_calculations_inactive_state_check check (
    (status <> 'INATIVA')
    or (inactivated_by is not null and inactivated_at is not null)
  ),
  unique (tenant_id, id),
  constraint pricing_calculations_source_tenant_fkey
    foreign key (tenant_id, source_pricing_calculation_id)
    references public.pricing_calculations(tenant_id, id)
);

create index pricing_calculations_tenant_updated_idx
  on public.pricing_calculations (tenant_id, updated_at desc);

create index pricing_calculations_tenant_status_idx
  on public.pricing_calculations (tenant_id, status);

create index pricing_calculations_tenant_piece_name_idx
  on public.pricing_calculations (tenant_id, piece_name);

create index pricing_calculations_source_idx
  on public.pricing_calculations (tenant_id, source_pricing_calculation_id)
  where source_pricing_calculation_id is not null;

create table public.pricing_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  pricing_calculation_id uuid not null,
  version_number integer not null,
  engine_version text not null,
  pricing_mode public.pricing_mode not null,
  input_snapshot jsonb not null,
  result_snapshot jsonb not null,
  cost_base_cents bigint not null,
  loss_amount_cents bigint not null,
  cost_total_cents bigint not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  constraint pricing_versions_version_number_check check (version_number > 0),
  constraint pricing_versions_money_check check (
    cost_base_cents >= 0 and loss_amount_cents >= 0 and cost_total_cents >= 0
  ),
  constraint pricing_versions_snapshot_check check (
    jsonb_typeof(input_snapshot) = 'object' and jsonb_typeof(result_snapshot) = 'object'
  ),
  constraint pricing_versions_calculation_tenant_fkey
    foreign key (tenant_id, pricing_calculation_id)
    references public.pricing_calculations(tenant_id, id)
    on delete cascade,
  unique (pricing_calculation_id, version_number),
  unique (tenant_id, id),
  unique (id, tenant_id)
);

alter table public.pricing_calculations
  add constraint pricing_calculations_current_version_fkey
  foreign key (current_version_id, tenant_id)
  references public.pricing_versions(id, tenant_id)
  deferrable initially immediate;

create index pricing_versions_tenant_calculation_version_idx
  on public.pricing_versions (tenant_id, pricing_calculation_id, version_number desc);

create table public.pricing_profile_results (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  pricing_version_id uuid not null,
  pricing_calculation_id uuid not null,
  commercial_profile_id uuid,
  profile_snapshot jsonb not null,
  break_even_price_cents bigint not null,
  minimum_recommended_price_cents bigint not null,
  technical_price_cents bigint not null,
  suggested_price_cents bigint not null,
  approved_price_cents bigint,
  effective_price_cents bigint not null,
  gross_profit_cents bigint not null,
  net_profit_cents bigint not null,
  net_margin_bps integer not null,
  alerts jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint pricing_profile_results_version_fkey
    foreign key (pricing_version_id, tenant_id)
    references public.pricing_versions(id, tenant_id)
    on delete cascade,
  constraint pricing_profile_results_calculation_tenant_fkey
    foreign key (tenant_id, pricing_calculation_id)
    references public.pricing_calculations(tenant_id, id)
    on delete cascade,
  constraint pricing_profile_results_profile_tenant_fkey
    foreign key (tenant_id, commercial_profile_id)
    references public.commercial_profiles(tenant_id, id),
  constraint pricing_profile_results_money_check check (
    break_even_price_cents >= 0
    and minimum_recommended_price_cents >= 0
    and technical_price_cents >= 0
    and suggested_price_cents >= 0
    and (approved_price_cents is null or approved_price_cents >= 0)
    and effective_price_cents >= 0
  ),
  constraint pricing_profile_results_break_even_check check (effective_price_cents >= break_even_price_cents),
  constraint pricing_profile_results_margin_check check (net_margin_bps between -10000 and 10000),
  constraint pricing_profile_results_json_check check (
    jsonb_typeof(profile_snapshot) = 'object'
    and jsonb_typeof(alerts) = 'array'
    and jsonb_typeof(errors) = 'array'
  )
);

create index pricing_profile_results_tenant_version_idx
  on public.pricing_profile_results (tenant_id, pricing_version_id);

create index pricing_profile_results_tenant_calculation_idx
  on public.pricing_profile_results (tenant_id, pricing_calculation_id);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.enforce_commercial_profile_invariants()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'UPDATE' then
    if new.tenant_id <> old.tenant_id then
      raise exception 'commercial_profiles.tenant_id cannot be changed';
    end if;

    if new.created_by <> old.created_by then
      raise exception 'commercial_profiles.created_by cannot be changed';
    end if;
  end if;

  return new;
end;
$$;

create or replace function private.enforce_tenant_pricing_settings_invariants()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'UPDATE' then
    if new.tenant_id <> old.tenant_id then
      raise exception 'tenant_pricing_settings.tenant_id cannot be changed';
    end if;

    if new.created_by <> old.created_by then
      raise exception 'tenant_pricing_settings.created_by cannot be changed';
    end if;
  end if;

  return new;
end;
$$;

create or replace function private.enforce_pricing_calculation_invariants()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'UPDATE' then
    if new.tenant_id <> old.tenant_id then
      raise exception 'pricing_calculations.tenant_id cannot be changed';
    end if;

    if new.created_by <> old.created_by then
      raise exception 'pricing_calculations.created_by cannot be changed';
    end if;

    if old.status = 'APROVADA' and new.status not in ('APROVADA', 'INATIVA') then
      raise exception 'approved pricing cannot return to draft or calculated status';
    end if;

    if old.status = 'INATIVA' and new.status <> 'INATIVA' then
      raise exception 'inactive pricing cannot be reactivated without an explicit future flow';
    end if;

    if new.status = 'APROVADA' and (new.current_version_id is null or new.approved_by is null or new.approved_at is null) then
      raise exception 'approved pricing requires current version, approver and approval timestamp';
    end if;

    if new.status = 'INATIVA' and (new.inactivated_by is null or new.inactivated_at is null) then
      raise exception 'inactive pricing requires inactivation metadata';
    end if;
  end if;

  if tg_op = 'DELETE' then
    if old.status <> 'RASCUNHO' or old.current_version_id is not null then
      raise exception 'only draft pricing without consolidated versions can be physically deleted';
    end if;

    return old;
  end if;

  return new;
end;
$$;

create or replace function private.prevent_pricing_version_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception 'pricing versions are immutable';
end;
$$;

create or replace function private.prevent_pricing_profile_result_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception 'pricing profile results are immutable';
end;
$$;

create trigger commercial_profiles_touch_updated_at
  before update on public.commercial_profiles
  for each row execute function private.touch_updated_at();

create trigger commercial_profiles_enforce_invariants
  before update on public.commercial_profiles
  for each row execute function private.enforce_commercial_profile_invariants();

create trigger tenant_pricing_settings_touch_updated_at
  before update on public.tenant_pricing_settings
  for each row execute function private.touch_updated_at();

create trigger tenant_pricing_settings_enforce_invariants
  before update on public.tenant_pricing_settings
  for each row execute function private.enforce_tenant_pricing_settings_invariants();

create trigger pricing_calculations_touch_updated_at
  before update on public.pricing_calculations
  for each row execute function private.touch_updated_at();

create trigger pricing_calculations_enforce_invariants
  before update or delete on public.pricing_calculations
  for each row execute function private.enforce_pricing_calculation_invariants();

create trigger pricing_versions_prevent_update
  before update on public.pricing_versions
  for each row execute function private.prevent_pricing_version_mutation();

create trigger pricing_versions_prevent_delete
  before delete on public.pricing_versions
  for each row execute function private.prevent_pricing_version_mutation();

create trigger pricing_profile_results_prevent_update
  before update on public.pricing_profile_results
  for each row execute function private.prevent_pricing_profile_result_mutation();

create trigger pricing_profile_results_prevent_delete
  before delete on public.pricing_profile_results
  for each row execute function private.prevent_pricing_profile_result_mutation();

create or replace function private.require_pricing_actor(target_tenant_id uuid)
returns uuid
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_id uuid;
begin
  actor_id := (select auth.uid());

  if actor_id is null then
    raise exception 'authenticated user is required';
  end if;

  if not public.has_tenant_role(target_tenant_id, array['owner', 'admin']::public.member_role[]) then
    raise exception 'owner or admin role is required for pricing operations';
  end if;

  return actor_id;
end;
$$;

revoke all on function private.require_pricing_actor(uuid) from public;
revoke all on function private.require_pricing_actor(uuid) from anon;
revoke all on function private.require_pricing_actor(uuid) from authenticated;

revoke all on function private.touch_updated_at() from public;
revoke all on function private.enforce_commercial_profile_invariants() from public;
revoke all on function private.enforce_tenant_pricing_settings_invariants() from public;
revoke all on function private.enforce_pricing_calculation_invariants() from public;
revoke all on function private.prevent_pricing_version_mutation() from public;
revoke all on function private.prevent_pricing_profile_result_mutation() from public;

create or replace function public.create_pricing_calculation_tx(
  target_tenant_id uuid,
  piece_name text,
  notes text,
  product_id uuid,
  input_snapshot jsonb,
  result_snapshot jsonb,
  profile_results jsonb,
  engine_version text
)
returns uuid
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  actor_id uuid;
  calculation_id uuid;
  version_id uuid;
  profile_item jsonb;
begin
  actor_id := private.require_pricing_actor(target_tenant_id);

  if jsonb_typeof(input_snapshot) <> 'object' or jsonb_typeof(result_snapshot) <> 'object' then
    raise exception 'pricing snapshots must be json objects';
  end if;

  if jsonb_typeof(profile_results) <> 'array' or jsonb_array_length(profile_results) = 0 then
    raise exception 'profile results must be a non-empty json array';
  end if;

  insert into public.pricing_calculations (
    tenant_id,
    product_id,
    piece_name,
    notes,
    status,
    created_by,
    updated_by
  ) values (
    target_tenant_id,
    product_id,
    piece_name,
    notes,
    'CALCULADA',
    actor_id,
    actor_id
  ) returning id into calculation_id;

  insert into public.pricing_versions (
    tenant_id,
    pricing_calculation_id,
    version_number,
    engine_version,
    pricing_mode,
    input_snapshot,
    result_snapshot,
    cost_base_cents,
    loss_amount_cents,
    cost_total_cents,
    created_by
  ) values (
    target_tenant_id,
    calculation_id,
    1,
    engine_version,
    (result_snapshot ->> 'pricingMode')::public.pricing_mode,
    input_snapshot,
    result_snapshot,
    (result_snapshot ->> 'costBaseCents')::bigint,
    (result_snapshot ->> 'lossAmountCents')::bigint,
    (result_snapshot ->> 'costTotalCents')::bigint,
    actor_id
  ) returning id into version_id;

  for profile_item in select value from jsonb_array_elements(profile_results)
  loop
    insert into public.pricing_profile_results (
      tenant_id,
      pricing_version_id,
      pricing_calculation_id,
      commercial_profile_id,
      profile_snapshot,
      break_even_price_cents,
      minimum_recommended_price_cents,
      technical_price_cents,
      suggested_price_cents,
      approved_price_cents,
      effective_price_cents,
      gross_profit_cents,
      net_profit_cents,
      net_margin_bps,
      alerts,
      errors
    ) values (
      target_tenant_id,
      version_id,
      calculation_id,
      nullif(profile_item ->> 'commercialProfileId', '')::uuid,
      profile_item -> 'profileSnapshot',
      (profile_item ->> 'breakEvenPriceCents')::bigint,
      (profile_item ->> 'minimumRecommendedPriceCents')::bigint,
      (profile_item ->> 'technicalPriceCents')::bigint,
      (profile_item ->> 'suggestedPriceCents')::bigint,
      nullif(profile_item ->> 'approvedPriceCents', '')::bigint,
      (profile_item ->> 'effectivePriceCents')::bigint,
      (profile_item ->> 'grossProfitCents')::bigint,
      (profile_item ->> 'netProfitCents')::bigint,
      (profile_item ->> 'netMarginBps')::integer,
      coalesce(profile_item -> 'alerts', '[]'::jsonb),
      coalesce(profile_item -> 'errors', '[]'::jsonb)
    );
  end loop;

  update public.pricing_calculations
  set current_version_id = version_id,
      updated_by = actor_id
  where id = calculation_id;

  return calculation_id;
end;
$$;

create or replace function public.approve_pricing_calculation_tx(target_pricing_calculation_id uuid)
returns void
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_record public.pricing_calculations%rowtype;
  actor_id uuid;
begin
  select *
  into target_record
  from public.pricing_calculations pc
  where pc.id = target_pricing_calculation_id
  for update;

  if not found then
    raise exception 'pricing calculation not found';
  end if;

  actor_id := private.require_pricing_actor(target_record.tenant_id);

  if target_record.status = 'APROVADA' then
    return;
  end if;

  if target_record.status <> 'CALCULADA' then
    raise exception 'only calculated pricing can be approved';
  end if;

  if target_record.current_version_id is null then
    raise exception 'pricing approval requires a current version';
  end if;

  update public.pricing_calculations
  set status = 'APROVADA',
      approved_by = actor_id,
      approved_at = now(),
      updated_by = actor_id
  where id = target_pricing_calculation_id;
end;
$$;

create or replace function public.inactivate_pricing_calculation_tx(target_pricing_calculation_id uuid)
returns void
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_record public.pricing_calculations%rowtype;
  actor_id uuid;
begin
  select *
  into target_record
  from public.pricing_calculations pc
  where pc.id = target_pricing_calculation_id
  for update;

  if not found then
    raise exception 'pricing calculation not found';
  end if;

  actor_id := private.require_pricing_actor(target_record.tenant_id);

  if target_record.status = 'INATIVA' then
    return;
  end if;

  update public.pricing_calculations
  set status = 'INATIVA',
      inactivated_by = actor_id,
      inactivated_at = now(),
      updated_by = actor_id
  where id = target_pricing_calculation_id;
end;
$$;

create or replace function public.duplicate_pricing_calculation_tx(target_pricing_calculation_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  source_record public.pricing_calculations%rowtype;
  actor_id uuid;
  new_id uuid;
begin
  select *
  into source_record
  from public.pricing_calculations pc
  where pc.id = target_pricing_calculation_id
  for share;

  if not found then
    raise exception 'pricing calculation not found';
  end if;

  actor_id := private.require_pricing_actor(source_record.tenant_id);

  insert into public.pricing_calculations (
    tenant_id,
    product_id,
    source_pricing_calculation_id,
    piece_name,
    notes,
    status,
    created_by,
    updated_by
  ) values (
    source_record.tenant_id,
    source_record.product_id,
    source_record.id,
    source_record.piece_name,
    source_record.notes,
    'RASCUNHO',
    actor_id,
    actor_id
  ) returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.delete_pricing_calculation_draft_tx(target_pricing_calculation_id uuid)
returns void
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_record public.pricing_calculations%rowtype;
begin
  select *
  into target_record
  from public.pricing_calculations pc
  where pc.id = target_pricing_calculation_id
  for update;

  if not found then
    return;
  end if;

  perform private.require_pricing_actor(target_record.tenant_id);

  delete from public.pricing_calculations
  where id = target_pricing_calculation_id;
end;
$$;

revoke all on function public.create_pricing_calculation_tx(uuid, text, text, uuid, jsonb, jsonb, jsonb, text) from public;
revoke all on function public.create_pricing_calculation_tx(uuid, text, text, uuid, jsonb, jsonb, jsonb, text) from anon;
grant execute on function public.create_pricing_calculation_tx(uuid, text, text, uuid, jsonb, jsonb, jsonb, text) to authenticated;

revoke all on function public.approve_pricing_calculation_tx(uuid) from public;
revoke all on function public.approve_pricing_calculation_tx(uuid) from anon;
grant execute on function public.approve_pricing_calculation_tx(uuid) to authenticated;

revoke all on function public.inactivate_pricing_calculation_tx(uuid) from public;
revoke all on function public.inactivate_pricing_calculation_tx(uuid) from anon;
grant execute on function public.inactivate_pricing_calculation_tx(uuid) to authenticated;

revoke all on function public.duplicate_pricing_calculation_tx(uuid) from public;
revoke all on function public.duplicate_pricing_calculation_tx(uuid) from anon;
grant execute on function public.duplicate_pricing_calculation_tx(uuid) to authenticated;

revoke all on function public.delete_pricing_calculation_draft_tx(uuid) from public;
revoke all on function public.delete_pricing_calculation_draft_tx(uuid) from anon;
grant execute on function public.delete_pricing_calculation_draft_tx(uuid) to authenticated;

alter table public.commercial_profiles enable row level security;
alter table public.tenant_pricing_settings enable row level security;
alter table public.pricing_calculations enable row level security;
alter table public.pricing_versions enable row level security;
alter table public.pricing_profile_results enable row level security;

create policy commercial_profiles_select_owner_admin
  on public.commercial_profiles
  for select
  to authenticated
  using (deleted_at is null and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]));

create policy commercial_profiles_insert_owner_admin
  on public.commercial_profiles
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy commercial_profiles_update_owner_admin
  on public.commercial_profiles
  for update
  to authenticated
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]))
  with check (
    updated_by = (select auth.uid())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy tenant_pricing_settings_select_owner_admin
  on public.tenant_pricing_settings
  for select
  to authenticated
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]));

create policy tenant_pricing_settings_insert_owner_admin
  on public.tenant_pricing_settings
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy tenant_pricing_settings_update_owner_admin
  on public.tenant_pricing_settings
  for update
  to authenticated
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]))
  with check (
    updated_by = (select auth.uid())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy pricing_calculations_select_owner_admin
  on public.pricing_calculations
  for select
  to authenticated
  using (deleted_at is null and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]));

create policy pricing_calculations_insert_owner_admin
  on public.pricing_calculations
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy pricing_calculations_update_owner_admin
  on public.pricing_calculations
  for update
  to authenticated
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]))
  with check (
    updated_by = (select auth.uid())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy pricing_calculations_delete_owner_admin
  on public.pricing_calculations
  for delete
  to authenticated
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]));

create policy pricing_versions_select_owner_admin
  on public.pricing_versions
  for select
  to authenticated
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]));

create policy pricing_versions_insert_owner_admin
  on public.pricing_versions
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy pricing_profile_results_select_owner_admin
  on public.pricing_profile_results
  for select
  to authenticated
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]));

create policy pricing_profile_results_insert_owner_admin
  on public.pricing_profile_results
  for insert
  to authenticated
  with check (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[]));

revoke all on table public.commercial_profiles from anon;
revoke all on table public.tenant_pricing_settings from anon;
revoke all on table public.pricing_calculations from anon;
revoke all on table public.pricing_versions from anon;
revoke all on table public.pricing_profile_results from anon;

grant select, insert, update on table public.commercial_profiles to authenticated;
grant select, insert, update on table public.tenant_pricing_settings to authenticated;
grant select, insert, update, delete on table public.pricing_calculations to authenticated;
grant select, insert on table public.pricing_versions to authenticated;
grant select, insert on table public.pricing_profile_results to authenticated;

grant all on table public.commercial_profiles to service_role;
grant all on table public.tenant_pricing_settings to service_role;
grant all on table public.pricing_calculations to service_role;
grant all on table public.pricing_versions to service_role;
grant all on table public.pricing_profile_results to service_role;