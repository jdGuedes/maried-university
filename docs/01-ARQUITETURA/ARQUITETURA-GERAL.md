# Arquitetura Geral

## Modelo

Monólito modular em Next.js, com banco central Supabase e isolamento por `tenant_id` e RLS.

## Camadas

1. Painel Central da MARIED.
2. Núcleo Compartilhado.
3. Motores Internos.
4. Módulos Comercializáveis.
5. Integrações Técnicas.

## Integrações

- Supabase: banco, Auth, RLS e Storage.
- Stripe: assinaturas e pagamentos.
- Vercel: deploy e ambientes.
- GitHub: código, histórico e PRs.
