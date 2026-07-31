# Rotas Autenticadas

Grupo reservado para a area da usuaria final.

A Entrega D implementa o App Shell estrutural deste grupo:

- `/inicio`: dashboard estrutural;
- `/minha-conta`: dados basicos da usuaria, sem edicao sensivel;
- `/minha-assinatura`: estrutura informativa, sem Stripe ou checkout;
- `/precificacao`, `/estoque`, `/fornecedores`, `/minicursos`: portas futuras sem funcionalidade interna.

A protecao server-side, sessao e resolucao de tenant pertencem a fundacao da Entrega B/C e continuam obrigatorias. Estado visual nao substitui autorizacao.