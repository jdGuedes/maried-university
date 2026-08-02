# ENGINE-001 | Motor de Custos e Precificacao

**Status:** IMPLEMENTADO PARCIALMENTE - SPEC-003 Entregas A, B e C

## Objetivo

Centralizar o calculo de custo tecnico, custo real, preco tecnico, preco sugerido e preco aprovado.

## Entrega A implementada

A Entrega A da SPEC-003 criou o nucleo matematico puro em `packages/pricing-engine`.

Escopo implementado:

- custo base;
- frete sem frete, unitario e total rateado por quantidade;
- perda fixa;
- perda percentual sobre custos diretos da unidade;
- custo total protegido;
- preco de equilibrio;
- lucro fixo desejado;
- acrescimo sobre custo;
- margem liquida desejada;
- preco tecnico;
- preco sugerido por arredondamento;
- preco aprovado manual;
- lucro bruto;
- lucro liquido;
- margem liquida real;
- alertas matematicos;
- erros matematicos tipados;
- snapshot matematico sem tenant, usuario ou sessao.


## Entrega B implementada localmente

A Entrega B adicionou a camada server-side e a persistencia local do Precificador, mantendo o motor puro como fonte oficial das formulas.

Escopo implementado:

- DTO server-side em `apps/web/lib/pricing/dto.ts` para normalizar centavos e basis points como `bigint`;
- servico `apps/web/lib/pricing/service.ts` que resolve contexto no servidor, exige papel `owner` ou `admin`, carrega perfis comerciais ativos do tenant e chama `calculatePricing`;
- persistencia atomica via RPC transacional no PostgreSQL local;
- snapshots de entrada, resultado, perfis comerciais e versoes historicas;
- migration local `supabase/migrations/20260801214320_spec_003_pricing_persistence.sql` com RLS por tenant;
- testes SQL de isolamento e testes de integracao server-side.

A camada server-side nao duplica formulas: toda formacao oficial de preco continua em `packages/pricing-engine`.

## Entrega C implementada localmente

A Entrega C adicionou a primeira experiencia visual funcional em `/precificacao`, mantendo o calculo oficial fora do componente React.

Escopo implementado:

- formulario inicial para identificacao, custos, frete, perdas e modo de precificacao;
- validacao de experiencia e conversao segura de BRL para centavos;
- Server Action de preview oficial que revalida dados e chama a camada server-side;
- exibicao de custo base, custo total, equilibrio, preco tecnico, preco sugerido, lucro liquido, margem e alertas;
- sem historico visual, edicao, duplicacao pela interface ou comparacao completa entre perfis.

Ressalva: a jornada autenticada real com perfil comercial ativo ainda depende de harness seguro/dados locais controlados para validacao E2E completa.

## Precisao

O motor usa somente:

- `bigint` em centavos para dinheiro;
- `bigint` em basis points para percentuais.

O pacote nao usa `number`, `float`, `double`, `Math`, `parseFloat` ou `Number`.

## Regra critica

Nenhum modulo pode duplicar as formulas deste motor.

## Testes

Comandos locais validados na Entrega A:

```bash
npm run pricing:test
npm run pricing:typecheck
npm run pricing:build
npm run pricing:lint
```

Resultado inicial da Entrega A: 23 testes matematicos aprovados em 1 arquivo.

## Fora do escopo da Entrega A

- backend oficial;
- banco;
- migrations;
- RLS;
- historico salvo;
- UI;
- React;
- Next.js routes;
- Supabase local ou remoto;
- Stripe;
- OAuth;
- deploy.

## SPEC relacionada

- SPEC-003 Precificador Inteligente: `.specs/003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md`.
- Status: Entregas A, B e C implementadas localmente; proximas entregas devem adicionar perfis/comparacao, historico e validacoes finais somente com autorizacao explicita. Nenhuma migration da SPEC-003 foi aplicada no Supabase remoto.
