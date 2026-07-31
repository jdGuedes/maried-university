# MARIED UNIVERSITY Web

Aplicacao web/PWA da MARIED UNIVERSITY.

Estado atual: Entrega A da SPEC-002 em implementacao, limitada a fundacao frontend, tokens, assets, estrutura global e componentes-base minimos.

Fora do escopo desta entrega:

- autenticacao funcional;
- clientes Supabase browser/server;
- middleware/proxy de sessao;
- App Shell autenticado funcional;
- modulos de negocio;
- migrations;
- deploy.

## Estrutura reservada

A Entrega A cria grupos e pastas para as proximas entregas da SPEC-002. READMEs em rotas, libs e testes sao contratos de organizacao, nao implementacao funcional.

## Validacoes locais

A partir da raiz do repositorio:

```bash
npm run web:typecheck
npm run web:build
npm run web:test:e2e
```

O teste E2E usa Playwright local para validar a superficie estrutural da Entrega A em 360, 390, 768, 1024, 1366 e 1440 px. Artefatos de teste ficam em `test-results/` e `playwright-report/`, ignorados pelo Git.
