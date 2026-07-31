# Auth Server Contracts

A Entrega B preparou a base server-side de sessao e acesso via Supabase SSR.

A Entrega C adiciona os fluxos funcionais de autenticacao:

- `actions.ts`: server actions de login, recuperacao, redefinicao e logout.
- `validation.ts`: validacoes puras de e-mail, senha, confirmacao e estados oficiais de formulario.
- `redirects.ts`: allow-list de destinos internos autenticados para impedir open redirect.

Regras preservadas:

- nenhuma senha e armazenada fora do Supabase Auth;
- nenhum token/cookie/segredo e registrado em log;
- o browser nao decide tenant, role ou autorizacao;
- `service_role` e chaves secretas nunca sao usadas no frontend;
- recuperacao de senha usa mensagem neutra contra enumeracao.