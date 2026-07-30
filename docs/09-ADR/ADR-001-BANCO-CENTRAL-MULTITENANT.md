# ADR-001 | Banco Central Multitenant

**Status:** APROVADO

## Decisão

Usar um banco central Supabase com isolamento por `tenant_id` e RLS.

## Motivo

Menor custo, manutenção sustentável e boa escala inicial.
