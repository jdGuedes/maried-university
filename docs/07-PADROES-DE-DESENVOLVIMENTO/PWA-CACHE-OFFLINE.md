# PWA, Cache e Offline Seguro

Documento operacional da SPEC-002 Entrega E, revisado na Entrega F.

## Objetivo

A PWA da MARIED UNIVERSITY permite instalacao, fallback offline e atualizacao controlada sem persistir dados sensiveis, autenticados, operacionais ou pessoais.

## Arquivos Principais

- `apps/web/app/manifest.ts`: manifest oficial servido em `/manifest.webmanifest`.
- `apps/web/public/sw.js`: service worker estatico versionado.
- `apps/web/lib/pwa/cache-policy.ts`: matriz testavel de cache.
- `apps/web/components/pwa/PWAController.tsx`: registro do service worker, conexao, instalacao e atualizacao.
- `apps/web/app/offline/page.tsx`: fallback publico sem dados sensiveis.
- `apps/web/public/icons/`: icones finais da PWA.

## Matriz de Cache

| Categoria | Estrategia | Persistencia | Justificativa |
|---|---|---|---|
| Assets estaticos versionados | Cache First | Sim | CSS/JS estatico, icones e assets publicos nao carregam dados de usuaria. |
| Icones e manifest | Cache First | Sim | Necessarios para instalacao e resiliencia visual. |
| Rotas publicas | Network First | Nao persistir HTML | Evita servir HTML antigo ou enganoso; falha usa `/offline`. |
| Rotas autenticadas | Network Only | Nao | Podem conter profile, tenant, role, assinatura ou dados de modulo. |
| Auth/callback/API/Supabase | Network Only | Nao | Podem conter tokens, cookies, sessoes ou respostas autenticadas. |
| Offline fallback | Cache seguro | Sim | Pagina publica, neutra e sem dados sensiveis. |

## Regras de Seguranca

- Nao cachear `/inicio`, `/minha-conta`, `/minha-assinatura`, `/precificacao`, `/estoque`, `/fornecedores` ou `/minicursos`.
- Nao cachear `/auth/*`, `/api/*`, callback, Supabase REST/Auth/RPC ou requests com `Authorization`, `apikey` ou `x-client-info`. O contrato tipado e o service worker tratam esses headers como sensiveis.
- Nao usar IndexedDB, background sync, push notifications, fila offline ou sincronizacao offline nesta entrega.
- Atualizacao da PWA so recarrega a pagina apos acao explicita da usuaria no prompt.
- Caches antigos com prefixo `maried-university` sao removidos no `activate`.

## Instalacao e Atualizacao

- O manifest declara `display: standalone`, `start_url: /`, `scope: /`, `lang: pt-BR` e icones 192/512/maskable.
- O prompt de instalacao aparece somente apos `beforeinstallprompt` e pode ser dispensado por 14 dias.
- O prompt de atualizacao aparece quando ha service worker novo em espera.
- `skipWaiting` e reload controlado acontecem apenas apos clique em atualizar.

## Validacoes

- Unitarios: matriz de cache, estados de conexao, instalacao e atualizacao.
- Integracao: manifest, icones existentes, service worker versionado, allow-list e Network Only de rotas sensiveis.
- E2E: manifest, prompt de instalacao simulado, fallback offline, Cache Storage sem dados sensiveis e pagina offline em 6 viewports.

## Limites Conhecidos

- Lighthouse PWA nao foi executado na Entrega F por nao haver dependencia/script local instalado e por nao ser seguro adicionar dependencia pesada apenas para pontuacao. Validar em pipeline ou homologacao futura.
- Instalacao real em sistemas operacionais especificos deve ser validada em homologacao futura.
- Nao ha cache offline de dados de negocio por decisao de seguranca.
