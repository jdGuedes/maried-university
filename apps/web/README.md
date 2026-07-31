# MARIED UNIVERSITY Web

Aplicacao web/PWA da MARIED UNIVERSITY.

Estado atual: Entregas A e B da SPEC-002 concluidas localmente. O app possui fundacao frontend, componentes-base, clientes Supabase browser/server, proxy de sessao, protecao de rotas e resolucao server-side inicial de acesso.

Fora do escopo desta entrega:

- autenticacao funcional;
- clientes Supabase browser/server;
- middleware/proxy de sessao;
- App Shell autenticado funcional;
- modulos de negocio;
- migrations;
- deploy.

## Estrutura reservada

As Entregas A e B criam a base visual e a base segura de acesso para as proximas entregas da SPEC-002. READMEs em rotas, libs e testes continuam como contratos de organizacao quando a funcionalidade ainda for futura.

## Validacoes locais

A partir da raiz do repositorio:

```bash
npm run web:typecheck
npm run web:build
npm run web:test:e2e
```

O teste E2E usa Playwright local para validar a superficie estrutural e a protecao inicial de rotas em 360, 390, 768, 1024, 1366 e 1440 px. Artefatos de teste ficam em `test-results/` e `playwright-report/`, ignorados pelo Git.
