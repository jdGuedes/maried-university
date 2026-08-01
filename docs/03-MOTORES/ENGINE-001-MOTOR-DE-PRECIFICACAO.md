# ENGINE-001 | Motor de Custos e Precificacao

**Status:** IMPLEMENTADO PARCIALMENTE - SPEC-003 Entrega A

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
- Status: Entrega A implementada; proximas entregas devem adicionar backend, banco/RLS e interface somente com autorizacao explicita.