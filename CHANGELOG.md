# Changelog

Todas as alteracoes relevantes da MARIED UNIVERSITY devem ser registradas aqui.

## [Nao lancado] - 2026-07-30

### Adicionado

- SPEC-003 Entrega D implementada localmente com comparacao simultanea dos perfis comerciais ativos, prioridade visual Pix/Cartao/Revendedora/Atacado/Marketplace/Personalizado, seletor de arredondamento, cadeia preco tecnico -> sugerido -> aprovado, alertas por perfil e scripts locais seguros para preparar acesso/perfis sinteticos de teste.

- SPEC-003 Entrega C implementada localmente com rota `/precificacao` funcional, formulario inicial de custos/frete/perdas/modo de precificacao, Server Action de preview oficial, exibicao de resultado e testes unitarios/integracao/E2E aplicaveis.

- SPEC-003 Entrega B implementada localmente com migration de persistencia do Precificador, RLS por tenant, funcoes transacionais server-side, teste SQL de isolamento e servico server-side que reutiliza `packages/pricing-engine` para o calculo oficial.
- Teste de integracao server-side do Precificador adicionado para validar DTO bigint, ignorar tenant/valores derivados manipulados, bloquear papeis nao aprovados e persistir via RPC transacional.
- SPEC-003 v1.0 do Precificador Inteligente aprovada para implementacao documental, incorporando decisoes do Product Owner sobre perda percentual, frete MVP, taxas por tenant/perfil, permissoes, preco de equilibrio, estados, duplicacao, aprovacao, exclusao/inativacao e modelo de dados futuro.
- Implementation log da revisao e aprovacao da SPEC-003 criado em `docs/implementation-log/2026-08-01-spec-003-revisao-aprovacao.md`.
- SPEC-003 do Precificador Inteligente criada como proposta para aprovacao, documentando regras de negocio, formulas, perfis comerciais, modelo de dados proposto, RLS, seguranca, testes, criterios de aceite, pendencias de produto e plano de implementacao futuro, sem implementacao funcional.
- Implementation log documental da criacao da SPEC-003 criado em docs/implementation-log/2026-08-01-spec-003-precificador-criacao.md.
- Entrega F da SPEC-002 concluida localmente com validacao final da fundacao frontend, acessibilidade, responsividade, performance, bundle, varredura de segredos, Security Gate e Frontend Gate.
- Implementation log da Entrega F criado em `docs/implementation-log/2026-08-01-spec-002-entrega-f.md`.
- Entrega E da SPEC-002 implementada com manifest Next.js, icones PWA 192/512/maskable, Apple touch icon, service worker versionado, fallback offline publico, prompts controlados de instalacao/atualizacao, estado offline/reconectado e matriz conservadora de cache.
- Documentacao PWA criada em `docs/07-PADROES-DE-DESENVOLVIMENTO/PWA-CACHE-OFFLINE.md`.
- Testes unitarios, integracao e E2E adicionados para manifest, service worker, cache seguro, instalacao simulada, fallback offline e Cache Storage.
- Entrega C da SPEC-002 implementada com splash real, login por e-mail e senha, recuperacao neutra, redefinicao de senha, callback seguro, logout, allow-list de redirects, validacoes de formulario, foco acessivel e testes unitarios/integracao/E2E.
- Vitest adicionado ao workspace web para testes unitarios e de integracao da autenticacao.
- Entrega B da SPEC-002 implementada com `@supabase/ssr`, `@supabase/supabase-js`, clientes Supabase browser/server, proxy Next.js de sessao, protecao de rotas e resolucao server-side inicial de usuario, profile, tenant, vinculo ativo e papel.
- Rotas estruturais seguras `/login`, `/inicio` e `/acesso-negado` adicionadas para validar acesso sem implementar o fluxo visual de login da Entrega C.
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

- SPEC-002 v1.1 registrada como concluida com ressalvas apos a Entrega F.
- Fundacao frontend consolidada como fase implementada e validada localmente antes dos modulos funcionais.
- Documentacao alinhada para registrar as Entregas A, B, C, D, E e F da SPEC-002 como concluidas.
- Imagens oficiais movidas para a versao `v1` sem alteracao visual ou funcional.

### Validacao

- SPEC-003 Entrega D: `npm run pricing:test`, `pricing:typecheck`, `pricing:build`, `pricing:lint`, `web:test:unit`, `web:test:integration`, `web:typecheck`, `web:build` e `web:test:e2e` aprovados; E2E autenticado da tela `/precificacao` validado com Chrome temporario isolado, 6 perfis, arredondamento `Final .99`, alerta de margem baixa e screenshots em 6 viewports.

- SPEC-003 Entrega C: `npm run pricing:test`, `pricing:typecheck`, `pricing:build`, `pricing:lint`, `web:test:unit`, `web:test:integration`, `web:typecheck`, `web:build` e `web:test:e2e` aprovados; E2E autenticado da tela permanece `NAO VALIDADO` sem harness seguro.
- SPEC-003 Entrega C: `npm run web:lint` nao esta disponivel no workspace atual; `npm audit --audit-level=high` segue reprovado por ressalva herdada Next/PostCSS/Sharp.

- SPEC-003 Entrega B: `npx supabase db reset --local` executado com sucesso em banco local descartavel; migrations aplicadas: `20260730000100`, `20260730000236`, `20260801214320`.
- SPEC-003 Entrega B: `tests/sql/spec_003_pricing_persistence_isolation.sql` executado com sucesso contra PostgreSQL local do Supabase e finalizado com `ROLLBACK`.
- SPEC-003 Entrega B: `npx supabase db lint --local` executado sem erros de schema apos correcao de warning.
- SPEC-003 Entrega B: `npm run pricing:test` aprovado com 23 testes; `npm run web:test:integration` aprovado com 19 testes; `npm run pricing:typecheck`, `npm run web:typecheck`, `npm run pricing:lint` e `npm run web:build` aprovados.
- `npm run web:test:unit` executado com sucesso para 15 testes apos a Entrega F.
- `npm run web:test:integration` executado com sucesso para 11 testes apos a Entrega F.
- `npm run web:typecheck` executado com sucesso apos a Entrega F.
- `npm run web:build` executado com sucesso apos a Entrega F, com 17 paginas e proxy ativo.
- `npm exec -w apps/web -- playwright test tests/e2e/pwa.spec.ts` executado com sucesso para 30 testes PWA em 6 viewports.
- `npm run web:test:e2e` executado com sucesso para 78 testes em 6 viewports apos a correcao PWA da Entrega F.
- `npm audit --audit-level=high` segue reprovando por 3 vulnerabilidades high transitivas conhecidas em Next/PostCSS/Sharp; `npm audit fix --force` nao aplicado por sugerir downgrade quebrado para Next 9.3.3.
- Varredura de segredos, links Markdown locais, arquivos zero-byte, screenshots E2E e bundle executados na Entrega F.
- E2E PWA isolado executado com sucesso para 30 testes em 6 viewports, cobrindo manifest, icones, instalacao simulada, service worker, Cache Storage e fallback offline.
- `npm run web:test:e2e` executado com sucesso para 78 testes em 6 viewports apos a Entrega E.
- Validacao local descartavel da SPEC-001 registrada como aprovada com dois ciclos de `db reset --local` e dois ciclos do teste SQL transacional.

### Alterado

- Preview oficial do Precificador atualizado para ignorar filtros de perfil enviados pelo cliente e calcular todos os perfis comerciais ativos no backend.
- Interface de `/precificacao` evoluida para comparacao multi-perfil e arredondamento sem criar persistencia nova.

- Navegacao do App Shell atualizada para marcar `/precificacao` como modulo disponivel, mantendo Estoque, Fornecedores e Minicursos como `COMING_SOON`.

- `apps/web/package.json` e `package-lock.json` atualizados para declarar o workspace `@maried-university/pricing-engine` como dependencia do app web, permitindo reutilizacao server-side do motor oficial sem duplicar formulas.
- Documentacao de banco, estado do projeto e motor de precificacao atualizada para registrar a Entrega B como camada local de persistencia/backend ainda nao aplicada no Supabase remoto.
- `apps/web/lib/pwa/cache-policy.ts` alinhado ao service worker para tratar `apikey` e `x-client-info` como headers sensiveis e Network Only.
- Teste unitario de cache PWA ampliado para cobrir headers sensiveis do Supabase.
- `PROJECT.md`, `README.md`, `.specs/README.md`, SPEC-002, `docs/PROJECT_STATE.md`, `ARCHITECTURE_DECISIONS.md`, `apps/web/README.md` e documentacao PWA atualizados para refletir SPEC-002 concluida com ressalvas.
- `package.json` e `package-lock.json` atualizados ao longo da SPEC-002 para workspaces npm, dependencias frontend/Supabase SSR e testes unitarios/integracao.
- Migration local `core_identity_ownership_and_roles` revisada para usar `tenants.created_by` como fonte oficial do owner, helpers internos em schema privado, politicas mais restritas para `tenant_members` e bloqueio transacional por tenant na protecao do ultimo owner.
- Documentacao do estado local da migration ainda nao aplicada no Supabase.
- Guia de desenvolvimento com IA atualizado com regras Backend First e seguranca server-side.

## [0.1.0] - 2026-07-29

### Adicionado

- SPEC-003 Entrega D implementada localmente com comparacao simultanea dos perfis comerciais ativos, prioridade visual Pix/Cartao/Revendedora/Atacado/Marketplace/Personalizado, seletor de arredondamento, cadeia preco tecnico -> sugerido -> aprovado, alertas por perfil e scripts locais seguros para preparar acesso/perfis sinteticos de teste.

- SPEC-003 Entrega C implementada localmente com rota `/precificacao` funcional, formulario inicial de custos/frete/perdas/modo de precificacao, Server Action de preview oficial, exibicao de resultado e testes unitarios/integracao/E2E aplicaveis.

- Fundacao documental do repositorio.
- Estrutura inicial de documentacao.
- Estrutura inicial de especificacoes.
- ADRs arquiteturais aprovados.
- Guia inicial para Codex e agentes.
