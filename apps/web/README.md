# MARIED UNIVERSITY Web

Aplicacao web/PWA da MARIED UNIVERSITY.

Estado atual: Entregas A, B, C, D, E e F da SPEC-002 concluidas localmente; SPEC-003 Entrega D implementada e validada localmente. O app possui fundacao frontend, componentes-base, clientes Supabase browser/server, proxy de sessao, protecao de rotas, resolucao server-side inicial de acesso, fluxos de autenticacao, App Shell autenticado, PWA segura e precificador funcional com comparacao multi-perfil.

Implementado ate a Entrega F:

- layout autenticado unico em `app/(app)/layout.tsx`;
- App Shell com sidebar desktop, topbar, menu da usuaria e navegacao mobile;
- dashboard estrutural em `/inicio`;
- rotas estruturais `/minha-conta` e `/minha-assinatura`;
- formulario funcional do Precificador em `/precificacao`, consumindo Server Action, calculo oficial server-side, comparacao multi-perfil e arredondamento por simulacao;
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

Fora do escopo da Entrega D do Precificador:

- historico visual completo do Precificador;
- edicao, duplicacao pela interface, inativacao visual e listagem completa de precificacoes;
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

## Precificador Entrega D

A rota `/precificacao` esta protegida pelo App Shell e oferece formulario funcional de calculo com comparacao simultanea por perfis comerciais ativos. A interface valida formato de entrada, converte BRL para centavos e percentuais para basis points, envia a regra de arredondamento escolhida para a Server Action `calculatePricingPreviewAction` e exibe apenas resultados calculados no backend: preco tecnico, preco sugerido, preco aprovado da simulacao, lucro liquido, margem liquida, equilibrio e alertas por perfil.

O preview da Entrega D ignora filtros de perfil enviados pelo cliente e carrega todos os perfis ativos do tenant no servidor. A tela autenticada `/precificacao` foi validada localmente com Chrome temporario isolado, login manual do usuario, 6 cards de perfil, arredondamento `Final .99`, alerta de margem baixa e screenshots nos 6 viewports configurados.
