# PWA Runtime

Implementado na SPEC-002 Entrega E.

## Arquivos

- `cache-policy.ts`: matriz testavel de cache, rotas sensiveis e nomes versionados de cache.
- `state.ts`: estados simples de conexao, instalacao e atualizacao.
- `public/sw.js`: service worker estatico usado em runtime.

## Regra principal

Nenhum dado sensivel, autenticado, operacional ou pessoal deve ser persistido offline. Rotas autenticadas, Auth, APIs, Supabase e requests com credenciais ficam Network Only.