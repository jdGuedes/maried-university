# GOAL MASTER | MARIED UNIVERSITY

**Status:** APROVADO
**Projeto:** MARIED UNIVERSITY
**Aplicacao:** fonte de orientacao mestre para produto, agentes e desenvolvimento
**Ultima atualizacao:** 2026-07-31

---

## 1. Objetivo Mestre

Construir a MARIED UNIVERSITY como um ecossistema SaaS modular, simples, seguro e sustentavel para pessoas que iniciam ou organizam negocios de semijoias, folheados e acessorios.

O produto deve entregar micro solucoes praticas, com uma conta, um banco central multitenant, um nucleo compartilhado, motores reutilizaveis e modulos comercializaveis separadamente.

## 2. Regra Central

```text
Tudo junto tecnicamente e separado comercialmente.
```

Isso significa:

- uma aplicacao;
- um login;
- um banco central;
- isolamento obrigatorio por tenant;
- nucleo compartilhado;
- motores internos reutilizaveis;
- modulos vendidos individualmente ou por pacotes;
- documentacao versionada como fonte de verdade.

## 3. Estado Atual

O estado oficial do projeto deve ser consultado em:

`docs/PROJECT_STATE.md`

Este documento e atualizado ao final de cada entrega e representa a fonte oficial de verdade sobre:

- SPEC atual;
- entregas concluidas;
- branch;
- ultimo commit;
- riscos;
- pendencias;
- proxima etapa;
- governanca;
- estado geral do projeto.

O `GOAL_MASTER.md` contem apenas regras permanentes de execucao.

O estado operacional do projeto nunca deve ser duplicado neste documento.

## 4. Ordem Oficial de Continuidade

```text
Fundacao Frontend
-> Autenticacao
-> Splash
-> Login
-> PWA
-> App Shell
-> Dashboard estrutural
-> Precificacao Inteligente
-> Controle de Estoque
-> Fornecedores
-> Microcursos
```

## 5. Regras Permanentes

- Nao ampliar escopo sem SPEC ou ADR aprovado.
- Nao implementar modulos funcionais antes da fundacao frontend aprovada.
- Nao aplicar migration remota sem autorizacao explicita.
- Nao configurar Stripe, OAuth, Vercel, dominio ou deploy sem tarefa propria.
- Nao confiar no frontend para autorizacao, tenant, papel, assinatura, preco ou permissao.
- Manter RLS e Backend First como regras obrigatorias.
- Preservar historico e snapshots quando aplicavel.

## 6. Documentacao Continua de Implementacao

Toda alteracao realizada em qualquer etapa de desenvolvimento deve ser documentada com precisao antes de ser considerada concluida.

Uma etapa so pode ser encerrada quando houver, quando aplicavel:

- implementacao correta;
- testes;
- revisao;
- documentacao atualizada;
- registro em `docs/implementation-log/`;
- `CHANGELOG.md` atualizado;
- `docs/PROJECT_STATE.md` atualizado;
- SPEC atualizada quando aplicavel;
- ADR criado ou atualizado quando houver decisao arquitetural;
- `ARCHITECTURE_DECISIONS.md` atualizado quando necessario;
- Security Gate;
- Frontend Gate quando houver frontend;
- riscos e pendencias registrados.

Codigo sem documentacao e sem implementation log deve ser tratado como implementacao incompleta.

## 7. Fontes Relacionadas

- `PROJECT.md`
- `README.md`
- `ARCHITECTURE_DECISIONS.md`
- `SECURITY_POLICY.md`
- `CODEX_EXECUTION_PROTOCOL.md`
- `FRONTEND_DESIGN_SYSTEM.md`
- `MVP_INITIAL_SCOPE_UPDATED.md`
- `.specs/`
- `docs/PROJECT_STATE.md`
- `docs/GOAL_FRAMEWORK.md`
- `docs/IMPLEMENTATION_RULES.md`
- `docs/implementation-log/README.md`
- `CHANGELOG.md`