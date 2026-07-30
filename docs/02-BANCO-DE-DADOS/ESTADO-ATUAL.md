# Estado Atual do Banco

## Projeto Supabase

- Projeto: `maried-university`
- Project ID: `yotjgorlqybhsexwrryy`
- Regiao: `sa-east-1`
- Banco: PostgreSQL 17
- Status: `ACTIVE_HEALTHY`

## Implementado

Migration confirmada: `core_identity_and_tenants`

Objetos implementados:

- `profiles`
- `tenants`
- `tenant_members`
- enum `tenant_status`
- enum `member_role`
- indice `tenant_members_user_idx`
- funcao `is_tenant_member`
- RLS inicial
- politicas iniciais

## Migration preparada localmente

Arquivo criado no repositorio, ainda nao aplicado no Supabase:

- `supabase/migrations/20260730000236_core_identity_ownership_and_roles.sql`

Escopo:

- trigger para criar perfil ao cadastrar usuario no Supabase Auth;
- owner automatico ao criar tenant;
- funcao `has_tenant_role`;
- politicas de gestao de membros por owner/admin;
- teste SQL de isolamento entre dois usuarios e dois tenants.

## Pendencia critica

Aplicar e validar `core_identity_ownership_and_roles` no Supabase somente apos autorizacao explicita.
