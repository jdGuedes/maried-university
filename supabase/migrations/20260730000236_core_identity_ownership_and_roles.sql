-- SPEC-001 | Core identity ownership and tenant roles
-- Depends on the already-applied migration `core_identity_and_tenants`.

create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
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
    column_names := column_names || 'email';
    column_values := column_values || quote_nullable(new.email);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'full_name'
  ) then
    column_names := column_names || 'full_name';
    column_values := column_values || quote_nullable(new.raw_user_meta_data ->> 'full_name');
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'avatar_url'
  ) then
    column_names := column_names || 'avatar_url';
    column_values := column_values || quote_nullable(new.raw_user_meta_data ->> 'avatar_url');
  end if;

  execute format(
    'insert into public.profiles (%s) values (%s) on conflict (id) do nothing',
    array_to_string(column_names, ', '),
    array_to_string(column_values, ', ')
  );

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user_profile() from public;

drop trigger if exists on_auth_user_created_create_profile on auth.users;

create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user_profile();

create or replace function public.has_tenant_role(
  target_tenant_id uuid,
  allowed_roles public.member_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select exists (
      select 1
      from public.tenant_members tm
      where tm.tenant_id = target_tenant_id
        and tm.user_id = (select auth.uid())
        and tm.role = any(allowed_roles)
    )),
    false
  );
$$;

revoke all on function public.has_tenant_role(uuid, public.member_role[]) from public;
grant execute on function public.has_tenant_role(uuid, public.member_role[]) to authenticated;

create or replace function public.add_tenant_owner_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'tenant owner creation requires an authenticated user';
  end if;

  insert into public.tenant_members (tenant_id, user_id, role)
  values (new.id, (select auth.uid()), 'owner')
  on conflict (tenant_id, user_id) do update
    set role = 'owner';

  return new;
end;
$$;

revoke all on function public.add_tenant_owner_member() from public;

drop trigger if exists on_tenant_created_add_owner on public.tenants;

create trigger on_tenant_created_add_owner
  after insert on public.tenants
  for each row
  execute function public.add_tenant_owner_member();

drop policy if exists tenant_members_insert_owner_or_admin on public.tenant_members;
drop policy if exists tenant_members_update_owner_or_admin on public.tenant_members;
drop policy if exists tenant_members_delete_owner on public.tenant_members;

create policy tenant_members_insert_owner_or_admin
  on public.tenant_members
  for insert
  to authenticated
  with check (
    public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy tenant_members_update_owner_or_admin
  on public.tenant_members
  for update
  to authenticated
  using (
    public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  )
  with check (
    public.has_tenant_role(tenant_id, array['owner', 'admin']::public.member_role[])
  );

create policy tenant_members_delete_owner
  on public.tenant_members
  for delete
  to authenticated
  using (
    public.has_tenant_role(tenant_id, array['owner']::public.member_role[])
    and user_id <> (select auth.uid())
  );
