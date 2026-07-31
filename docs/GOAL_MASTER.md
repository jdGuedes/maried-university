# GOAL MASTER | MARIED UNIVERSITY

**Status:** APROVADO
**Projeto:** MARIED UNIVERSITY
**Aplicacao:** fonte de orientacao mestre para produto, agentes e desenvolvimento
**Ultima atualizacao:** 2026-07-30

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

- SPEC-001 concluida.
- SPEC-002 v1.1 aprovada para implementacao.
- Implementacao frontend ainda nao deve ser considerada iniciada por esta governanca documental.
- Proxima etapa oficial: Entrega A da SPEC-002, em tarefa separada.

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
- SPEC atualizada quando aplicavel;
- ADR criado ou atualizado quando houver decisao arquitetural;
- `ARCHITECTURE_DECISIONS.md` atualizado quando necessario;
- Security Gate;
- Frontend Gate quando houver frontend;
- riscos e pendencias registrados.

Codigo sem documentacao e implementation log deve ser tratado como implementacao incompleta.

## 7. Fontes Relacionadas

- `PROJECT.md`
- `ARCHITECTURE_DECISIONS.md`
- `SECURITY_POLICY.md`
- `CODEX_EXECUTION_PROTOCOL.md`
- `FRONTEND_DESIGN_SYSTEM.md`
- `MVP_INITIAL_SCOPE_UPDATED.md`
- `.specs/`
- `docs/implementation-log/README.md`
- `CHANGELOG.md`
