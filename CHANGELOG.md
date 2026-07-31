# Changelog

Todas as alteracoes relevantes da MARIED UNIVERSITY devem ser registradas aqui.

## [Nao lancado] - 2026-07-30

### Adicionado

- Politica permanente de documentacao continua em `docs/implementation-log/`, com README de governanca e template oficial para registros por entrega.
- Governanca de documentacao continua finalizada em `CODEX_EXECUTION_PROTOCOL.md`, `README.md`, SPEC-002 v1.1 e `docs/GOAL_MASTER.md`.
- ADR-011 aprovando Backend First para operacoes sensiveis.
- SPEC-002 v1.1 aprovada como contrato para fundacao frontend, autenticacao, PWA e App Shell da usuaria final.
- Referencias visuais oficiais organizadas em `references/v1/` com governanca documental em `references/README.md`.
- Pastas documentais `references/brand/`, `references/futuras/` e `references/archive/` preparadas sem criar assets novos.
- ZIP original `references/archive/MARIED_MVP_SPEC_v2.zip` preservado como fonte imutavel de auditoria.
- Baseline local reproduzivel `20260730000100_core_identity_and_tenants.sql` criada a partir do schema publico remoto para permitir resets locais limpos antes da SPEC-001.
- Teste SQL transacional ampliado para cobrir isolamento, papeis, membros inativos e protecao do ultimo owner ativo da SPEC-001.


### Versao documental

- Aprovacao da SPEC-002 v1.1 registrada sem marcar implementacao funcional.
- Fundacao frontend consolidada como proxima fase documental do projeto.
- Documentacao alinhada para apontar a Entrega A da SPEC-002 como proximo passo.
- Imagens oficiais movidas para a versao `v1` sem alteracao visual ou funcional.

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
