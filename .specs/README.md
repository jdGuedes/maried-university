# Especificacoes

Nenhuma funcionalidade relevante deve ser implementada sem uma SPEC aprovada.

Cada SPEC deve conter:

- objetivo;
- problema;
- escopo;
- fora do escopo;
- fluxos;
- regras;
- banco;
- permissoes;
- integracoes;
- testes;
- criterios de aceite;
- riscos;
- Definition of Done.

## Specs existentes

| Codigo | Titulo | Status | Responsabilidade | Arquivo |
|---|---|---|---|---|
| SPEC-001 | Fundacao de Identidade e Multitenancy | CONCLUIDA | Fundacao tecnica de identidade, tenants, ownership, papeis, RLS e isolamento local validado | `001-CORE-IDENTITY/SPEC-001-CORE-IDENTITY.md` |
| SPEC-002 | Frontend Foundation, Authentication, PWA and User App Shell | APROVADA PARA IMPLEMENTACAO | Fundacao frontend, autenticacao, PWA, App Shell, navegacao e dashboard estrutural da usuaria final | `002-FRONTEND-AUTH-PWA-USER-SHELL/SPEC-002-FRONTEND-AUTH-PWA-USER-SHELL-v1.1-APROVADA.md` |

## Proxima implementacao

A Entrega A da SPEC-002 foi concluida localmente. A proxima tarefa e preparar a Entrega B da SPEC-002:

- Supabase browser/server;
- sessao server-side;
- protecao de rotas;
- resolucao segura de usuario, tenant e vinculo ativo;
- ausencia de segredos no browser.
