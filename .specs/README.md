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
| SPEC-002 | Frontend Foundation, Authentication, PWA and User App Shell | EM IMPLEMENTACAO | Fundacao frontend, autenticacao, PWA, App Shell, navegacao e dashboard estrutural da usuaria final | `002-FRONTEND-AUTH-PWA-USER-SHELL/SPEC-002-FRONTEND-AUTH-PWA-USER-SHELL-v1.1-APROVADA.md` |

## Estado da SPEC-002

- Entrega A concluida, commitada e enviada.
- Entrega B concluida, commitada e enviada.
- Entrega C concluida, commitada e enviada com splash, login, recuperacao, redefinicao, callback seguro, logout e testes.
- Entrega D concluida, commitada e enviada com App Shell, dashboard estrutural, navegacao desktop/mobile, Minha Conta, Minha Assinatura e estados oficiais de modulos.
- Entrega E implementada localmente com PWA, offline seguro, service worker, manifest, icones, instalacao, atualizacao e cache conservador.

## Proxima implementacao

A proxima tarefa deve ser a Entrega F da SPEC-002, sem reconstruir as Entregas A, B, C, D ou E e sem iniciar modulos de negocio fora de ordem.