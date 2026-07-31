# E2E Tests

Testes E2E da SPEC-002 cobrem responsividade, teclado, autenticacao visual, protecao server-side de rotas e ausencia de segredos no HTML renderizado.

Comando:

```bash
npm run web:test:e2e
```

Viewports oficiais: 360, 390, 768, 1024, 1366 e 1440 px.

## SPEC-002 Entrega E

Inclui E2E para manifest instalavel, prompt de instalacao simulado, pagina offline, service worker, fallback offline, Cache Storage sem dados sensiveis e responsividade em 6 viewports.
