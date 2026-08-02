# Scripts

Scripts auxiliares versionados e seguros.

## Local

Os scripts em `scripts/local/` sao utilitarios para bancos descartaveis do Supabase CLI local. Eles nao criam usuarios Auth, nao armazenam senhas, nao devem ser usados contra Supabase remoto e dependem de usuario de teste local criado manualmente.

- `prepare-local-test-access.sql`: prepara profile, tenant sintetico e membership ativa para um usuario Auth local ja confirmado.
- `prepare-local-pricing-profiles.sql`: prepara seis perfis comerciais sinteticos para validacao local do Precificador: Pix, Cartao, Revendedora, Atacado, Marketplace e Personalizado.

Exemplo de uso local:

```powershell
Get-Content -LiteralPath 'scripts\local\prepare-local-test-access.sql' |
  docker exec -i supabase_db_maried-university psql -U postgres -d postgres -v test_email='usuario-local@example.test'

Get-Content -LiteralPath 'scripts\local\prepare-local-pricing-profiles.sql' |
  docker exec -i supabase_db_maried-university psql -U postgres -d postgres -v test_email='usuario-local@example.test'
```

Nao versionar senhas, tokens, dumps ou dados reais junto destes scripts.
