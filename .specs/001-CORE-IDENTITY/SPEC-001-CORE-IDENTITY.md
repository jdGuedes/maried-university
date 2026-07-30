# SPEC-001 | Fundação de Identidade e Multitenancy

**Status:** RASCUNHO PARA REVISÃO

## Objetivo

Fechar a Fase 1 de identidade e isolamento multiempresa.

## Entregas

- trigger de perfil automático;
- owner automático ao criar tenant;
- função `has_tenant_role`;
- políticas seguras para gestão de membros;
- testes SQL com dois usuários e dois tenants;
- advisors de segurança e performance.

## Fora do escopo

- Stripe;
- interface;
- Precificador;
- produtos;
- etiquetas;
- deploy Vercel.

## Critério principal

Usuário A não pode consultar, editar ou excluir dados do tenant B, mesmo conhecendo UUIDs.
