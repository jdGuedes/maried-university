# ENGINE-001 | Motor de Custos e Precificação

**Status:** EM ELABORAÇÃO

## Objetivo

Centralizar o cálculo de custo técnico, custo real, preço técnico, preço sugerido e preço aprovado.

## Escopo inicial

- peça bruta;
- ouro;
- prata;
- verniz;
- custos adicionais;
- perdas;
- rateios;
- margem;
- comissão;
- imposto;
- taxas;
- arredondamento;
- histórico.

## Regra crítica

Nenhum módulo pode duplicar as fórmulas deste motor.

## Teste obrigatório

5 milésimos de ouro + 3 de mão de obra, cotação de R$ 600,00 e peso de 1,20 g deve resultar em R$ 5,76 de custo de ouro.

## SPEC relacionada

- SPEC-003 Precificador Inteligente: `.specs/003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md`.
- Status: proposta para aprovacao.
- Esta documentacao continua como visao do motor; a SPEC-003 detalha formulas, validacoes, perfis, seguranca, RLS e testes para implementacao futura.
