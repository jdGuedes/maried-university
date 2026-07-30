# ADR-011 | Backend First para Operacoes Sensiveis

**Status:** APROVADO
**Data:** 2026-07-30

## Contexto

A MARIED UNIVERSITY e um SaaS multitenant. Identidade, tenant, papel, assinatura, pagamento, desconto e liberacao de modulo afetam seguranca, cobranca e isolamento de dados. O frontend pode ser manipulado pelo usuario e nao pode ser tratado como fonte confiavel para autorizacao ou conclusao de operacoes sensiveis.

## Decisao

Adotamos a politica arquitetural Backend First para operacoes sensiveis.

O frontend pode apresentar informacoes, coletar entradas e iniciar acoes, mas nao decide autorizacao e nao conclui operacoes sensiveis sozinho.

Toda operacao sensivel deve ser validada e concluida no backend, Supabase Auth, PostgreSQL com RLS ou webhooks verificados.

Autenticacao administrativa, autorizacao, papeis, membros, assinaturas, pagamentos, descontos e liberacao de modulos sao responsabilidades server-side.

Server Actions e Route Handlers devem ser tratados como endpoints publicos. Toda acao server-side deve validar sessao, tenant, papel, modulo e entrada antes de executar mudancas.

Segredos nunca chegam ao navegador. A `service_role` nunca deve ser usada no frontend.

Pagamentos futuros serao confirmados apenas por webhook Stripe verificado. Retornos de pagina, parametros de URL ou estados enviados pelo navegador nao confirmam pagamento.

RLS permanece obrigatoria mesmo para operacoes que passam pelo backend.

## Fora do escopo desta ADR

OAuth e Stripe ainda nao serao implementados nesta tarefa. Suas configuracoes detalhadas serao definidas nas SPECS correspondentes.

## Consequencias

- Componentes React nao podem conter a decisao final de autorizacao.
- Valores como `tenant_id`, `role`, `price_id`, preco ou status de pagamento enviados pelo navegador devem ser tratados como entrada nao confiavel.
- Operacoes de identidade, membros e papeis devem usar validacoes server-side e protecoes no banco.
- RLS deve continuar protegendo dados mesmo quando a chamada vem do backend.
- Fluxos futuros de pagamento dependem de webhook verificado para liberar assinatura ou modulo.
