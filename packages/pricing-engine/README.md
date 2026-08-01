# Pricing Engine

Motor matematico puro da SPEC-003 Entrega A.

Fonte documental aprovada:

- `.specs/003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md`

## Status

Implementado na Entrega A da SPEC-003 como nucleo puro, deterministico e testado.

Este pacote nao acessa React, Next.js, Supabase, banco de dados, cookies, sessao, tenant ativo, localStorage, rotas, Stripe, OAuth ou qualquer persistencia.

## Decisoes de precisao

- dinheiro: `bigint` em centavos;
- percentuais: `bigint` em basis points;
- sem `number`, `float`, `double`, `Math`, `parseFloat` ou `Number` no codigo do pacote;
- divisores invalidos sao bloqueados por erros tipados;
- arredondamentos sao explicitos e testados.

## API publica

- `calculatePricing`
- `calculateCosts`
- `calculateFreightUnit`
- `calculateLossAmount`
- `calculateBreakEvenPrice`
- `calculateNetProfit`
- `applyRoundingRule`
- `cents`
- `bps`
- `formatCents`
- `defaultCommercialProfiles`
- `commercialProfileKeys`
- contratos tipados exportados de `src/contracts.ts`

## Scripts

Na raiz do repositorio:

```bash
npm run pricing:test
npm run pricing:typecheck
npm run pricing:build
npm run pricing:lint
```

## Fora do escopo desta entrega

- interface;
- formularios;
- server actions;
- migrations;
- RLS;
- persistencia;
- historico salvo;
- aplicacao de migration local ou remota;
- Supabase remoto.