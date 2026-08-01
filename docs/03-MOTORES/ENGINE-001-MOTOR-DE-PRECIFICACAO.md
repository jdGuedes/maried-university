# ENGINE-001 | Motor de Custos e PrecificaÃ§Ã£o

**Status:** EM ELABORAÃ‡ÃƒO

## Objetivo

Centralizar o cÃ¡lculo de custo tÃ©cnico, custo real, preÃ§o tÃ©cnico, preÃ§o sugerido e preÃ§o aprovado.

## Escopo inicial

- peÃ§a bruta;
- ouro;
- prata;
- verniz;
- custos adicionais;
- perdas;
- rateios;
- margem;
- comissÃ£o;
- imposto;
- taxas;
- arredondamento;
- histÃ³rico.

## Regra crÃ­tica

Nenhum mÃ³dulo pode duplicar as fÃ³rmulas deste motor.

## Teste obrigatÃ³rio

5 milÃ©simos de ouro + 3 de mÃ£o de obra, cotaÃ§Ã£o de R$ 600,00 e peso de 1,20 g deve resultar em R$ 5,76 de custo de ouro.

## SPEC relacionada

- SPEC-003 Precificador Inteligente: `.specs/003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md`.
- Status: aprovada para implementacao.
- Esta documentacao continua como visao do motor; a SPEC-003 detalha formulas, validacoes, perfis, seguranca, RLS e testes para implementacao futura.
