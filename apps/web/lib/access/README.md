# Access Contracts

Implementado inicialmente na Entrega B da SPEC-002.

`session-context.ts` resolve no servidor:

- sessao Supabase verificada;
- profile do usuario;
- vinculo ativo em `tenant_members`;
- tenant ativo em `tenants`;
- papel do membro.

Feature flag nao substitui autorizacao. Quando houver multiplos tenants ativos, a resolucao falha de modo seguro ate existir regra de produto aprovada.
