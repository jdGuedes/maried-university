# MARIED UNIVERSITY

Ecossistema SaaS modular para iniciantes e pequenos negocios do segmento de semijoias e folheados.

## Estado Atual do Projeto

- SPEC-001 concluida: fundacao tecnica de identidade, ownership, papeis, RLS e isolamento multitenant validada localmente.
- SPEC-002 v1.1 aprovada: fundacao frontend, autenticacao, PWA e App Shell da usuaria final.
- Implementacao da SPEC-002 ainda nao iniciada.
- Nenhuma implementacao funcional dos modulos do MVP comecou ainda.

## Fase atual

O projeto esta documentalmente pronto para iniciar a implementacao da Entrega A da SPEC-002.

Ordem oficial das proximas entregas:

```text
Fundacao Frontend
-> Autenticacao
-> Splash
-> Login
-> PWA
-> App Shell
-> Dashboard estrutural
-> Precificacao Inteligente
-> Controle de Estoque
-> Fornecedores
-> Microcursos
```

## Principios

- Uma conta, varios modulos.
- Tudo conectado tecnicamente e separado comercialmente.
- Banco central multitenant.
- Regras reutilizaveis em motores internos.
- Fundacao frontend antes de modulos funcionais.
- Sem marketplace ou expansao para outros segmentos nesta fase.

## Stack aprovada

- Next.js com App Router
- TypeScript
- Supabase PostgreSQL, Auth e Storage
- Stripe Checkout e Billing, em fase futura propria
- Vercel, em fase futura propria
- GitHub
- Codex e ChatGPT

## Arquivos principais

- `PROJECT.md`: contexto permanente do projeto.
- `MVP_INITIAL_SCOPE_UPDATED.md`: escopo funcional e visual oficial do MVP.
- `FRONTEND_DESIGN_SYSTEM.md`: sistema visual oficial.
- `SECURITY_POLICY.md`: politica permanente de seguranca.
- `.specs/`: especificacoes aprovadas para implementacao.
- `docs/`: documentacao oficial.
- `references/`: referencias visuais oficiais versionadas.
- `supabase/migrations/`: migrations versionadas.

## SPEC vigente

A SPEC vigente para a proxima implementacao e:

```text
.specs/002-FRONTEND-AUTH-PWA-USER-SHELL/SPEC-002-FRONTEND-AUTH-PWA-USER-SHELL-v1.1-APROVADA.md
```

## Proximo passo

Implementar a Entrega A da SPEC-002: auditoria do repositorio, verificacao das versoes reais, tokens, assets e estrutura global.
