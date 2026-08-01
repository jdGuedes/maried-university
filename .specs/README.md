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
| SPEC-002 | Frontend Foundation, Authentication, PWA and User App Shell | CONCLUIDA COM RESSALVAS | Fundacao frontend, autenticacao, PWA, App Shell, navegacao, dashboard estrutural e gates finais da usuaria final | `002-FRONTEND-AUTH-PWA-USER-SHELL/SPEC-002-FRONTEND-AUTH-PWA-USER-SHELL-v1.1-APROVADA.md` |
| SPEC-003 | Precificador Inteligente | PROPOSTA PARA APROVACAO | Contrato documental do modulo de precificacao: regras, formulas, perfis, dados, seguranca, RLS, testes e plano futuro, sem implementacao funcional | `003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md` |

## Estado da SPEC-002

- Entrega A concluida, commitada e enviada.
- Entrega B concluida, commitada e enviada.
- Entrega C concluida, commitada e enviada com splash, login, recuperacao, redefinicao, callback seguro, logout e testes.
- Entrega D concluida, commitada e enviada com App Shell, dashboard estrutural, navegacao desktop/mobile, Minha Conta, Minha Assinatura e estados oficiais de modulos.
- Entrega E concluida com PWA, offline seguro, service worker, manifest, icones, instalacao simulada, atualizacao controlada e cache conservador.
- Entrega F concluida localmente com testes finais, acessibilidade, responsividade, performance, bundle, seguranca, Security Gate e Frontend Gate.

## Proxima etapa

A SPEC-003 do Precificador Inteligente foi criada como proposta documental. Nenhum modulo funcional deve ser iniciado antes da aprovacao explicita da SPEC-003 e da resolucao ou aceite das pendencias de produto registradas.
