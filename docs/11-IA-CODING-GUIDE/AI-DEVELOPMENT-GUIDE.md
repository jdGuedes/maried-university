# Guia de Desenvolvimento com IA

## Regras obrigatorias

1. Ler `PROJECT.md`.
2. Consultar a SPEC da tarefa.
3. Nao inventar regras.
4. Nao ampliar escopo silenciosamente.
5. Nao duplicar motores.
6. Nao expor segredos.
7. Criar migrations versionadas.
8. Aplicar RLS.
9. Escrever testes.
10. Atualizar documentacao.
11. Informar arquivos alterados.
12. Nao fazer deploy ou merge sem autorizacao.

## Backend First e seguranca

- Nunca implementar autorizacao apenas no React.
- Nunca liberar modulo por retorno de pagina.
- Nunca usar chaves secretas no cliente.
- Nunca confiar em `tenant_id`, `role`, `price_id` ou valor financeiro enviado pelo navegador.
- Sempre revalidar sessao e permissao no servidor.
- Sempre manter RLS.
- Parar e pedir revisao quando houver duvida de seguranca.

## Quando parar e perguntar

- duvida sobre formula;
- duvida sobre cobranca;
- duvida sobre RLS;
- duvida sobre historico;
- duvida sobre estrutura;
- duvida sobre escopo;
- duvida sobre seguranca.
