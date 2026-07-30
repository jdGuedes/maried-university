-- SPEC-001 | SQL isolation test for two users and two tenants.
-- Run only against a disposable local/test database. This file is not meant to be
-- applied to production and is wrapped in a transaction that rolls back.

begin;

insert into auth.users (id, email)
values
  ('00000000-0000-0000-0000-0000000000a1', 'spec001-user-a@example.test'),
  ('00000000-0000-0000-0000-0000000000b1', 'spec001-user-b@example.test');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.tenants (id, name)
values ('10000000-0000-0000-0000-0000000000a1', 'SPEC-001 Tenant A');

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.tenants (id, name)
values ('10000000-0000-0000-0000-0000000000b1', 'SPEC-001 Tenant B');

do $$
declare
  affected_rows integer;
  visible_count integer;
begin
  select count(*) into visible_count
  from public.tenants
  where id in (
    '10000000-0000-0000-0000-0000000000a1',
    '10000000-0000-0000-0000-0000000000b1'
  );

  if visible_count <> 1 then
    raise exception 'User B should see exactly one tenant, got %', visible_count;
  end if;

  if exists (
    select 1
    from public.tenants
    where id = '10000000-0000-0000-0000-0000000000a1'
  ) then
    raise exception 'User B can see tenant A';
  end if;

  update public.tenants
  set name = 'SPEC-001 Tenant A hijacked'
  where id = '10000000-0000-0000-0000-0000000000a1';

  get diagnostics affected_rows = row_count;

  if affected_rows <> 0 then
    raise exception 'User B can update tenant A';
  end if;

  delete from public.tenant_members
  where tenant_id = '10000000-0000-0000-0000-0000000000a1';

  get diagnostics affected_rows = row_count;

  if affected_rows <> 0 then
    raise exception 'User B can delete tenant A members';
  end if;
end;
$$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if not exists (
    select 1
    from public.tenant_members
    where tenant_id = '10000000-0000-0000-0000-0000000000a1'
      and user_id = '00000000-0000-0000-0000-0000000000a1'
      and role = 'owner'
  ) then
    raise exception 'User A was not automatically assigned as owner of tenant A';
  end if;

  if public.has_tenant_role(
    '10000000-0000-0000-0000-0000000000b1',
    array['owner']::public.member_role[]
  ) then
    raise exception 'User A has owner role in tenant B';
  end if;
end;
$$;

rollback;
