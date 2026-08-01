# ARCHITECTURE DECISIONS
## Ãndice Vivo de DecisÃµes Arquiteturais da MARIED UNIVERSITY

**Projeto:** MARIED UNIVERSITY
**Status:** ATIVO
**VersÃ£o:** 1.0
**Ultima atualizacao:** 31/07/2026
**ResponsÃ¡vel:** Product Owner da MARIED UNIVERSITY
**AplicaÃ§Ã£o:** obrigatÃ³ria como Ã­ndice de consulta para Codex, ChatGPT, agentes e desenvolvedores

---

# 1. FINALIDADE

Este documento funciona como Ã­ndice vivo das principais decisÃµes arquiteturais, de produto, seguranÃ§a, frontend e engenharia da MARIED UNIVERSITY.

Ele nÃ£o substitui:

- `PROJECT.md`;
- `SECURITY_POLICY.md`;
- `FRONTEND_DESIGN_SYSTEM.md`;
- `CODEX_EXECUTION_PROTOCOL.md`;
- `MVP_INITIAL_SCOPE_UPDATED.md`;
- SPECS;
- ADRs;
- migrations;
- testes;
- documentaÃ§Ã£o tÃ©cnica especÃ­fica.

Sua funÃ§Ã£o Ã© permitir que qualquer pessoa ou agente identifique rapidamente:

1. qual decisÃ£o foi tomada;
2. por que ela existe;
3. qual problema resolve;
4. qual regra preserva;
5. onde encontrar a documentaÃ§Ã£o completa;
6. em que estado a decisÃ£o se encontra.

---

# 2. REGRA DE USO

Antes de alterar arquitetura, seguranÃ§a, banco, frontend, mÃ³dulos, planos, motores ou integraÃ§Ãµes, consultar este Ã­ndice.

Quando uma nova decisÃ£o relevante for aprovada:

1. criar ou atualizar o ADR correspondente, quando necessÃ¡rio;
2. atualizar a SPEC relacionada;
3. atualizar este Ã­ndice;
4. registrar o impacto;
5. informar o status;
6. nÃ£o marcar como implementado algo apenas aprovado.

---

# 3. STATUS PADRÃƒO

| Status | Significado |
|---|---|
| APROVADO | DecisÃ£o aceita e obrigatÃ³ria |
| IMPLEMENTADO | DecisÃ£o jÃ¡ aplicada no cÃ³digo ou banco |
| EM IMPLEMENTAÃ‡ÃƒO | ExecuÃ§Ã£o em andamento |
| PENDENTE | DecisÃ£o conhecida, ainda nÃ£o concluÃ­da |
| FUTURO | Planejada para fase posterior |
| SUBSTITUÃDO | DecisÃ£o antiga superada por outra mais recente |
| FORA DO ESCOPO | NÃ£o pertence ao MVP ou fase atual |

---

# 4. ÃNDICE DAS DECISÃ•ES

| CÃ³digo | DecisÃ£o | Status | Fonte principal |
|---|---|---|---|
| DEC-001 | Banco central multitenant | IMPLEMENTADO PARCIALMENTE | ADR-001, PROJECT.md |
| DEC-002 | MÃ³dulos vendidos separadamente | APROVADO | ADR-002 |
| DEC-003 | NÃºcleo compartilhado | APROVADO | ADR-003 |
| DEC-004 | Motores internos compartilhados | APROVADO | ADR-004 |
| DEC-005 | Marketplace fora do escopo | APROVADO | ADR-005 |
| DEC-006 | MonÃ³lito modular | APROVADO | ADR-006 |
| DEC-007 | PrecificaÃ§Ã£o como primeiro mÃ³dulo funcional | APROVADO | ADR-007, MVP |
| DEC-008 | ProduÃ§Ã£o e Banho separado | FUTURO | ADR-008 |
| DEC-009 | HistÃ³rico congelado | APROVADO | ADR-009 |
| DEC-010 | Supabase + Stripe + Vercel + GitHub | IMPLEMENTADO PARCIALMENTE | ADR-010, SPEC-002 Entrega B |
| DEC-011 | Backend First | IMPLEMENTADO COMO REGRA | ADR-011, SECURITY_POLICY.md |
| DEC-012 | RLS obrigatÃ³ria | IMPLEMENTADO PARCIALMENTE | SECURITY_POLICY.md |
| DEC-013 | ProteÃ§Ã£o do Ãºltimo owner | IMPLEMENTADO NA FUNDAÃ‡ÃƒO | SPEC-001 |
| DEC-014 | TypeScript strict | IMPLEMENTADO NA ENTREGA A | PROJECT.md, apps/web/tsconfig.json |
| DEC-015 | Next.js App Router | IMPLEMENTADO NA ENTREGA A | SPEC-002, apps/web/app/ |
| DEC-016 | Design tokens semanticos | IMPLEMENTADO PARCIALMENTE NA ENTREGA A | SPEC-002 v1.1, apps/web/styles/tokens.css |
| DEC-017 | Claymorphism funcional | APROVADO | FRONTEND_DESIGN_SYSTEM.md |
| DEC-018 | PWA conservadora | IMPLEMENTADO NA ENTREGA E | SPEC-002 v1.1, docs/07-PADROES-DE-DESENVOLVIMENTO/PWA-CACHE-OFFLINE.md |
| DEC-019 | Feature Flags centralizadas | IMPLEMENTADO COMO CONTRATO ESTRUTURAL | SPEC-002 v1.1, apps/web/lib/modules/navigation.ts |
| DEC-020 | Performance Budget | VALIDADO COM RESSALVAS NA ENTREGA F | SPEC-002 v1.1, log Entrega F |
| DEC-021 | NavegaÃ§Ã£o Ãºnica por experiÃªncia | APROVADO | SPEC-002 |
| DEC-022 | Sem modal sobre modal | APROVADO | SPEC-002 v1.1 |
| DEC-023 | Estados oficiais de mÃ³dulos | APROVADO | SPEC-002 v1.1 |
| DEC-024 | Estados oficiais de formulÃ¡rios | APROVADO | SPEC-002 v1.1 |
| DEC-025 | Definition of Ready obrigatÃ³ria | APROVADO | SPEC-002 v1.1 |
| DEC-026 | Definition of Done obrigatÃ³ria | APROVADO | PROJECT.md, SPEC-002 |
| DEC-027 | ReferÃªncias visuais versionadas | IMPLEMENTADO | references/v1/ |
| DEC-028 | ZIP original preservado | IMPLEMENTADO | references/archive/ |
| DEC-029 | Mobile e desktop desde a origem | APROVADO | FRONTEND_DESIGN_SYSTEM.md |
| DEC-030 | Componentes compartilhados | IMPLEMENTADO PARCIALMENTE NA ENTREGA A | SPEC-002, apps/web/components/ |
| DEC-031 | Dinheiro em decimal, nunca float | APROVADO | PROJECT.md, SECURITY_POLICY.md |
| DEC-032 | Soft delete para histÃ³ricos | APROVADO | PROJECT.md |
| DEC-033 | Auditoria de aÃ§Ãµes crÃ­ticas | APROVADO | SECURITY_POLICY.md |
| DEC-034 | Stripe somente em fase prÃ³pria | FUTURO | PROJECT.md, SECURITY_POLICY.md |
| DEC-035 | Central Administrativa separada da experiÃªncia da usuÃ¡ria | APROVADO | MVP_INITIAL_SCOPE_UPDATED.md |
| DEC-036 | Quatro blocos do MVP | APROVADO | MVP_INITIAL_SCOPE_UPDATED.md |
| DEC-037 | Sem impressÃ£o/PDF no MVP de PrecificaÃ§Ã£o | APROVADO | MVP_INITIAL_SCOPE_UPDATED.md |
| DEC-038 | PrecificaÃ§Ã£o por lucro fixo, acrÃ©scimo ou margem lÃ­quida | APROVADO | MVP_INITIAL_SCOPE_UPDATED.md |
| DEC-039 | Perfis comerciais por canal | APROVADO | MVP_INITIAL_SCOPE_UPDATED.md |
| DEC-040 | CÃ¡lculos histÃ³ricos preservados por snapshot | APROVADO | PROJECT.md |
| DEC-041 | Documentacao continua de implementacao | APROVADO | docs/implementation-log/ |

---

# 5. DECISÃ•ES PENDENTES

| CÃ³digo | DecisÃ£o pendente | Impacto |
|---|---|---|
| PEND-001 | Regra para usuÃ¡rios com mÃºltiplos tenants | AutenticaÃ§Ã£o e App Shell |
| PEND-002 | Cadastro pÃºblico ou onboarding inicial | Entrada no sistema |
| PEND-003 | Valores finais das cores do Brand Kit | Tokens |
| PEND-004 | EstratÃ©gia final de rate limiting | Login |
| PEND-005 | Infraestrutura persistente de auditoria | SeguranÃ§a |
| PEND-007 | PolÃ­tica final de assinatura durante login | Acesso |
| PEND-008 | NormalizaÃ§Ã£o LF/CRLF | RepositÃ³rio |
| PEND-009 | PreÃ§os oficiais dos planos | Comercial |
| PEND-010 | ConfiguraÃ§Ã£o Stripe | Pagamentos |

---

# 6. DECISÃ•ES FORA DO ESCOPO DO MVP

- emissÃ£o fiscal;
- notas fiscais;
- contabilidade completa;
- produÃ§Ã£o e banho completo;
- lotes e remessas;
- etiquetas;
- catÃ¡logo digital completo;
- IA operacional;
- automaÃ§Ãµes avanÃ§adas;
- exportaÃ§Ãµes avanÃ§adas;
- integraÃ§Ãµes comerciais nÃ£o aprovadas;
- marketplace de terceiros;
- microserviÃ§os distribuÃ­dos.

---

# 7. ORDEM OFICIAL DE IMPLEMENTAÃ‡ÃƒO

```text
SPEC-001 â€” FundaÃ§Ã£o tÃ©cnica
CONCLUÃDA

SPEC-002 â€” FundaÃ§Ã£o frontend
APROVADA PARA IMPLEMENTAÃ‡ÃƒO

Entrega A
Brand Kit, assets, tokens e estrutura global

Entrega B
Supabase browser/server, sessÃ£o e acesso

Entrega C
Splash, login, recuperaÃ§Ã£o, redefiniÃ§Ã£o e logout

Entrega D
App Shell, navegaÃ§Ã£o e dashboard estrutural

Entrega E
PWA, offline e atualizaÃ§Ã£o

Entrega F
Testes, acessibilidade, performance e gates

Depois:
PrecificaÃ§Ã£o Inteligente
Estoque
Fornecedores
Minicursos
Central Administrativa
Assinaturas
```

---

# 8. REGRA DE ATUALIZAÃ‡ÃƒO

Atualizar este documento quando:

- novo ADR for aprovado;
- uma SPEC alterar arquitetura;
- uma decisÃ£o mudar de status;
- uma regra for substituÃ­da;
- um mÃ³dulo entrar em implementaÃ§Ã£o;
- uma pendÃªncia for resolvida;
- uma integraÃ§Ã£o for autorizada;
- uma decisÃ£o de seguranÃ§a mudar.

NÃ£o duplicar a documentaÃ§Ã£o completa aqui.

Este arquivo deve continuar sendo um mapa, nÃ£o um labirinto.

---

# 9. REGRA FINAL

Toda decisÃ£o importante da MARIED UNIVERSITY deve ser:

- identificÃ¡vel;
- rastreÃ¡vel;
- documentada;
- versionada;
- validada;
- ligada Ã  fonte oficial;
- classificada por status.

Uma decisÃ£o nÃ£o registrada Ã© apenas uma conversa.

Uma decisÃ£o registrada se torna parte da arquitetura.
