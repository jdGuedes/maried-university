# MARIED UNIVERSITY Web

Aplicacao web/PWA da MARIED UNIVERSITY.

Estado atual: Entregas A, B, C, D, E e F da SPEC-002 concluidas localmente; SPEC-003 Entrega C implementada localmente. O app possui fundacao frontend, componentes-base, clientes Supabase browser/server, proxy de sessao, protecao de rotas, resolucao server-side inicial de acesso, fluxos de autenticacao, App Shell autenticado, PWA segura e formulario inicial funcional do Precificador com ressalvas documentadas.

Implementado ate a Entrega F:

- layout autenticado unico em `app/(app)/layout.tsx`;
- App Shell com sidebar desktop, topbar, menu da usuaria e navegacao mobile;
- dashboard estrutural em `/inicio`;
- rotas estruturais `/minha-conta` e `/minha-assinatura`;
- formulario funcional inicial do Precificador em `/precificacao`, consumindo Server Action e calculo oficial server-side;
- portas estruturais futuras para `/estoque`, `/fornecedores` e `/minicursos`;
- estados oficiais `AVAILABLE`, `LOCKED`, `COMING_SOON`, `DISABLED` e `MAINTENANCE`;
- loading e erro controlados no grupo autenticado;
- pagina publica de acesso bloqueado com mensagem neutra;
- testes unitarios, integracao e E2E ampliados;
- manifest oficial em /manifest.webmanifest;
- icones PWA em public/icons;
- service worker versionado em public/sw.js;
- fallback publico /offline;
- prompts controlados de instalacao e atualizacao;
- matriz conservadora de cache em lib/pwa/cache-policy.ts;
- validacao final da fundacao frontend com unit, integration, typecheck, build, E2E em 6 viewports, audit, segredos, bundle e screenshots nao vazios.

Fora do escopo da Entrega C do Precificador:

- historico visual completo do Precificador;
- edicao, duplicacao pela interface, inativacao visual e listagem completa de precificacoes;
- comparacao completa entre perfis comerciais;
- estoque funcional;
- fornecedores funcionais;
- minicursos funcionais;
- Stripe, checkout, billing ou upgrade real;
- OAuth;
- migrations;
- Supabase remoto;
- deploy;
- sincronizacao offline de dados;
- push notifications;
- background sync.

## Estrutura autenticada

As rotas sob `app/(app)` continuam protegidas por resolucao server-side de sessao, profile, tenant e vinculo ativo. Estados visuais e links desabilitados nao substituem autorizacao, RLS ou validacao no servidor.

## Validacoes locais

A partir da raiz do repositorio:

```bash
npm run web:typecheck
npm run web:test:unit
npm run web:test:integration
npm run web:build
npm run web:test:e2e
# nao ha script web:lint no workspace atual
```

O teste E2E usa Playwright local para validar splash, login, recuperacao, redefinicao, acesso direto protegido, estados publicos seguros, PWA, manifest, fallback offline, Cache Storage, teclado, ausencia de segredos e responsividade em 360, 390, 768, 1024, 1366 e 1440 px. Artefatos de teste ficam em `test-results/` e `playwright-report/`, ignorados pelo Git.

## Precificador Entrega C

A rota `/precificacao` esta protegida pelo App Shell e oferece o primeiro formulario funcional de calculo. A interface valida formato de entrada, converte BRL para centavos e percentuais para basis points, chama a Server Action `calculatePricingPreviewAction` e exibe o resultado retornado pelo backend. Sem harness autenticado seguro, o E2E autenticado da tela permanece `NAO VALIDADO`; a protecao sem sessao foi validada nos 6 viewports configurados.
