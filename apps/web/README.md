# MARIED UNIVERSITY Web

Aplicacao web/PWA da MARIED UNIVERSITY.

Estado atual: Entregas A, B e C da SPEC-002 implementadas localmente. O app possui fundacao frontend, componentes-base, clientes Supabase browser/server, proxy de sessao, protecao de rotas, resolucao server-side inicial de acesso e fluxos de autenticacao visual/funcional.

Implementado na Entrega C:

- splash real sem atraso artificial;
- login por e-mail e senha via Supabase Auth;
- recuperacao de senha com mensagem neutra;
- redefinicao de senha por sessao de recuperacao;
- callback seguro com allow-list de redirects;
- logout com limpeza de estado local nao autoritativo;
- validacao de campos, loading, foco, teclado e mensagens seguras.

Fora do escopo desta entrega:

- cadastro publico;
- OAuth/login social;
- Stripe;
- App Shell autenticado completo;
- modulos de negocio;
- migrations;
- deploy.

## Estrutura reservada

As Entregas A, B e C criam a base visual, a base segura de acesso e os fluxos de autenticacao para as proximas entregas da SPEC-002. READMEs em rotas, libs e testes continuam como contratos de organizacao quando a funcionalidade ainda for futura.

## Validacoes locais

A partir da raiz do repositorio:

```bash
npm run web:typecheck
npm run web:test:unit
npm run web:test:integration
npm run web:build
npm run web:test:e2e
```

O teste E2E usa Playwright local para validar splash, login, recuperacao, redefinicao, acesso direto protegido, teclado, ausencia de segredos e responsividade em 360, 390, 768, 1024, 1366 e 1440 px. Artefatos de teste ficam em `test-results/` e `playwright-report/`, ignorados pelo Git.