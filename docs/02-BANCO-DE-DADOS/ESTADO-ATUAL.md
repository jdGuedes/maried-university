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

Arquivo revisado localmente, ainda nao aplicado no Supabase:

- `supabase/migrations/20260730000236_core_identity_ownership_and_roles.sql`

Escopo revisado:

- schema privado `private` para funcoes internas;
- trigger para criar perfil ao cadastrar usuario no Supabase Auth;
- owner automatico ao criar tenant usando `tenants.created_by` como fonte oficial;
- funcoes `is_tenant_member` e `has_tenant_role` sem recursao de RLS e considerando apenas membros ativos;
- politicas de gestao de membros por owner/admin;
- protecoes contra movimentacao de vinculos entre tenants, alteracao de usuario do vinculo e perda do ultimo owner ativo;
- bloqueio transacional da linha do tenant antes de validar invariantes de owner, reduzindo risco de corrida em remocoes/desativacoes simultaneas;
- teste SQL de isolamento entre dois usuarios e dois tenants.

## Testes

Validacao local descartavel aprovada em 2026-07-30:

- `npx supabase db reset --local` executado com sucesso duas vezes em banco limpo;
- `tests/sql/spec_001_core_identity_isolation.sql` executado com sucesso duas vezes contra PostgreSQL local do Supabase;
- teste cobriu dois usuarios, dois tenants, isolamento por RLS, papeis, membro inativo e protecao do ultimo owner;
- cada execucao terminou com `rollback`;
- nenhuma migration foi aplicada no Supabase remoto.

## Pendencia critica

Aplicar e validar `core_identity_ownership_and_roles` no Supabase somente apos autorizacao explicita.

A migration depende do schema real ja aplicado por `core_identity_and_tenants`, incluindo `created_by` em `tenants` e `is_active` em `tenant_members`.
