# Changelog

Todas as alteracoes relevantes da MARIED UNIVERSITY devem ser registradas aqui.

## [Nao lancado] - 2026-07-30

### Adicionado

- ADR-011 aprovando Backend First para operacoes sensiveis.
- Baseline local reproduzivel `20260730000100_core_identity_and_tenants.sql` criada a partir do schema publico remoto para permitir resets locais limpos antes da SPEC-001.
- Teste SQL transacional ampliado para cobrir isolamento, papeis, membros inativos e protecao do ultimo owner ativo da SPEC-001.

### Alterado

- Migration local `core_identity_ownership_and_roles` revisada para usar `tenants.created_by` como fonte oficial do owner, helpers internos em schema privado, politicas mais restritas para `tenant_members` e bloqueio transacional por tenant na protecao do ultimo owner.
- Documentacao do estado local da migration ainda nao aplicada no Supabase.
- Validacao local descartavel da SPEC-001 registrada como aprovada com dois ciclos de `db reset --local` e dois ciclos do teste SQL transacional.
- Guia de desenvolvimento com IA atualizado com regras Backend First e seguranca server-side.

## [0.1.0] - 2026-07-29

### Adicionado

- Fundacao documental do repositorio.
- Estrutura inicial de documentacao.
- Estrutura inicial de especificacoes.
- ADRs arquiteturais aprovados.
- Guia inicial para Codex e agentes.
