# Changelog

Todas as alteracoes relevantes da MARIED UNIVERSITY devem ser registradas aqui.

## [Nao lancado] - 2026-07-30

### Adicionado

- Entrega A da SPEC-002 iniciada com workspace `apps/web`, Next.js 16, React 19, TypeScript strict, Tailwind CSS 4 e Lucide.
- Tokens visuais semanticos, contratos estruturais de modulos/feature flags e componentes-base minimos, incluindo primitivas de formulario, estados globais de feedback e contratos estruturais de App Shell, overlays e prompts PWA, criados em `apps/web`.
- Manifest PWA inicial, documentacao de assets de marca e manifesto tipado de assets oficiais/pendentes preparados sem editar imagens oficiais.
- Estrutura reservada de rotas, libs e testes criada em `apps/web` para proximas entregas da SPEC-002.
- Playwright local adicionado para validacao E2E visual/responsiva da fundacao frontend.
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
- Documentacao alinhada para registrar a Entrega A da SPEC-002 como concluida localmente e apontar a Entrega B como proxima etapa.
- Imagens oficiais movidas para a versao `v1` sem alteracao visual ou funcional.

### Validacao

- `npm run web:typecheck` executado com sucesso para a Entrega A.
- `npm run web:build` executado com sucesso para a Entrega A.
- `npm run web:test:e2e` executado com sucesso em 6 viewports oficiais: 360, 390, 768, 1024, 1366 e 1440 px.
- `npm audit --audit-level=high` reprovou por vulnerabilidades transitivas em Next/PostCSS/Sharp; correcao automatica segura nao aplicada porque `npm audit fix --force` sugere downgrade quebrado para Next 9.3.3.

### Alterado

- `PROJECT.md`, `README.md`, `.specs/README.md` e `CODEX_EXECUTION_PROTOCOL.md` atualizados para refletir a Entrega A concluida localmente e a Entrega B como proxima etapa segura.

- `package.json` e `package-lock.json` atualizados para workspaces npm e dependencias locais da fundacao frontend.
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
