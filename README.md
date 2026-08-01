# MARIED UNIVERSITY

Ecossistema SaaS modular para iniciantes e pequenos negocios do segmento de semijoias e folheados.

## Estado Atual do Projeto

- SPEC-001 concluida: fundacao tecnica de identidade, ownership, papeis, RLS e isolamento multitenant validada localmente.
- SPEC-002 v1.1 concluida com ressalvas: fundacao frontend, autenticacao, PWA, App Shell e gates finais da usuaria final.
- Entrega A da SPEC-002 concluida, commitada e enviada: fundacao frontend, tokens, assets, estrutura global, componentes-base e validacao E2E.
- Entrega B da SPEC-002 concluida, commitada e enviada: clientes Supabase browser/server, sessao server-side, protecao de rotas e resolucao segura inicial de acesso.
- Entrega C da SPEC-002 concluida, commitada e enviada: splash, login, recuperacao, redefinicao, callback seguro, logout, validacoes de formulario e testes unit/integration/E2E.
- Entrega D da SPEC-002 concluida, commitada e enviada: App Shell autenticado, dashboard estrutural, navegacao desktop/mobile, Minha Conta, Minha Assinatura, estados oficiais de modulos, estados de acesso e governanca permanente.
- Entrega E da SPEC-002 concluida, commitada e enviada: PWA instalavel, manifest, icones, service worker seguro, fallback offline, prompts de instalacao/atualizacao e matriz de cache conservadora.
- Entrega F da SPEC-002 concluida localmente: testes finais, acessibilidade, responsividade, performance, bundle, seguranca, Security Gate e Frontend Gate, com ressalvas documentadas.
- Nenhuma implementacao funcional dos modulos do MVP comecou ainda.

## Fase atual

O projeto esta no fechamento final da SPEC-002. A proxima etapa recomendada e preparar uma SPEC propria para o Precificador Inteligente, sem iniciar implementacao funcional antes da aprovacao documental.

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
- `docs/PROJECT_STATE.md`: retrato curto do estado real para a proxima entrega.
- `docs/GOAL_FRAMEWORK.md`: modelo oficial para proximos Goals.
- `docs/IMPLEMENTATION_RULES.md`: regras permanentes de execucao das entregas.
- `MVP_INITIAL_SCOPE_UPDATED.md`: escopo funcional e visual oficial do MVP.
- `FRONTEND_DESIGN_SYSTEM.md`: sistema visual oficial.
- `SECURITY_POLICY.md`: politica permanente de seguranca.
- `.specs/`: especificacoes aprovadas para implementacao.
- `docs/`: documentacao oficial.
- `docs/implementation-log/README.md`: politica permanente de registros de implementacao por entrega.
- `references/`: referencias visuais oficiais versionadas.
- `supabase/migrations/`: migrations versionadas.

## SPEC vigente

A SPEC vigente para a proxima implementacao e:

```text
.specs/002-FRONTEND-AUTH-PWA-USER-SHELL/SPEC-002-FRONTEND-AUTH-PWA-USER-SHELL-v1.1-APROVADA.md
```

## Proximo passo

Preparar a proxima SPEC do Precificador Inteligente. Nao iniciar Precificador, Estoque, Fornecedores, Microcursos, Stripe, OAuth, migrations ou deploy sem tarefa propria aprovada.
