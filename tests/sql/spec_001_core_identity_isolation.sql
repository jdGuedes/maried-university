-- SPEC-001 | SQL isolation and role-management tests.
-- Run only against a disposable local/test database. This file is not meant to be
-- applied to production and is wrapped in a transaction that rolls back.

begin;

insert into auth.users (id, email)
values
  ('00000000-0000-0000-0000-0000000000a1', 'spec001-user-a@example.test'),
  ('00000000-0000-0000-0000-0000000000b1', 'spec001-user-b@example.test'),
  ('00000000-0000-0000-0000-0000000000c1', 'spec001-admin-c@example.test'),
  ('00000000-0000-0000-0000-0000000000d1', 'spec001-user-d@example.test'),
  ('00000000-0000-0000-0000-0000000000e1', 'spec001-external-e@example.test'),
  ('00000000-0000-0000-0000-0000000000f1', 'spec001-operator-f@example.test'),
  ('00000000-0000-0000-0000-000000000091', 'spec001-owner-g@example.test');

do $$
begin
  if not exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-0000000000a1') then
    raise exception 'Profile for user A was not created automatically';
  end if;

  if not exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-0000000000b1') then
    raise exception 'Profile for user B was not created automatically';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.tenants (id, name, created_by)
values ('10000000-0000-0000-0000-0000000000a1', 'SPEC-001 Tenant A', '00000000-0000-0000-0000-0000000000a1');

do $$
begin
  if not exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1'
      and role = 'owner'
      and is_active = true
  ) then
    raise exception 'Tenant A owner was not created automatically';
  end if;
end;
$$;

insert into public.tenant_members (tenant_id, user_id, role, is_active)
values
  ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000c1', 'admin', true),
  ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000d1', 'operator', false),
  ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000091', 'owner', true);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.tenants (id, name, created_by)
values ('10000000-0000-0000-0000-0000000000b1', 'SPEC-001 Tenant B', '00000000-0000-0000-0000-0000000000b1');

do $$
begin
  if not exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000b1'
      and user_id = '00000000-0000-0000-0000-0000000000b1'
      and role = 'owner'
      and is_active = true
  ) then
    raise exception 'Tenant B owner was not created automatically';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (select count(*) from public.tenants where id in ('10000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000b1')) <> 1 then
    raise exception 'User A should see only tenant A';
  end if;

  if exists (select 1 from public.tenants where id = '10000000-0000-0000-0000-0000000000b1') then
    raise exception 'User A can see tenant B';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  affected_rows integer;
begin
  if (select count(*) from public.tenants where id in ('10000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000b1')) <> 1 then
    raise exception 'User B should see only tenant B';
  end if;

  if exists (select 1 from public.tenants where id = '10000000-0000-0000-0000-0000000000a1') then
    raise exception 'User B can see tenant A';
  end if;

  update public.tenants
  set name = 'SPEC-001 Tenant A hijacked'
  where id = '10000000-0000-0000-0000-0000000000a1';

  get diagnostics affected_rows = row_count;

  if affected_rows <> 0 then
    raise exception 'User B can update tenant A';
  end if;

  if exists (select 1 from public.tenant_members where tenant_id = '10000000-0000-0000-0000-0000000000a1') then
    raise exception 'User B can read members from tenant A';
  end if;

  delete from public.tenant_members
  where tenant_id = '10000000-0000-0000-0000-0000000000a1';

  get diagnostics affected_rows = row_count;

  if affected_rows <> 0 then
    raise exception 'User B can delete members from tenant A';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000d1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if public.has_tenant_role('10000000-0000-0000-0000-0000000000a1', array['operator']::public.member_role[]) then
    raise exception 'Inactive member passed has_tenant_role';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000e1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  begin
    insert into public.tenant_members (tenant_id, user_id, role, is_active)
    values ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000e1', 'viewer', true);
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000e1'
  ) then
    raise exception 'External user added a member';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000c1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.tenant_members (tenant_id, user_id, role, is_active)
values ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000f1', 'operator', true);

do $$
begin
  if not exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000f1'
      and role = 'operator'
      and is_active = true
  ) then
    raise exception 'Admin allowed operation failed: add operator';
  end if;

  begin
    insert into public.tenant_members (tenant_id, user_id, role, is_active)
    values ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000e1', 'owner', true);
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000e1'
      and role = 'owner'
  ) then
    raise exception 'Admin added owner';
  end if;

  begin
    update public.tenant_members
    set role = 'owner'
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000c1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000c1'
      and role = 'owner'
  ) then
    raise exception 'Admin promoted itself to owner';
  end if;

  begin
    update public.tenant_members
    set role = 'owner'
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000f1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000f1'
      and role = 'owner'
  ) then
    raise exception 'Admin promoted another user to owner';
  end if;

  begin
    update public.tenant_members
    set role = 'viewer'
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1'
      and role <> 'owner'
  ) then
    raise exception 'Admin demoted owner';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  begin
    update public.tenant_members
    set tenant_id = '10000000-0000-0000-0000-0000000000b1'
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000f1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000b1'
      and user_id = '00000000-0000-0000-0000-0000000000f1'
  ) then
    raise exception 'tenant_id was changed in an existing membership';
  end if;

  begin
    update public.tenant_members
    set user_id = '00000000-0000-0000-0000-0000000000e1'
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000f1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000e1'
  ) then
    raise exception 'user_id was changed in an existing membership';
  end if;

  begin
    delete from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1';
  exception when others then
    null;
  end;

  if not exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1'
      and role = 'owner'
      and is_active = true
  ) then
    raise exception 'Owner removed its own line directly while another owner existed';
  end if;
  delete from public.tenant_members
  where tenant_id = '10000000-0000-0000-0000-0000000000a1'
    and user_id = '00000000-0000-0000-0000-000000000091';

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-000000000091'
  ) then
    raise exception 'Allowed owner removal did not complete';
  end if;

  begin
    update public.tenant_members
    set is_active = false
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1'
      and is_active = false
  ) then
    raise exception 'Last active owner was deactivated';
  end if;

  begin
    update public.tenant_members
    set role = 'admin'
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1';
  exception when others then
    null;
  end;

  if exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1'
      and role <> 'owner'
  ) then
    raise exception 'Last active owner was demoted';
  end if;

  begin
    delete from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1';
  exception when others then
    null;
  end;

  if not exists (
    select 1 from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1'
      and role = 'owner'
      and is_active = true
  ) then
    raise exception 'Owner removed its own line directly or last owner was removed';
  end if;
end;
$$;

rollback;
