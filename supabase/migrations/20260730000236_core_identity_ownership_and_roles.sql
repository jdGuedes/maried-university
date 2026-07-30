-- SPEC-001 | Core identity ownership and tenant roles
-- Depends on the already-applied migration `core_identity_and_tenants`.
-- This migration is prepared locally and must not be applied without explicit approval.

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create or replace function private.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  column_names text[];
  column_values text[];
begin
  column_names := array['id'];
  column_values := array[quote_literal(new.id)];

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'email'
  ) then
    column_names := column_names || array['email'];
    column_values := column_values || array[quote_nullable(new.email)];
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'full_name'
  ) then
    column_names := column_names || array['full_name'];
    column_values := column_values || array[quote_nullable(new.raw_user_meta_data ->> 'full_name')];
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'avatar_url'
  ) then
    column_names := column_names || array['avatar_url'];
    column_values := column_values || array[quote_nullable(new.raw_user_meta_data ->> 'avatar_url')];
  end if;

  execute format(
    'insert into public.profiles (%s) values (%s) on conflict (id) do nothing',
    array_to_string(column_names, ', '),
    array_to_string(column_values, ', ')
  );

  return new;
end;
$$;

revoke all on function private.handle_new_auth_user_profile() from public;
revoke all on function private.handle_new_auth_user_profile() from anon;
revoke all on function private.handle_new_auth_user_profile() from authenticated;

drop trigger if exists on_auth_user_created_create_profile on auth.users;

create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row
  execute function private.handle_new_auth_user_profile();

create or replace function private.is_active_tenant_member(
  target_tenant_id uuid,
  target_user_id uuid,
  allowed_roles public.member_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = target_tenant_id
      and tm.user_id = target_user_id
      and tm.is_active = true
      and (allowed_roles is null or tm.role = any(allowed_roles))
  );
$$;

revoke all on function private.is_active_tenant_member(uuid, uuid, public.member_role[]) from public;
revoke all on function private.is_active_tenant_member(uuid, uuid, public.member_role[]) from anon;
revoke all on function private.is_active_tenant_member(uuid, uuid, public.member_role[]) from authenticated;

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = private, public, pg_temp
as $$
  select private.is_active_tenant_member(target_tenant, (select auth.uid()), null::public.member_role[]);
$$;

revoke all on function public.is_tenant_member(uuid) from public;
revoke all on function public.is_tenant_member(uuid) from anon;
grant execute on function public.is_tenant_member(uuid) to authenticated;

create or replace function public.has_tenant_role(
  target_tenant_id uuid,
  allowed_roles public.member_role[]
)
returns boolean
language sql
stable
security definer
set search_path = private, public, pg_temp
as $$
  select private.is_active_tenant_member(target_tenant_id, (select auth.uid()), allowed_roles);
$$;

revoke all on function public.has_tenant_role(uuid, public.member_role[]) from public;
revoke all on function public.has_tenant_role(uuid, public.member_role[]) from anon;
grant execute on function public.has_tenant_role(uuid, public.member_role[]) to authenticated;

create or replace function private.add_tenant_owner_member()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.created_by is null then
    raise exception 'tenant owner creation requires tenants.created_by';
  end if;

  insert into public.tenant_members (tenant_id, user_id, role, is_active)
  values (new.id, new.created_by, 'owner', true)
  on conflict (tenant_id, user_id) do update
    set role = 'owner',
        is_active = true;

  return new;
end;
$$;

revoke all on function private.add_tenant_owner_member() from public;
revoke all on function private.add_tenant_owner_member() from anon;
revoke all on function private.add_tenant_owner_member() from authenticated;

drop trigger if exists on_tenant_created_add_owner on public.tenants;

create trigger on_tenant_created_add_owner
  after insert on public.tenants
  for each row
  execute function private.add_tenant_owner_member();

create or replace function private.active_owner_count(target_tenant_id uuid)
returns integer
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select count(*)::integer
  from public.tenant_members tm
  where tm.tenant_id = target_tenant_id
    and tm.role = 'owner'
    and tm.is_active = true;
$$;

revoke all on function private.active_owner_count(uuid) from public;
revoke all on function private.active_owner_count(uuid) from anon;
revoke all on function private.active_owner_count(uuid) from authenticated;

create or replace function private.protect_tenant_member_invariants()
returns trigger
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
begin
  -- Serialize membership changes per tenant before checking owner invariants.
  perform 1
  from public.tenants t
  where t.id = old.tenant_id
  for update;

  if tg_op = 'UPDATE' then
    if new.tenant_id <> old.tenant_id then
      raise exception 'tenant_members.tenant_id cannot be changed';
    end if;

    if new.user_id <> old.user_id then
      raise exception 'tenant_members.user_id cannot be changed';
    end if;

    if old.role = 'owner'
      and old.is_active = true
      and (new.role <> 'owner' or new.is_active = false)
      and private.active_owner_count(old.tenant_id) <= 1
    then
      raise exception 'cannot remove, deactivate, or demote the last active owner';
    end if;

    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.role = 'owner' and old.user_id = (select auth.uid()) then
      raise exception 'owner cannot remove its own tenant membership directly';
    end if;

    if old.role = 'owner'
      and old.is_active = true
      and private.active_owner_count(old.tenant_id) <= 1
    then
      raise exception 'cannot delete the last active owner';
    end if;

    return old;
  end if;

  return null;
end;
$$;

revoke all on function private.protect_tenant_member_invariants() from public;
revoke all on function private.protect_tenant_member_invariants() from anon;
revoke all on function private.protect_tenant_member_invariants() from authenticated;

drop trigger if exists protect_tenant_member_invariants on public.tenant_members;

create trigger protect_tenant_member_invariants
  before update or delete on public.tenant_members
  for each row
  execute function private.protect_tenant_member_invariants();

drop policy if exists tenant_members_insert_owner_or_admin on public.tenant_members;
drop policy if exists tenant_members_update_owner_or_admin on public.tenant_members;
drop policy if exists tenant_members_delete_owner on public.tenant_members;

create policy tenant_members_insert_owner_or_admin
  on public.tenant_members
  for insert
  to authenticated
  with check (
    (
      public.has_tenant_role(tenant_id, array['owner']::public.member_role[])
    )
    or (
      public.has_tenant_role(tenant_id, array['admin']::public.member_role[])
      and role = any(array['manager', 'operator', 'viewer']::public.member_role[])
      and is_active = true
    )
  );

create policy tenant_members_update_owner_or_admin
  on public.tenant_members
  for update
  to authenticated
  using (
    public.has_tenant_role(tenant_id, array['owner']::public.member_role[])
    or (
      public.has_tenant_role(tenant_id, array['admin']::public.member_role[])
      and role = any(array['manager', 'operator', 'viewer']::public.member_role[])
    )
  )
  with check (
    public.has_tenant_role(tenant_id, array['owner']::public.member_role[])
    or (
      public.has_tenant_role(tenant_id, array['admin']::public.member_role[])
      and role = any(array['manager', 'operator', 'viewer']::public.member_role[])
    )
  );

create policy tenant_members_delete_owner
  on public.tenant_members
  for delete
  to authenticated
  using (
    public.has_tenant_role(tenant_id, array['owner']::public.member_role[])
    and user_id <> (select auth.uid())
  );
