# Project State - MARIED UNIVERSITY

Ultima atualizacao: 2026-07-31

## Estado Real

- Projeto: MARIED UNIVERSITY.
- Branch: `agent/initial-project-foundation`.
- Ultimo commit antes da Entrega D: `df3b51d feat(auth): implement spec 002 authentication flows`.
- Commit da Entrega D: ver `git log -1`; o SHA final nao e embutido neste arquivo para evitar autorreferencia de hash.
- Working tree: validado localmente antes do commit; verificar `git status --short` ao retomar.
- SPEC atual: SPEC-002 v1.1 aprovada.
- Entregas concluidas: SPEC-001; SPEC-002 Entregas A, B e C.
- Entrega atual: SPEC-002 Entrega D, App Shell e Dashboard estrutural.
- Proxima entrega recomendada: proxima entrega aprovada da SPEC-002, sem reconstruir fundacoes.

## Implementacoes Existentes

- Frontend Next.js 16 com App Router, React 19, TypeScript strict, Tailwind CSS 4 e Lucide.
- Tokens visuais oficiais em `apps/web/styles/tokens.css` e contratos em `apps/web/lib/design/tokens.ts`.
- Supabase browser/server clients com `@supabase/ssr`.
- Proxy de sessao e rotas protegidas.
- Fluxos de splash, login, recuperacao, redefinicao, callback e logout.
- App Shell autenticado com sidebar desktop, topbar, menu da usuaria e navegacao mobile.
- Dashboard estrutural, Minha Conta, Minha Assinatura e portas futuras dos modulos.
- Estados oficiais de modulo: `AVAILABLE`, `LOCKED`, `COMING_SOON`, `DISABLED`, `MAINTENANCE`.

## Componentes Principais

- `AppShellFrame`, `AuthenticatedShell`, `Sidebar`, `MobileNavigation`, `Topbar`, `UserMenu`, `PageHeader`.
- `ModuleCard`, `Panel`, `StatusBadge`, `Button`, `Alert`, `EmptyState`, `Spinner`.
- `LogoMark`, `LogoutButton`.

## Contratos Existentes

- `apps/web/lib/access/session-context.ts`: resolucao server-side de usuario, profile, tenant, vinculo e role.
- `apps/web/lib/auth/redirects.ts`: allow-list de destinos autenticados.
- `apps/web/lib/modules/navigation.ts`: navegacao, estados oficiais e feature flags estruturais.

## Testes Disponiveis

- `npm run web:test:unit`
- `npm run web:test:integration`
- `npm run web:typecheck`
- `npm run web:build`
- `npm run web:test:e2e`

## Ultimos Resultados Locais

- Unitarios: aprovados, 8 testes.
- Integracao: aprovados, 5 testes.
- Typecheck: aprovado.
- Build: aprovado.
- E2E: aprovado, 48 testes em 6 viewports.
- `npm audit --audit-level=high`: risco conhecido herdado, nao corrigido nesta entrega.

## Security Gate

Status: aprovado com ressalvas.

- Rotas autenticadas validam acesso no servidor.
- Links indisponiveis nao sao tratados como autorizacao.
- Logout reutiliza acao existente.
- Sem Stripe, OAuth, migration, deploy ou Supabase remoto.
- Varredura de segredos executada: sem valores reais encontrados; ocorrencias restantes sao nomes de variaveis em docs/testes/.env.example.
- Ressalva: `npm audit --audit-level=high` reprovou por vulnerabilidades transitivas conhecidas em Next/PostCSS/Sharp; `npm audit fix --force` nao aplicado.

## Frontend Gate

Status: aprovado com ressalvas.

- Responsividade coberta por Playwright em 360, 390, 768, 1024, 1366 e 1440 px.
- Foco visivel e navegacao por teclado cobertos nos fluxos publicos e contratos da shell.
- Reduced motion preservado em CSS global.
- Ressalva: login real ate dashboard autenticado nao foi validado sem credenciais reais.
- Ressalva: `view_image` pode falhar por ACL; usar screenshots/dimensoes quando necessario e registrar.

## Riscos Conhecidos

- `npm audit --audit-level=high` reprova por vulnerabilidades transitivas conhecidas relacionadas a Next/PostCSS/Sharp.
- Nao executar `npm audit fix --force` porque pode sugerir downgrade incompativel.
- Fluxos reais de e-mail dependem de configuracao futura de Redirect URLs e SMTP no Supabase remoto.
- Login valido com usuario real nao foi exercitado para evitar credenciais e dados reais.
- App Shell autenticado renderizado com sessao real ainda depende de harness/usuario controlado.

## Pendencias Bloqueadoras

- Nenhuma pendencia bloqueadora conhecida no fechamento local da Entrega D.

## Pendencias Nao Bloqueadoras

- Criar harness seguro de usuario de teste para validar login real ate `/inicio`.
- Reavaliar vulnerabilidades transitivas quando houver patch seguro da stack atual.
- Validar referencias visuais por `view_image` quando o ACL permitir.

## Acoes Externas Nao Realizadas

- Nenhum deploy.
- Nenhum merge.
- Nenhuma migration local/remota criada para a Entrega D.
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
- Logs das Entregas A, B, C e D
- `CHANGELOG.md`

## Nao Reconstruir

- Tokens, assets oficiais, Supabase clients, proxy, guards, contratos de acesso, auth flows, App Shell, navegacao estrutural, estados oficiais de modulo e componentes-base existentes.