# Componentes Auth

Componentes implementados na Entrega C:

- `AuthLayout`: layout visual comum dos fluxos publicos de autenticacao.
- `SplashScreen`: tela inicial real que consulta `/auth/resolve` e segue o destino decidido no servidor.
- `LoginForm`: e-mail, senha, mostrar/ocultar senha, validacao e estados de envio.
- `RecoveryForm`: recuperacao de senha com mensagem neutra.
- `ResetPasswordForm`: nova senha, confirmacao e tratamento de link/sessao invalida.
- `LogoutButton`: limpeza de estado local nao autoritativo e sign-out server-side.

Todos os componentes devem continuar reutilizando os contratos de `lib/auth` e `lib/supabase`, sem duplicar decisao de tenant ou papel no browser.