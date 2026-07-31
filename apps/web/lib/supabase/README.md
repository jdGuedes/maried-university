# Supabase Clients

Implementado na Entrega B da SPEC-002.

- `client.ts`: cria cliente Supabase para browser somente com variaveis publicas permitidas.
- `server.ts`: cria cliente Supabase por requisicao usando cookies do Next.js.
- `proxy.ts`: atualiza/valida sessao no proxy e protege rotas autenticadas.
- `public-env.ts`: valida `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sem aceitar segredos.
- `database.types.ts`: contrato tipado minimo das tabelas de identidade da SPEC-001.

Nunca usar `service_role` ou chaves secretas neste diretorio.
