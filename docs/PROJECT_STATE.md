# Project State - MARIED UNIVERSITY

Ultima atualizacao: 2026-08-01

## Estado Real

- Projeto: MARIED UNIVERSITY.
- Branch: `agent/initial-project-foundation`.
- HEAD antes da Entrega F: `04e974f feat(pwa): implement spec 002 secure offline foundation`.
- SPEC atual: SPEC-003 Precificador Inteligente v1.0 aprovada para implementacao.
- Entregas concluidas: SPEC-001; SPEC-002 Entregas A, B, C, D, E e F.
- Entrega atual: SPEC-003 Entrega B implementada localmente.
- Proxima etapa recomendada: Entrega C da SPEC-003, limitada a interface funcional inicial do Precificador, somente apos autorizacao explicita.

## Implementacoes Existentes

- SPEC-003 do Precificador Inteligente existe como contrato documental aprovado em `.specs/003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md`.
- Entrega A da SPEC-003 implementada em `packages/pricing-engine` com motor matematico puro, contratos tipados e testes matematicos, sem UI, banco, migration, Supabase ou persistencia.
- Entrega B da SPEC-003 implementada localmente com migration de persistencia, RLS por tenant, wrappers transacionais, servico server-side oficial e testes SQL/integracao, sem UI funcional e sem alteracao remota.
- Frontend Next.js 16 com App Router, React 19, TypeScript strict, Tailwind CSS 4 e Lucide.
- Tokens visuais oficiais em `apps/web/styles/tokens.css` e contratos em `apps/web/lib/design/tokens.ts`.
- Supabase browser/server clients com `@supabase/ssr`.
- Proxy de sessao e rotas protegidas.
- Fluxos de splash, login, recuperacao, redefinicao, callback e logout.
- App Shell autenticado com sidebar desktop, topbar, menu da usuaria e navegacao mobile.
- Dashboard estrutural, Minha Conta, Minha Assinatura e portas futuras dos modulos.
- Estados oficiais de modulo: `AVAILABLE`, `LOCKED`, `COMING_SOON`, `DISABLED`, `MAINTENANCE`.
- Manifest PWA, icones PNG/SVG, Apple touch icon, rota `/offline`, service worker versionado, fallback offline seguro, prompts controlados de instalacao/atualizacao e cache conservador.

## Contratos Existentes

- `apps/web/lib/access/session-context.ts`: resolucao server-side de usuario, profile, tenant, vinculo e role.
- `apps/web/lib/auth/redirects.ts`: allow-list de destinos autenticados.
- `apps/web/lib/modules/navigation.ts`: navegacao, estados oficiais e feature flags estruturais.
- `apps/web/lib/pwa/cache-policy.ts`: matriz conservadora de cache PWA, incluindo bloqueio para headers `authorization`, `apikey` e `x-client-info`.
- `apps/web/public/sw.js`: service worker estatico versionado com allow-list de assets seguros.
- `packages/pricing-engine/src`: contratos e motor matematico puro do Precificador Inteligente, usando `bigint` em centavos e basis points.


## Ultimos Resultados Locais da SPEC-003 Entrega B

- `docker version`, `docker info`, `docker context ls`, `npx supabase --version` e `npx supabase status`: ambiente local validado com Docker Desktop Linux Engine e Supabase CLI `2.110.0`.
- `npx supabase db reset --local`: aprovado em banco local descartavel apos a migration `20260801214320_spec_003_pricing_persistence.sql`.
- `tests/sql/spec_003_pricing_persistence_isolation.sql`: aprovado contra PostgreSQL local do Supabase e finalizado com `ROLLBACK`.
- `npx supabase db lint --local`: aprovado sem erros de schema.
- `npm run pricing:test`: aprovado, 23 testes.
- `npm run web:test:integration`: aprovado, 19 testes.
- `npm run pricing:typecheck`: aprovado.
- `npm run web:typecheck`: aprovado.
- `npm run pricing:lint`: aprovado.
- `npm run web:build`: aprovado.

Ressalvas:

- `npx supabase status` imprime credenciais locais descartaveis da CLI; elas nao foram registradas na documentacao.
- `npm audit --audit-level=high` permanece herdado com 3 vulnerabilidades high transitivas conhecidas.
- Nenhuma migration da SPEC-003 foi aplicada no Supabase remoto.
## Ultimos Resultados Locais da SPEC-003 Entrega A

- `npm run pricing:test`: aprovado, 23 testes em 1 arquivo.
- `npm run pricing:typecheck`: aprovado.
- `npm run pricing:build`: aprovado.
- `npm run pricing:lint`: aprovado.
- Varredura `rg -n "\bnumber\b|Math\.|parseFloat|Number\(" packages\pricing-engine\src packages\pricing-engine\tests`: sem ocorrencias.
- Nenhuma UI, migration, Supabase, persistencia, Stripe, OAuth ou deploy foi executado.

## Ultimos Resultados Locais da Entrega F

- `npm run web:test:unit`: aprovado, 15 testes.
- `npm run web:test:integration`: aprovado, 11 testes.
- `npm run web:typecheck`: aprovado.
- `npm run web:build`: aprovado, 17 paginas geradas e proxy ativo.
- `npm exec -w apps/web -- playwright test tests/e2e/pwa.spec.ts`: aprovado, 30 testes em 6 viewports.
- `npm run web:test:e2e`: aprovado, 78 testes em 6 viewports apos a correcao PWA.
- `git diff --check`: aprovado, apenas avisos LF/CRLF do Windows.
- Varredura de segredos: sem valores reais; apenas placeholders, documentacao e testes negativos.
- Links Markdown locais: OK.
- Zero-byte versionavel: nenhum encontrado.
- Screenshots E2E: 18 arquivos gerados, dimensoes oficiais e amostragem de pixels nao branca.
- `npm audit --audit-level=high`: reprovado por 3 vulnerabilidades high transitivas conhecidas em Next/PostCSS/Sharp; fix force nao aplicado.

## Security Gate

Status: aprovado com ressalvas.

- Backend First preservado.
- Sessao, tenant e role continuam resolvidos no servidor.
- RLS da SPEC-001 permanece defesa obrigatoria; nenhuma migration foi criada ou aplicada na Entrega F.
- Service role e segredos nao aparecem no app/browser.
- Cache PWA nao persiste rotas autenticadas, Auth, APIs, Supabase, requests com `Authorization`, `apikey` ou `x-client-info`, profile, tenant ou dados de modulo.
- Sem Stripe, OAuth, Supabase remoto, migration, deploy ou merge.
- Entrega A da SPEC-003 preserva Backend First: o motor puro nao decide tenant, usuario, papel, sessao ou permissao; esses controles ficam para backend/RLS em entrega futura.
- Ressalva: `npm audit --audit-level=high` permanece reprovado por dependencias transitivas conhecidas.

## Frontend Gate

Status: aprovado com ressalvas.

- Responsividade coberta por Playwright em 360, 390, 768, 1024, 1366 e 1440 px.
- Splash, login, recuperacao, redefinicao, acesso negado, rotas protegidas sem sessao, manifest, PWA, offline e Cache Storage cobertos por testes.
- Foco visivel, labels, landmarks, `lang=pt-BR`, `aria-live`, `aria-current`, `aria-expanded`, `role=status/alert` e reduced motion revisados.
- Bundle estatico total medido em aproximadamente 1.01 MB; chunks estaticos somam aproximadamente 709 KB antes de compressao.
- Ressalvas: Lighthouse PWA nao executado sem ferramenta local aprovada; App Shell autenticado com sessao real nao validado sem harness/credenciais de teste; instalacao/update PWA real dependem de homologacao.

## Riscos Restantes

- Reavaliar vulnerabilidades transitivas Next/PostCSS/Sharp quando houver patch seguro da stack atual.
- Iniciar a Entrega C da SPEC-003 somente com autorizacao explicita, consumindo o backend local da Entrega B e sem alterar Supabase remoto.
- Criar harness seguro de usuario de teste para validar login real ate `/inicio` e shell autenticada com dados controlados.
- Executar Lighthouse PWA em pipeline ou ambiente aprovado.
- Validar instalacao PWA real e update real entre builds em homologacao.
- Regra de multiplos tenants permanece pendente de produto.

## Acoes Externas Nao Realizadas

- Nenhum deploy.
- Nenhum merge.
- Nenhuma migration da SPEC-003 aplicada no Supabase remoto.
- Nenhuma migration aplicada.
- Nenhuma alteracao no Supabase remoto.
- Nenhum Stripe.
- Nenhum OAuth.
- Nenhuma tag ou release.

## Leitura Obrigatoria Para o Proximo Goal

- `.specs/003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md`
- `docs/implementation-log/2026-08-01-spec-003-precificador-criacao.md`
- `docs/implementation-log/2026-08-01-spec-003-revisao-aprovacao.md`
- `PROJECT.md`
- `docs/PROJECT_STATE.md`
- `docs/GOAL_FRAMEWORK.md`
- `docs/IMPLEMENTATION_RULES.md`
- `SECURITY_POLICY.md`
- `CODEX_EXECUTION_PROTOCOL.md`
- `FRONTEND_DESIGN_SYSTEM.md`
- SPEC-002 v1.1 concluida com ressalvas
- SPEC-003 aprovada para implementacao
- `docs/implementation-log/2026-08-01-spec-003-entrega-a.md`
- `docs/implementation-log/2026-08-01-spec-003-entrega-b.md`
- `packages/pricing-engine/README.md`
- Logs das Entregas A, B, C, D, E e F
- `CHANGELOG.md`
- `docs/07-PADROES-DE-DESENVOLVIMENTO/PWA-CACHE-OFFLINE.md`

## Nao Reconstruir
- Tokens, assets oficiais, Supabase clients, proxy, guards, contratos de acesso, auth flows, App Shell, navegacao estrutural, estados oficiais de modulo, componentes-base existentes, estrategia PWA/cache segura e motor matematico puro da SPEC-003 Entrega A.
