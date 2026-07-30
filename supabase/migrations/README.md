# Migrations

As migrations devem representar o banco real.

Regras:

- não duplicar estruturas já aplicadas;
- não editar migration já aplicada em produção;
- criar migration corretiva;
- manter nomes em `snake_case`;
- incluir RLS e índices;
- documentar dependências;
- testar antes de aplicar.
