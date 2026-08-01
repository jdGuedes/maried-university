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

## Migration preparada localmente - SPEC-003 Entrega B

Arquivo revisado e validado localmente, ainda nao aplicado no Supabase remoto:

- `supabase/migrations/20260801214320_spec_003_pricing_persistence.sql`

Escopo implementado localmente:

- enums `pricing_status`, `pricing_mode`, `pricing_freight_mode`, `pricing_loss_mode`, `pricing_rounding_rule` e `commercial_profile_key`;
- tabelas `commercial_profiles`, `tenant_pricing_settings`, `pricing_calculations`, `pricing_versions` e `pricing_profile_results`;
- dinheiro em `bigint` de centavos e percentuais em basis points;
- constraints de valores nao negativos, percentuais validos, denominador menor que 100%, status aprovado/inativo com metadados e preco efetivo maior ou igual ao equilibrio;
- foreign keys compostas com `tenant_id` para evitar associacoes cruzadas entre tenants;
- snapshots de versao e resultados imutaveis por triggers;
- RLS habilitada em todas as tabelas expostas;
- policies limitadas a membros ativos `owner` e `admin` no MVP inicial;
- funcao privada `private.require_pricing_actor(uuid)` com `SECURITY DEFINER`, `search_path` explicito e grants revogados;
- wrappers publicos transacionais `create_pricing_calculation_tx`, `approve_pricing_calculation_tx`, `inactivate_pricing_calculation_tx`, `duplicate_pricing_calculation_tx` e `delete_pricing_calculation_draft_tx`, com execute apenas para `authenticated` e validacao interna de tenant/papel;
- teste SQL transacional `tests/sql/spec_003_pricing_persistence_isolation.sql` cobrindo dois usuarios, dois tenants, isolamento RLS, membro inativo, papel insuficiente, immutabilidade de snapshots/resultados e bloqueio de delete fisico para historico consolidado.

Validacao local descartavel em 2026-08-01:

- `npx supabase db reset --local` executado com sucesso apos a migration da Entrega B;
- `tests/sql/spec_003_pricing_persistence_isolation.sql` executado com sucesso e finalizado com `ROLLBACK`;
- `npx supabase db lint --local` executado sem erros de schema.

Pendencia critica:

- Aplicar qualquer migration da SPEC-003 no Supabase remoto somente apos autorizacao explicita.
