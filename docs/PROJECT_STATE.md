# Project State - MARIED UNIVERSITY

Ultima atualizacao: 2026-07-31

## Estado Real

- Projeto: MARIED UNIVERSITY.
- Branch: `agent/initial-project-foundation`.
- Ultimo commit antes da Entrega E: `6ab49ba feat(app): implement spec 002 authenticated shell`.
- Commit da Entrega E: ver `git log -1` apos o commit final; o SHA final nao e embutido neste arquivo para evitar autorreferencia de hash.
- Working tree: validar `git status --short` ao retomar.
- SPEC atual: SPEC-002 v1.1 aprovada.
- Entregas concluidas: SPEC-001; SPEC-002 Entregas A, B, C, D e E.
- Entrega atual: SPEC-002 Entrega E, PWA, offline seguro e atualizacao.
- Proxima entrega recomendada: SPEC-002 Entrega F, testes, acessibilidade, performance e gates finais.

## Implementacoes Existentes

- Frontend Next.js 16 com App Router, React 19, TypeScript strict, Tailwind CSS 4 e Lucide.
- Tokens visuais oficiais em `apps/web/styles/tokens.css` e contratos em `apps/web/lib/design/tokens.ts`.
- Supabase browser/server clients com `@supabase/ssr`.
- Proxy de sessao e rotas protegidas.
- Fluxos de splash, login, recuperacao, redefinicao, callback e logout.
- App Shell autenticado com sidebar desktop, topbar, menu da usuaria e navegacao mobile.
- Dashboard estrutural, Minha Conta, Minha Assinatura e portas futuras dos modulos.
- Estados oficiais de modulo: `AVAILABLE`, `LOCKED`, `COMING_SOON`, `DISABLED`, `MAINTENANCE`.
- Manifest PWA, icones PNG/SVG, Apple touch icon, rota `/offline`, service worker versionado, fallback offline seguro e prompts controlados de instalacao/atualizacao.

## Componentes Principais

- `AppShellFrame`, `AuthenticatedShell`, `Sidebar`, `MobileNavigation`, `Topbar`, `UserMenu`, `PageHeader`.
- `ModuleCard`, `Panel`, `StatusBadge`, `Button`, `Alert`, `EmptyState`, `Spinner`.
- `LogoMark`, `LogoutButton`.
- `PWAController`, `PWAInstallPrompt`, `PWAUpdatePrompt`, `OfflinePage`.

## Contratos Existentes

- `apps/web/lib/access/session-context.ts`: resolucao server-side de usuario, profile, tenant, vinculo e role.
- `apps/web/lib/auth/redirects.ts`: allow-list de destinos autenticados.
- `apps/web/lib/modules/navigation.ts`: navegacao, estados oficiais e feature flags estruturais.
- `apps/web/lib/pwa/cache-policy.ts`: matriz conservadora de cache PWA.
- `apps/web/public/sw.js`: service worker estatico versionado com allow-list de assets seguros.

## Testes Disponiveis

- `npm run web:test:unit`
- `npm run web:test:integration`
- `npm run web:typecheck`
- `npm run web:build`
- `npm run web:test:e2e`

## Ultimos Resultados Locais

- Unitarios: aprovados, 15 testes.
- Integracao: aprovados, 11 testes.
- Typecheck: aprovado.
- Build: aprovado.
- E2E: aprovado, 78 testes em 6 viewports.
- E2E PWA isolado: aprovado, 30 testes em 6 viewports.
- `npm audit --audit-level=high`: risco conhecido herdado, nao corrigido nesta entrega.

## Security Gate

Status: aprovado com ressalvas.

- Rotas autenticadas validam acesso no servidor.
- Links indisponiveis nao sao tratados como autorizacao.
- Logout reutiliza acao existente.
- Service worker nao persiste rotas autenticadas, Auth, APIs, Supabase, requests com Authorization, profile, tenant ou dados de modulo.
- Cache Storage inspecionado por E2E: somente entradas seguras de `/offline` e assets publicos MARIED.
- Sem Stripe, OAuth, migration, deploy ou Supabase remoto.
- Varredura de segredos executada: sem valores reais encontrados; ocorrencias restantes sao nomes de variaveis em docs/testes/.env.example quando aplicavel.
- Ressalva: `npm audit --audit-level=high` reprova por vulnerabilidades transitivas conhecidas em Next/PostCSS/Sharp; `npm audit fix --force` nao aplicado.

## Frontend Gate

Status: aprovado com ressalvas.

- Responsividade coberta por Playwright em 360, 390, 768, 1024, 1366 e 1440 px.
- Pagina offline, prompt de instalacao simulado, fallback offline e Cache Storage cobertos em 6 viewports.
- Foco visivel e navegacao por teclado cobertos nos fluxos publicos e contratos da shell.
- Reduced motion preservado em CSS global.
- Ressalva: login real ate dashboard autenticado nao foi validado sem credenciais reais.
- Ressalva: Lighthouse PWA nao foi executado por nao haver dependencia/script local instalado.

## Riscos Conhecidos

- `npm audit --audit-level=high` reprova por vulnerabilidades transitivas conhecidas relacionadas a Next/PostCSS/Sharp.
- Nao executar `npm audit fix --force` porque pode sugerir downgrade incompativel.
- Fluxos reais de e-mail dependem de configuracao futura de Redirect URLs e SMTP no Supabase remoto.
- Login valido com usuario real nao foi exercitado para evitar credenciais e dados reais.
- App Shell autenticado renderizado com sessao real ainda depende de harness/usuario controlado.
- Instalacao PWA real em sistema operacional especifico nao substitui o teste automatizado de manifest/prompt simulado.

## Pendencias Bloqueadoras

- Nenhuma pendencia bloqueadora conhecida no fechamento local da Entrega E.

## Pendencias Nao Bloqueadoras

- Criar harness seguro de usuario de teste para validar login real ate `/inicio`.
- Reavaliar vulnerabilidades transitivas quando houver patch seguro da stack atual.
- Executar Lighthouse PWA quando houver ferramenta local aprovada ou pipeline adequado.
- Validar instalacao real em dispositivos alvo quando houver ambiente de homologacao.

## Acoes Externas Nao Realizadas

- Nenhum deploy.
- Nenhum merge.
- Nenhuma migration local/remota criada para a Entrega E.
- Nenhuma alteracao no Supabase remoto.
- Nenhum Stripe.
- Nenhum OAuth.
- Nenhuma tag ou release.

## Leitura Obrigatoria Para o Proximo Goal

- `PROJECT.md`
- `docs/PROJECT_STATE.md`
- `docs/GOAL_FRAMEWORK.md`
- `docs/IMPLEMENTATION_RULES.md`
- `SECURITY_POLICY.md`
- `CODEX_EXECUTION_PROTOCOL.md`
- `FRONTEND_DESIGN_SYSTEM.md`
- SPEC-002 v1.1 aprovada
- Logs das Entregas A, B, C, D e E
- `CHANGELOG.md`
- `docs/07-PADROES-DE-DESENVOLVIMENTO/PWA-CACHE-OFFLINE.md`

## Nao Reconstruir

- Tokens, assets oficiais, Supabase clients, proxy, guards, contratos de acesso, auth flows, App Shell, navegacao estrutural, estados oficiais de modulo, componentes-base existentes e estrategia PWA/cache segura da Entrega E.