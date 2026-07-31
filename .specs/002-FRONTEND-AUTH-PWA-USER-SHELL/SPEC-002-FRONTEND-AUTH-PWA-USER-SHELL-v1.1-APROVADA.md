# SPEC-002 | Frontend Foundation, Authentication, PWA and User App Shell

**Status:** APROVADA PARA IMPLEMENTACAO

## 1. Identificacao

| Campo | Valor |
|---|---|
| Codigo | SPEC-002 |
| Titulo | Frontend Foundation, Authentication, PWA and User App Shell |
| Versao | 1.1 |
| Status | APROVADA PARA IMPLEMENTACAO |
| Data | 2026-07-30 |
| Responsavel de produto | Product Owner da MARIED UNIVERSITY |
| Dependencia | SPEC-001 concluida, validada localmente e enviada no commit `973b18ea1b576442ae3ff52528fa94421aff8696` |
| Branch/contexto tecnico | `agent/initial-project-foundation` |
| Ambientes impactados | Aplicacao web futura, PWA, Supabase Auth local/remoto, rotas autenticadas, experiencia da usuaria final |

Documentos de referencia obrigatorios:

- `PROJECT.md`
- `SECURITY_POLICY.md`
- `CODEX_EXECUTION_PROTOCOL.md`
- `FRONTEND_DESIGN_SYSTEM.md`
- `MVP_INITIAL_SCOPE_UPDATED.md`
- ADR-001 a ADR-006
- ADR-011
- `docs/02-BANCO-DE-DADOS/ESTADO-ATUAL.md`
- migrations de `supabase/migrations/`
- testes em `tests/`
- `README.md`
- `CHANGELOG.md`

Referencias visuais oficiais analisadas a partir de `MARIED_MVP_SPEC_v2.zip`:

| Codigo | Arquivo | Uso nesta SPEC |
|---|---|---|
| REF-01 | `references/v1/01_controle_acesso_detalhes.png` | Estados de acesso, permissoes futuras e densidade de tabelas administrativas |
| REF-02 | `references/v1/02_controle_acesso.png` | Estrutura futura de controle de acesso, sem implementacao nesta fase |
| REF-03 | `references/v1/03_planos_fluxos.png` | Padrao de fluxos, acoes contextuais e modais |
| REF-04 | `references/v1/04_planos_listagem.png` | Listagem, estados e acao primaria em area administrativa futura |
| REF-05 | `references/v1/05_usuario_cadastro.png` | Formularios por etapas, validacoes e fluxo de senha futura |
| REF-06 | `references/v1/06_usuario_detalhes.png` | Detalhes, abas e hierarquia de informacoes |
| REF-07 | `references/v1/07_central_dashboard.png` | Dashboard administrativo futuro e linguagem de cards |
| REF-08 | `references/v1/08_minicursos.png` | Cards de modulo, catalogo e conteudo futuro |
| REF-09 | `references/v1/09_fornecedor_detalhes.png` | Drawer de detalhes e navegacao contextual |
| REF-10 | `references/v1/10_fornecedores_lista.png` | Lista, filtros, estado vazio e menu de acoes |
| REF-11 | `references/v1/11_perfis_categorias.png` | Tabs, cadastros auxiliares e estados de modulo |
| REF-12 | `references/v1/12_calculadora_fluxo.png` | Fluxo futuro da Precificacao, sem regra funcional nesta fase |
| REF-13 | `references/v1/13_estoque_fluxos.png` | Fluxos de estoque futuros, sem operacao funcional nesta fase |
| REF-14 | `references/v1/14_fluxo_geral.png` | Relacao entre telas, modulos e shell geral |
| REF-15 | `references/v1/15_brand_kit.jpeg` | Brand Kit, logos, paleta, iconografia e PWA icons |
| REF-16 | `references/v1/16_splash.jpeg` | Splash screen oficial |
| REF-17 | `references/v1/17_login.jpeg` | Login desktop oficial |

Modulos impactados apenas como destinos estruturais:

- Precificacao Inteligente
- Controle de Estoque
- Lista de Fornecedores
- Minicursos

## 2. Resumo executivo

Esta SPEC define a fundacao visual, tecnica e de seguranca da aplicacao web/PWA da MARIED UNIVERSITY antes da implementacao dos modulos de negocio.

A fase cria um contrato para Brand Kit digital, design tokens, componentes globais minimos, splash, login, recuperacao e redefinicao de senha, logout, validacao server-side de sessao, protecao de rotas, resolucao de usuario/tenant/acesso, App Shell da usuaria final, navegacao desktop/mobile, dashboard estrutural e estrategia PWA conservadora.

Ela vem antes dos modulos porque Precificacao, Estoque, Fornecedores e Minicursos precisam nascer dentro do mesmo shell, com mesma identidade visual, mesma sessao, mesma protecao de rotas e mesmos estados globais. A implementacao direta dos modulos sem esta base aumentaria risco de telas desconectadas, autorizacao duplicada, cache inseguro e componentes divergentes.

Esta fase nao implementa regras internas dos modulos, Stripe, OAuth, planos funcionais, CRUD administrativo, migrations, dados reais, deploy ou alteracoes remotas.

## 3. Filosofia operacional

A usuaria inicia o uso abrindo a aplicacao instalada como PWA ou em navegador. A aplicacao carrega assets essenciais, exibe uma splash util e valida a sessao no servidor antes de decidir o destino.

O sistema reconhece a sessao por cookies seguros gerenciados pelo fluxo Supabase Auth no servidor. O browser pode iniciar a experiencia, mas nao decide identidade, tenant, papel ou modulo liberado.

O acesso e carregado em camadas:

1. sessao Supabase valida;
2. usuario existente em `profiles`;
3. tenant ativo em `tenants`;
4. vinculo ativo em `tenant_members`;
5. papel documentado em `member_role`;
6. permissao/modulo quando essa camada existir;
7. RLS sempre ativa como defesa adicional.

A aplicacao evita telas desconectadas exigindo App Shell unico para a usuaria final, tokens centralizados, componentes reutilizaveis e rotas agrupadas por experiencia.

A interface deve continuar simples para iniciantes: poucos caminhos principais, mensagens claras, uma acao primaria por contexto, estados vazios orientados e modulos futuros apresentados sem simular funcionalidades.

Desktop, mobile e PWA compartilham a mesma arquitetura de rotas, resolucao de sessao, tokens e componentes, alterando apenas a composicao responsiva.

## 4. Problemas que a SPEC resolve

- Ausencia de identidade visual codificada a partir do Brand Kit.
- Risco de componentes duplicados entre modulos.
- Risco de sessao validada apenas no frontend.
- Ausencia de App Shell consistente para a usuaria final.
- Falta de padrao responsivo para splash, login, shell e dashboard.
- Falta de estados globais de loading, vazio, erro, offline, sem permissao e sessao expirada.
- Risco de cache PWA armazenar dados sensiveis.
- Risco de cada modulo criar sua propria navegacao.
- Necessidade de preparar crescimento modular sem implementar regras futuras.

## 5. Escopo incluido

### 5.1. Brand Kit digital

Converter REF-15 e `FRONTEND_DESIGN_SYSTEM.md` em tokens semanticos. A implementacao futura deve usar logo principal em login, icone M em splash/PWA/favicon e logo horizontal no shell.

### 5.2. Design tokens

Tokens minimos:

- cores de marca, superficies, textos, bordas, estados e foco;
- gradientes controlados;
- sombras internas/externas do claymorphism funcional;
- raios, espacamentos, z-index, duracoes e curvas;
- tipografia e pesos;
- breakpoints e tamanhos minimos de toque.

Valores hexadecimais definitivos nao devem ser inventados. Quando a cor nao puder ser medida com seguranca do Brand Kit, usar nome semantico e marcar como pendente de extracao visual.

### 5.3. Componentes-base minimos

Implementar futuramente apenas o necessario para auth, shell, PWA e dashboard estrutural:

- Button, IconButton, Input, PasswordInput, Field, FormMessage, Checkbox;
- Alert, Toast, Spinner, Skeleton, EmptyState, ErrorState, OfflineState;
- Logo, AppShell, Sidebar, Topbar, MobileNavigation, UserMenu, PageHeader;
- ModuleCard, StatusBadge, Modal, Drawer;
- PWAInstallPrompt e PWAUpdatePrompt.

Componentes de DataTable, InputCurrency, DatePicker, Stepper e similares ficam planejados para os modulos futuros.

### 5.4. Layouts e fluxos

Inclui layout publico, layout de autenticacao, layout autenticado, splash, login, recuperacao, redefinicao, logout, protecao de rotas, contexto de usuario/tenant/acesso, redirecionamentos, App Shell, navegacao desktop/mobile, dashboard estrutural, manifest, service worker, estado offline, acessibilidade, responsividade, testes e documentacao.

## 6. Fora do escopo

Ficam expressamente fora desta SPEC:

- cadastro publico de empresa, salvo aprovacao documental explicita;
- OAuth e login social;
- Stripe, planos funcionais, cobranca e assinatura funcional completa;
- Precificacao funcional;
- Estoque funcional;
- Fornecedores funcional;
- Minicursos funcional;
- Central Administrativa completa;
- CRUD de usuarios, planos ou permissoes granulares;
- relatorios, impressao, PDF, exportacao;
- notificacoes push;
- sincronizacao offline de dados operacionais;
- cache offline de dados sensiveis;
- deploy, Vercel, dominio;
- migrations e alteracoes remotas no Supabase.

Itens visuais necessarios para preservar layout devem ser tratados como placeholder estrutural, estado desabilitado, rota protegida sem conteudo funcional ou implementacao futura. Nenhum placeholder pode parecer dado real.

## 7. Personas e contextos de acesso

| Contexto | Comportamento esperado |
|---|---|
| Usuaria nao autenticada | Ve splash curta e e redirecionada para login |
| Usuaria autenticada ativa | Sessao validada server-side, tenant resolvido e dashboard estrutural carregado |
| Usuaria autenticada sem tenant valido | Exibe estado de acesso indisponivel e nao carrega shell de negocio |
| Usuaria com vinculo inativo | Bloqueio server-side e mensagem neutra de acesso inativo |
| Usuaria com acesso expirado | Mensagem de periodo encerrado; regra de assinatura completa fica futura |
| Usuaria sem permissao para modulo | Modulo aparece bloqueado ou ausente conforme decisao futura; URL direta retorna sem permissao |
| Administradora futura | Central Administrativa reservada; nao implementada nesta SPEC |
| Sessao expirada | Limpa estado sensivel e redireciona ao login |
| Falha de rede | Estado recuperavel, sem expor detalhes tecnicos |
| Aplicacao offline | Fallback offline seguro, sem dados autenticados sensiveis |

Papeis validos sao os ja existentes: `owner`, `admin`, `manager`, `operator`, `viewer`.

## 8. Arquitetura de rotas proposta

Proposta para Next.js App Router, sem implementacao nesta tarefa:

```text
app/
  (public)/
    page.tsx
    offline/page.tsx
  (auth)/
    login/page.tsx
    recuperar-senha/page.tsx
    redefinir-senha/page.tsx
    callback/page.tsx
  (app)/
    layout.tsx
    inicio/page.tsx
    precificacao/page.tsx
    estoque/page.tsx
    fornecedores/page.tsx
    minicursos/page.tsx
    minha-assinatura/page.tsx
    minha-conta/page.tsx
  (admin)/
    page.tsx
  acesso-negado/page.tsx
  sessao-expirada/page.tsx
  erro/page.tsx
```

| Rota | Finalidade | Publico | Pre-condicoes | Acesso direto | Redirecionamento | Seguranca | Referencia |
|---|---|---|---|---|---|---|---|
| `/` | Entrada e resolucao inicial | Todos | Nenhuma | Exibe splash/resolve destino | Login ou inicio | Nao decide acesso no browser | REF-14, REF-16 |
| `/login` | Autenticacao por e-mail/senha | Nao autenticadas | Sem sessao valida | Se autenticada, vai ao inicio | `/inicio` apos validacao | Mensagem neutra e rate limit | REF-17 |
| `/recuperar-senha` | Solicitar reset | Nao autenticadas | E-mail informado | Sempre mensagem neutra | Login | Nao revela existencia de conta | REF-17 |
| `/redefinir-senha` | Definir nova senha via token | Usuario com link valido | Token Supabase valido | Token invalido mostra erro neutro | Login/inicio conforme sessao | Token nunca logado | REF-17 |
| `/callback` | Concluir fluxo Auth quando aplicavel | Supabase Auth | Parametros validos | Parametros invalidos falham seguro | Destino resolvido no servidor | Sem open redirect | MVP, Security |
| `/inicio` | Dashboard estrutural | Autenticadas | Sessao, tenant e vinculo ativo | Valida server-side | Login/acesso-negado | RLS e contexto server-side | REF-14 |
| `/precificacao` | Destino estrutural futuro | Autenticadas | Modulo liberado quando houver camada | Sem permissao se bloqueado | Inicio/acesso-negado | Sem regra funcional | REF-12 |
| `/estoque` | Destino estrutural futuro | Autenticadas | Modulo liberado quando houver camada | Sem permissao se bloqueado | Inicio/acesso-negado | Sem operacao funcional | REF-13 |
| `/fornecedores` | Destino estrutural futuro | Autenticadas | Modulo liberado quando houver camada | Sem permissao se bloqueado | Inicio/acesso-negado | Sem CRUD funcional | REF-09, REF-10 |
| `/minicursos` | Destino estrutural futuro | Autenticadas | Modulo liberado quando houver camada | Sem permissao se bloqueado | Inicio/acesso-negado | Sem progresso funcional | REF-08 |
| `/minha-assinatura` | Placeholder estrutural | Autenticadas | Sessao valida | Nao simula cobranca | Inicio/acesso-negado | Sem Stripe | MVP |
| `/minha-conta` | Perfil basico estrutural | Autenticadas | Sessao valida | Nao inventa campos | Inicio/login | Dados minimos de profile | SPEC-001 |
| `/admin` | Reserva futura | Administradora futura | Regra nao implementada | Bloqueado por padrao | Acesso negado | Nao confiar no frontend | REF-01 a REF-07 |
| `/offline` | Fallback PWA | Todos | Falha de rede/cache | Pode abrir offline | Reconectar | Sem dados sensiveis | PWA |
| `/acesso-negado` | Sem permissao | Autenticadas | Falha de autorizacao | Estavel | Inicio/login | Nao revela papel/tenant | Security |
| `/sessao-expirada` | Sessao expirada | Todos | Token expirado | Estavel | Login | Limpa estado local | Security |

## 9. Fluxo de inicializacao

```text
Abrir aplicacao
-> carregar assets essenciais
-> exibir splash
-> validar sessao no servidor
-> validar usuario
-> validar vinculo ativo
-> resolver tenant
-> resolver contexto de acesso
-> determinar destino
-> redirecionar
-> carregar shell correto
```

Comportamentos:

- Sem sessao: redirecionar para `/login`.
- Sessao valida: resolver contexto no servidor e abrir `/inicio`.
- Sessao expirada: limpar estado local e exibir rota/mensagem de sessao expirada.
- Usuario inativo: mensagem `Seu acesso esta inativo. Entre em contato com o suporte.`
- Tenant inativo: bloquear shell e informar acesso indisponivel.
- Vinculo inexistente ou inativo: bloquear acesso e nao expor tenants.
- Multiplos tenants: pendencia de produto; nao escolher automaticamente sem regra aprovada.
- Falha de rede: manter splash apenas enquanto ha tentativa real; depois mostrar erro recuperavel/offline.
- Timeout: exibir acao de tentar novamente.
- Dados inconsistentes: falha segura, sem carregar shell autenticado.

## 10. Splash screen

Referencia principal: REF-16.

A splash deve ser uma tela de inicializacao real, nao atraso decorativo. Ela existe para cobrir carregamento de assets essenciais e resolucao segura de sessao.

Requisitos:

- usar icone ou marca derivada do Brand Kit;
- fundo alinhado ao Brand Kit, preferencialmente claro/quente com destaque dourado;
- indicador de carregamento discreto;
- duracao controlada por prontidao real;
- `prefers-reduced-motion` respeitado;
- timeout com mensagem recuperavel;
- fallback offline quando rede falhar;
- transicao curta para login ou shell;
- mobile primeiro conforme REF-16;
- desktop centralizado e proporcional.

Criterios visuais: logo legivel, sem excesso decorativo, sem texto cortado, sem flicker, fundo e loading coerentes com REF-15/REF-16.

Criterios funcionais: nao bloquear app pronto, nao revelar estado interno, nao decidir acesso no browser.

## 11. Login

Referencia principal: REF-17.

Campos:

- e-mail;
- senha;
- opcao de mostrar/ocultar senha;
- lembrar sessao apenas se suportado com seguranca pelo fluxo Auth;
- link para recuperacao de senha.

Mensagens aprovadas:

- `Informe seu e-mail.`
- `Informe sua senha.`
- `E-mail invalido.`
- `E-mail ou senha incorretos.`
- `Seu acesso esta inativo. Entre em contato com o suporte.`
- `Seu periodo de acesso terminou.`
- `Nao foi possivel entrar. Tente novamente.`

Requisitos:

- validacao frontend para formato e campos vazios;
- validacao backend/server-side para sessao, usuario, tenant e vinculo;
- loading no botao;
- bloqueio contra clique duplo;
- erro neutro para credenciais invalidas;
- rate limiting ou mecanismo equivalente via Supabase/Auth/backend;
- foco inicial no e-mail;
- navegacao por teclado;
- password visibility acessivel;
- labels associadas;
- protecao contra enumeracao de usuarios;
- responsividade de 320px ate desktop;
- sem login social nesta fase.

## 12. Recuperacao e redefinicao de senha

Recuperacao:

- solicitar e-mail;
- validar formato;
- sempre retornar mensagem neutra;
- nao confirmar existencia de conta;
- limitar repeticao de solicitaÃ§Ãµes;
- usar Supabase Auth para envio e token.

Redefinicao:

- aceitar apenas token/link valido do Supabase Auth;
- senha deve seguir criterios reais do projeto. Config local atual indica minimo 6 e sem regra forte, mas a SPEC recomenda avaliar aumento antes de producao;
- confirmar senha;
- bloquear senhas divergentes;
- tratar link invalido e expirado com mensagens neutras;
- depois de redefinir, redirecionar para login ou resolver sessao conforme comportamento aprovado do Supabase;
- nunca implementar armazenamento manual de senha fora do Supabase Auth.

Auditoria deve registrar solicitacao e conclusao sem e-mail sensivel em logs publicos, sem token e sem senha.

## 13. Logout

Origem principal: UserMenu no App Shell.

Requisitos:

- chamar logout do Supabase no servidor/cliente apropriado conforme arquitetura;
- limpar estado local nao autoritativo;
- invalidar sessao/cookies;
- redirecionar ao login;
- impedir retorno a area autenticada pelo historico sem nova validacao server-side;
- em falha de rede, informar erro recuperavel e tentar invalidar localmente sem prometer logout remoto se ele falhar;
- auditoria futura de logout sem dados sensiveis.

Confirmacao de logout nao e obrigatoria para MVP, salvo se houver alteracoes nao salvas.

## 14. Autenticacao e autorizacao

Autenticacao confirma quem e a usuaria. Autorizacao confirma o que ela pode acessar.

Esta fase deve implementar:

- sessao Supabase validada server-side;
- protecao de rotas autenticadas;
- resolucao de usuario em `profiles`;
- validacao de tenant ativo em `tenants`;
- validacao de vinculo ativo em `tenant_members`;
- bloqueio de acesso por URL direta;
- ausencia de `service_role` no browser;
- ausencia de confianca em `user_metadata`;
- ausencia de confianca em `tenant_id` enviado pelo cliente.

Esta fase deve apenas preparar interface/contrato para:

- modulo liberado por plano;
- assinatura ou periodo pago;
- regras completas de Central Administrativa;
- controle granular de permissao.

RLS permanece obrigatoria mesmo com protecao server-side.

## 15. Estrategia Supabase

Estado real do projeto:

- `package.json` possui somente `supabase` como devDependency.
- Next.js, React e bibliotecas Supabase JS ainda nao estao instaladas.
- Supabase local esta configurado em `supabase/config.toml`.
- Auth local usa `site_url = "http://127.0.0.1:3000"`.
- `enable_signup = true` no config local, mas cadastro publico de empresa nao esta aprovado por esta SPEC.

Regras para a implementacao futura:

- verificar versoes reais de Next.js e Supabase JS antes de escolher APIs;
- criar cliente browser apenas com variaveis publicas permitidas;
- criar cliente server por requisicao, usando cookies seguros;
- atualizar/renovar sessao por middleware ou mecanismo recomendado pela versao real;
- callback deve validar destino e impedir open redirect;
- logout deve limpar cookies e estado;
- `NEXT_PUBLIC_SUPABASE_URL` e publishable/anon key podem ir ao browser;
- `SUPABASE_SECRET_KEY`, service role e qualquer segredo nunca podem ir ao browser.

## 16. App Shell da usuaria final

Estrutura:

- header/topbar com logo compacta, contexto de tenant, estado de conexao e UserMenu;
- sidebar desktop com navegacao principal;
- area principal com PageHeader e conteudo;
- camada global de feedback;
- camada de modal/drawer;
- camada PWA para instalacao/atualizacao;
- mobile navigation sem competir com sidebar.

Menu estrutural previsto, validado contra MVP atualizado:

- Inicio
- Precificacao
- Estoque
- Fornecedores
- Minicursos
- Minha Assinatura
- Minha Conta

Nesta fase:

- Inicio recebe dashboard estrutural.
- Modulos podem ter rota e estado `Em preparacao` ou `Bloqueado`.
- Minha Assinatura nao simula cobranca.
- Minha Conta usa apenas informacao minima aprovada.

## 17. Navegacao desktop

Requisitos:

- sidebar fixa ou recolhivel;
- logo horizontal/compacta do Brand Kit;
- itens com icone, label, estado ativo, hover e focus-visible;
- badges apenas quando houver dado real ou estado estrutural aprovado;
- modulos bloqueados com tooltip/mensagem sem revelar regra interna;
- topbar com perfil, logout e estado de conexao;
- persistencia de preferencia visual apenas nao sensivel;
- largura reduzida deve migrar para comportamento mobile sem duplicar navegacao.

## 18. Navegacao mobile

Requisitos:

- usar menu lateral ou navegacao inferior; nao usar ambos para a mesma funcao;
- priorizar Inicio e modulos principais;
- itens excedentes em menu `Mais` ou drawer;
- area de toque minima 44px;
- safe areas respeitadas;
- drawers em tela cheia;
- foco controlado;
- botao voltar coerente;
- suportar 320px a 639px sem overflow;
- modulos bloqueados devem ser claros e nao frustrantes.

## 19. Dashboard estrutural

O dashboard desta SPEC nao pode inventar indicadores reais.

Pode conter:

- saudacao;
- resumo de acesso sem valores operacionais ficticios;
- atalhos para os quatro modulos;
- continuidade de curso como bloco futuro desabilitado/placeholder;
- alertas de acesso;
- estado vazio;
- skeleton;
- modulos bloqueados/disponiveis conforme contexto aprovado;
- acao principal segura.

Classificacao obrigatoria dos elementos:

- componente estrutural;
- placeholder de desenvolvimento;
- dado real futuro;
- estado vazio.

Nenhum valor financeiro, estoque, curso ou fornecedor ficticio deve parecer real.

## 20. Brand Kit e tokens

Tokens semanticos propostos:

| Categoria | Tokens |
|---|---|
| Marca | `brand.primary`, `brand.gold`, `brand.gold-metallic`, `brand.dark`, `brand.light` |
| Superficies | `surface.canvas`, `surface.raised`, `surface.sunken`, `surface.overlay`, `surface.sidebar` |
| Texto | `text.primary`, `text.secondary`, `text.muted`, `text.inverse`, `text.brand` |
| Borda | `border.subtle`, `border.strong`, `border.focus`, `border.danger` |
| Estados | `state.success`, `state.info`, `state.warning`, `state.danger`, `state.blocked`, `state.limited` |
| Sombras | `shadow.soft`, `shadow.inner`, `shadow.float`, `shadow.modal` |
| Gradientes | `gradient.brand`, `gradient.surface`, `gradient.premium` |
| Raios | `radius.sm`, `radius.md`, `radius.lg`, `radius.round` |
| Espaco | `space.1` a `space.12` |
| Z-index | `z.base`, `z.dropdown`, `z.sticky`, `z.drawer`, `z.modal`, `z.toast` |
| Movimento | `duration.fast`, `duration.normal`, `duration.slow`, `ease.standard`, `ease.out` |
| Foco | `focus.ring`, `focus.offset` |

Os valores finais devem ser medidos a partir do Brand Kit e implementados em arquivo centralizado. Aproximacoes arbitrarias sao proibidas.

## 21. Componentes globais

| Componente | Implementar nesta fase | Responsabilidade | Uso proibido |
|---|---|---|---|
| Button | Sim | Acoes principais/secundarias/loading | Acao destrutiva como padrao |
| IconButton | Sim | Acoes compactas com tooltip | Icone sem nome acessivel |
| Input/Field | Sim | Formularios de auth | Campo sem label |
| PasswordInput | Sim | Senha com visibilidade | Expor senha por padrao |
| FormMessage | Sim | Erros e ajuda de campo | Stack trace |
| Alert/Toast | Sim | Feedback global | Revelar dado interno |
| Spinner/Skeleton | Sim | Loading real | Atraso decorativo |
| Empty/Error/OfflineState | Sim | Estados globais | Dados ficticios |
| Logo | Sim | Marca oficial | Recriar logo manualmente sem asset |
| AppShell/Sidebar/Topbar | Sim | Estrutura autenticada | Decidir permissao no cliente |
| MobileNavigation | Sim | Navegacao responsiva | Competir com sidebar |
| UserMenu | Sim | Perfil/logout | Expor role sensivel sem necessidade |
| ModuleCard | Sim | Atalhos estruturais | Simular metricas reais |
| StatusBadge | Sim | Estados claros | Substituir autorizacao |
| Modal/Drawer | Sim | Feedback e detalhes estruturais | Formulario complexo sem necessidade |
| PWA prompts | Sim | Instalacao/atualizacao | Forcar instalacao |

## 22. PWA

Estrategia conservadora para o MVP:

- manifest com nome completo `MARIED UNIVERSITY`;
- nome curto a definir pelo Product Owner, sugestao `MARIED`;
- icones derivados do Brand Kit, incluindo maskable;
- favicon baseado no icone M;
- `display: standalone`;
- orientacao nao travada salvo decisao futura;
- theme/background color vindos dos tokens;
- service worker para assets estaticos e fallback offline;
- cache de rotas publicas seguras;
- paginas autenticadas devem preferir network-first e nao persistir conteudo sensivel;
- APIs e Supabase nao devem ser cacheados com dados autenticados;
- invalidacao por versao de build;
- prompt de atualizacao nao intrusivo;
- reconexao com feedback.

Regra absoluta: nenhum dado sensivel ou operacional deve ser armazenado offline sem decisao explicita de seguranca.

## 23. Estados globais

| Estado | Gatilho | Mensagem/acao | Seguranca |
|---|---|---|---|
| Carregando | Inicializacao ou navegacao | Skeleton/spinner real | Nao revelar detalhes internos |
| Erro | Falha recuperavel | `Nao foi possivel concluir a operacao. Tente novamente.` | Sem stack trace |
| Vazio | Sem conteudo real | Orientar proximo passo seguro | Nao criar dados fake |
| Offline | Sem rede | Informar modo offline e tentar reconectar | Sem cache sensivel |
| Reconectado | Rede volta | Toast curto | Revalidar contexto |
| Sem permissao | Falha de autorizacao | `Voce nao tem permissao para realizar esta acao.` | Nao revelar papel necessario |
| Acesso inativo | Vinculo/usuario inativo | Mensagem aprovada de acesso inativo | Bloqueio server-side |
| Periodo encerrado | Regra futura de acesso | Mensagem aprovada | Sem simular cobranca |
| Sessao expirada | Token invalido/expirado | Redirecionar login | Limpar estado |
| Tenant invalido | Tenant ausente/inativo | Estado de acesso indisponivel | Nao expor outros tenants |
| Modulo bloqueado | Modulo nao liberado | Card bloqueado/rota negada | Nao confiar no card |
| Atualizacao PWA | Nova versao | Prompt atualizar | Sem forcar perda de estado |

## 24. Mensagens

Mensagens aprovadas ou derivadas de documentos:

- Login: `E-mail ou senha incorretos.`
- E-mail vazio: `Informe seu e-mail.`
- Senha vazia: `Informe sua senha.`
- E-mail invalido: `E-mail invalido.`
- Acesso inativo: `Seu acesso esta inativo. Entre em contato com o suporte.`
- Periodo encerrado: `Seu periodo de acesso terminou.`
- Erro geral: `Nao foi possivel entrar. Tente novamente.`
- Campo obrigatorio: `Este campo e obrigatorio.`
- Sem permissao: `Voce nao tem permissao para realizar esta acao.`
- Registro indisponivel: `O registro nao foi encontrado ou nao esta mais disponivel.`
- Alteracoes nao salvas: `Existem alteracoes nao salvas. Deseja sair mesmo assim?`
- Offline: `Voce esta offline. Algumas acoes podem ficar indisponiveis ate a conexao voltar.`
- Reconectado: `Conexao restabelecida.`
- Atualizacao: `Uma nova versao esta disponivel. Atualize para continuar com a experiencia mais recente.`
- Link invalido: `Este link nao e valido ou ja foi utilizado.`
- Link expirado: `Este link expirou. Solicite um novo acesso.`
- Logout: `Sessao encerrada com seguranca.`

Mensagens nao podem revelar existencia de conta, tenant, papel, regra interna ou stack trace.

## 25. Acessibilidade

Requisitos:

- HTML semantico;
- foco visivel;
- navegacao por teclado;
- labels e descricoes associadas;
- `aria-live` para toasts importantes;
- contraste validado;
- toque minimo de 44px;
- reduced motion;
- modal/drawer com focus trap e retorno de foco;
- erros associados aos campos;
- idioma `pt-BR`;
- titulo de documento por rota;
- skip link no shell autenticado;
- estados nao dependentes apenas de cor.

## 26. Responsividade

Viewports obrigatorios:

- 360px
- 390px
- 768px
- 1024px
- 1366px
- 1440px

Superficies:

- splash: centralizada, sem cortes, loading visivel;
- login: composicao fiel a REF-17, adaptada para mobile sem split quebrado;
- shell: sidebar em desktop, navegacao mobile em telas pequenas;
- topbar: sem truncar tenant/perfil;
- dashboard: cards fluidos, sem metricas ficticias;
- modais: largura contida em desktop e full-screen/bottom sheet em mobile;
- drawers: lateral desktop e tela cheia mobile;
- mensagens PWA: nao cobrir a acao principal.

A adaptacao deve alterar hierarquia quando necessario, nao apenas reduzir tamanho.

## 27. Seguranca

Superficie de ataque:

- login por forca bruta;
- enumeracao de conta;
- cookies manipulados;
- URL direta para rota autenticada;
- open redirect no callback;
- XSS em mensagens;
- cache PWA indevido;
- service worker antigo;
- armazenamento local sensivel;
- role/tenant enviados pelo browser;
- logs com segredo/token;
- bundle contendo service role.

Mitigacoes:

- validacao server-side de sessao;
- RLS como camada obrigatoria;
- cookies seguros conforme ambiente;
- callback com allow-list de destino;
- mensagens neutras;
- rate limiting via Supabase/Auth/backend;
- nenhuma `service_role` no browser;
- nao confiar em `user_metadata`;
- nao confiar em `tenant_id` enviado pelo cliente;
- cache conservador;
- sanitizacao e escape de conteudo;
- logs sem senha/token/cookie.

Security Gate SPEC-002:

```text
SECURITY GATE SPEC-002

[ ] Backend First respeitado
[ ] Sessao validada no servidor
[ ] Usuario validado
[ ] Tenant validado
[ ] Vinculo ativo validado
[ ] Papel validado quando aplicavel
[ ] Modulo/acesso tratado sem confiar no frontend
[ ] RLS preservada
[ ] URL direta protegida
[ ] Sem service_role no browser
[ ] Sem segredo em bundle, logs ou storage
[ ] Sem user_metadata como autoridade
[ ] Sem tenant_id vindo do cliente como autoridade
[ ] Callback sem open redirect
[ ] Login sem enumeracao de usuario
[ ] Rate limiting considerado
[ ] Cache PWA sem dados sensiveis
[ ] Service worker com invalidacao segura
[ ] Logout limpa estado e exige revalidacao
[ ] Testes permitidos e proibidos definidos
[ ] Documentacao atualizada

RESULTADO:

APROVADO
ou
REPROVADO
```

## 28. Auditoria

Eventos esperados nesta fase:

- login bem-sucedido;
- logout;
- tentativas invalidas relevantes;
- recuperacao de senha solicitada;
- redefinicao concluida;
- bloqueio de acesso;
- sessao revogada quando aplicavel.

Nao registrar senha, token, cookie, segredo ou conteudo sensivel.

Como a infraestrutura completa de auditoria ainda nao existe, a implementacao futura deve definir uma interface server-side segura, eventos esperados e fallback temporario que nao finja persistencia definitiva. Logs de console nao sao auditoria.

## 29. Modelo de dados

Esta fase nao exige novas tabelas nem migrations.

Reutilizar:

- Supabase Auth para identidade e senha;
- `public.profiles` para perfil basico;
- `public.tenants` para tenant;
- `public.tenant_members` para vinculo, papel e status ativo.

Possiveis necessidades futuras, fora desta SPEC:

- auditoria persistente;
- acesso por modulo/plano;
- assinatura;
- preferencias visuais por usuario.

Qualquer tabela futura deve ter `tenant_id` quando operacional, constraints, RLS, indices, retencao e testes. Nenhuma migration deve ser criada nesta tarefa.

## 30. Dependencias

Existentes:

- `supabase` CLI como devDependency.

Ainda ausentes e a verificar antes da implementacao:

- Next.js;
- React;
- TypeScript;
- biblioteca Supabase JS/SSR compatÃ­vel com a versao escolhida;
- biblioteca de PWA ou implementacao nativa;
- biblioteca de icones, preferencialmente Lucide conforme Design System;
- ferramenta de testes unitarios/integracao/E2E;
- ferramenta de validacao visual/acessibilidade.

Cada dependencia nova deve justificar problema resolvido, risco, licenca, tamanho, alternativa nativa e impacto no bundle. Framer Motion so deve ser recomendado se houver ganho claro e respeitar reduced motion.

## 31. Estrutura de arquivos proposta

Proposta coerente com o repositorio atual:

```text
apps/web/
  app/
    (public)/
    (auth)/
    (app)/
    (admin)/
  components/
    ui/
    feedback/
    shell/
    auth/
    pwa/
  lib/
    supabase/
    auth/
    access/
    pwa/
  styles/
    tokens.css
    globals.css
  public/
    icons/
    manifest.webmanifest
  tests/
    unit/
    integration/
    e2e/
```

Nao impor monorepo novo fora do que ja existe. `apps/web/README.md` ja existe e indica local natural para a aplicacao web futura.

## 32. Contratos e interfaces

Contratos conceituais:

| Contrato | Campos minimos | Origem confiavel | Consumidores |
|---|---|---|---|
| AuthenticatedUserContext | `userId`, `email?`, `profile` | Supabase server + `profiles` | Shell, UserMenu |
| TenantContext | `tenantId`, `name`, `status`, `role` | Banco com RLS/server | Shell, rotas |
| AccessContext | `canAccessApp`, `modules`, `reason?` | Server-side | Navegacao, guards |
| NavigationItem | `id`, `label`, `href`, `icon`, `state` | Config local + AccessContext | Sidebar/mobile |
| ModuleAccessState | `available`, `blocked`, `pending`, `reason?` | Server-side | ModuleCard, routes |
| SessionResolution | `status`, `redirectTo`, `context?` | Middleware/server | Splash, layouts |
| PWAUpdateState | `available`, `version`, `required` | Service worker | Prompt |
| ConnectionState | `online`, `lastChangedAt` | Browser, nao autoritativo | Feedback |

Dados que nunca podem vir como autoridade do browser: `tenantId`, `role`, `moduleAccess`, `subscriptionStatus`, `isPlatformAdmin`, preco, plano e permissao.

## 33. Testes

Unitarios:

- validacao de e-mail e senha vazia;
- mapeamento de erros Auth para mensagens neutras;
- construcao de NavigationItem;
- ModuleAccessState;
- manifest e utilidades PWA.

Integracao:

- login valido;
- login invalido;
- sessao expirada;
- usuario/vinculo inativo;
- tenant diferente;
- acesso direto a rota protegida;
- logout;
- recuperacao;
- redefinicao;
- middleware/cookies;
- protecao de rota.

E2E:

- splash ate login;
- login ate dashboard estrutural;
- logout;
- recuperacao de senha;
- responsividade;
- PWA install/update;
- offline;
- navegacao por teclado.

Visuais:

- REF-15 Brand Kit;
- REF-16 splash;
- REF-17 login;
- shell desktop/mobile;
- estados globais;
- dashboard estrutural.

Seguranca:

- manipulacao de cookie;
- manipulacao de rota;
- open redirect;
- usuario externo;
- tenant cruzado;
- role no frontend;
- ausencia de service role no bundle;
- cache sem conteudo autenticado sensivel.

## 34. Criterios de aceite

| Area | Criterio | Evidencia |
|---|---|---|
| Produto | A fase entrega fundacao, nao modulo funcional | Rotas de modulo sem regra interna |
| Funcional | Login, logout e reset seguem Supabase Auth | Testes integracao/E2E |
| Visual | Splash e login fieis a REF-16/REF-17 | Screenshots desktop/mobile |
| Frontend | Tokens e componentes centralizados | Arquivos de tokens e componentes reutilizados |
| Backend | Sessao resolvida server-side | Testes de rota direta |
| Autenticacao | Credenciais invalidas usam mensagem neutra | Testes de erro |
| Autorizacao | Tenant/vinculo ativo exigidos | Testes com vinculo inativo |
| PWA | Cache nao guarda dados sensiveis | Inspecao service worker |
| Acessibilidade | Teclado, foco, labels e contraste validados | Axe/manual checklist |
| Responsividade | 360, 390, 768, 1024, 1366, 1440 verificados | Screenshots |
| Seguranca | Security Gate SPEC-002 aprovado | Checklist preenchido |
| Performance | Splash nao atrasa app pronto | Medicao de carregamento |
| Documentacao | SPEC e changelog atualizados | Diff revisado |

## 35. Definition of Done

A implementacao futura so podera ser considerada concluida quando:

- Brand Kit aplicado;
- tokens centralizados;
- componentes minimos reutilizaveis;
- splash fiel;
- login fiel;
- sessao server-side;
- rotas protegidas;
- logout seguro;
- recuperacao/redefinicao funcionais via Supabase Auth;
- PWA instalada;
- cache seguro;
- mobile validado;
- desktop validado;
- acessibilidade validada;
- testes passando;
- Security Gate aprovado;
- Frontend Gate aprovado;
- documentacao atualizada;
- nenhum modulo de negocio implementado fora do escopo;
- nenhuma operacao remota executada sem autorizacao.

## 36. Plano de implementacao futuro

Entrega A:

- auditoria do repositorio;
- escolha/verificacao das versoes reais;
- tokens;
- assets;
- estrutura global.

Entrega B:

- Supabase browser/server;
- sessao;
- middleware/protecao de rotas;
- resolucao de tenant/acesso.

Entrega C:

- splash;
- login;
- recuperacao;
- redefinicao;
- logout.

Entrega D:

- App Shell;
- navegacao desktop;
- navegacao mobile;
- dashboard estrutural.

Entrega E:

- PWA;
- offline;
- atualizacao;
- prompts.

Entrega F:

- testes;
- acessibilidade;
- comparacao visual;
- Security Gate e Frontend Gate.

Esta divisao e adequada ao estado atual porque o repositorio ainda nao possui stack frontend instalada e a base de identidade acabou de ser fechada.

## 37. Riscos e pendencias

- `PROJECT.md`, `README.md` e `CODEX_EXECUTION_PROTOCOL.md` foram alinhados para apontar a Entrega A da SPEC-002 como proxima retomada.
- As referencias visuais oficiais foram organizadas em `references/v1/`; o ZIP original foi preservado em `references/archive/` como fonte de auditoria.
- Visualizador local de imagens ficou limitado por ACL; a implementacao futura deve comparar screenshots diretamente contra as imagens oficiais.
- Codigos finais de cor precisam ser extraidos do Brand Kit.
- Regra de multiplos tenants nao esta aprovada.
- Cadastro inicial/publico de empresa nao esta aprovado.
- Regra de assinatura durante login depende de camada futura.
- Infraestrutura de auditoria nao existe.
- Rate limiting alem do Supabase Auth local precisa de decisao tecnica futura.
- Envio real de e-mail/SMPP/SMTP nao configurado.
- Next.js/React/TypeScript ainda nao estao instalados.
- Estrategia final de PWA depende da stack escolhida.

## 38. Conflitos, substituicoes e decisoes de precedencia

| Conflito | Documentos | Regra que prevalece | Motivo | Atualizacao futura |
|---|---|---|---|---|
| Ponto de retomada antigo indicava SPEC-001/Precificador como proxima tarefa | `PROJECT.md`, `README.md`, `CODEX_EXECUTION_PROTOCOL.md` vs `MVP_INITIAL_SCOPE_UPDATED.md` | MVP atualizado: Brand Kit, autenticacao, splash, login, PWA e shell antes dos modulos | Documento MVP v2 e mais recente e foi aprovado para implementacao | Resolvido no alinhamento documental da SPEC-002 |
| `PROJECT.md` ainda cita Stripe como stack aprovada geral | `PROJECT.md` vs escopo desta SPEC | Stripe fora do escopo da SPEC-002 | Tarefa atual proibe Stripe e ADR-011 deixa pagamentos futuros por webhook | Criar SPEC propria para Stripe futuramente |
| Central Administrativa aparece em varias referencias | REF-01 a REF-07 vs objetivo da SPEC-002 | Central fica reservada, nao implementada | MVP define ordem: shell da usuaria final antes da Central | SPEC futura para admin shell |
| Imagens mostram modulos com detalhes funcionais | REF-08 a REF-14 vs escopo desta SPEC | Modulos aparecem apenas como destinos estruturais | Evita implementar regras sem SPEC propria | Specs futuras por modulo |
| Auth config local permite signup | `supabase/config.toml` vs escopo | Cadastro publico de empresa fora do escopo | Config local nao e decisao de produto | Decidir signup/onboarding em SPEC futura |

## 39. Matriz de rastreabilidade

| Requisito | Origem | Imagem | Componente | Rota | Seguranca | Teste | Aceite |
|---|---|---|---|---|---|---|---|
| Splash real | MVP 7.1, Design System | REF-16 | Splash/Spinner | `/` | Nao decide acesso no browser | E2E splash | Sem atraso decorativo |
| Login | MVP 7.2, Security | REF-17 | AuthForm, PasswordInput | `/login` | Mensagem neutra, rate limit | Integracao login | Login fiel e seguro |
| Recuperacao senha | Security, MVP mensagens | REF-17 | AuthForm | `/recuperar-senha` | Nao enumera conta | Integracao reset | Mensagem neutra |
| Redefinicao senha | Security | REF-17 | PasswordInput | `/redefinir-senha` | Token Supabase, sem senha manual | Integracao token | Link invalido tratado |
| Sessao server-side | ADR-011, Security | N/A | Auth guard | Todas `(app)` | Backend First | Rota direta | Browser nao autoriza |
| Tenant ativo | SPEC-001, DB docs | N/A | Access resolver | `(app)` | RLS + server check | Tenant cruzado | Isolamento preservado |
| App Shell | MVP 5/18, Design | REF-14 | AppShell | `(app)` | Nao decide permissao | E2E shell | Navegacao unica |
| Desktop nav | Design, MVP 18 | REF-14 | Sidebar/Topbar | `(app)` | Estados bloqueados server-side | Visual desktop | Sem overflow |
| Mobile nav | Design, MVP 18 | REF-16/17/14 | MobileNavigation | `(app)` | Sem duplicidade | Visual mobile | 320px suportado |
| Dashboard estrutural | MVP 5.1/8 | REF-14 | ModuleCard | `/inicio` | Sem dados fake | E2E dashboard | Atalhos seguros |
| PWA | MVP 18.3, Security | REF-15/16 | PWA prompts | `/offline` | Cache conservador | PWA/offline | Sem dado sensivel |
| Estados globais | Security, Design | Todas | Feedback states | Todas | Sem detalhes internos | Unit/integration | Mensagens aprovadas |
| Acessibilidade | Design System | REF-16/17 | Todos | Todas | Sem dependencia de cor | Axe/manual | Teclado/foco ok |
| Modulos futuros | MVP 8 | REF-08 a REF-14 | ModuleCard | Rotas modulo | Sem regra funcional | Rota bloqueada | Placeholder claro |

## 40. Contrato de Design Tokens

Os design tokens constituem contrato visual obrigatÃ³rio do projeto.

### 40.1. Regra de uso

Valores visuais nÃ£o devem ser usados diretamente em componentes, pÃ¡ginas ou mÃ³dulos quando existir token semÃ¢ntico correspondente.

Ã‰ proibido espalhar pelo cÃ³digo:

- cÃ³digos hexadecimais;
- valores RGB ou HSL;
- sombras completas;
- raios arbitrÃ¡rios;
- espaÃ§amentos nÃ£o documentados;
- duraÃ§Ãµes de animaÃ§Ã£o soltas;
- nÃ­veis de `z-index` sem token.

Uso esperado:

```text
var(--color-brand-primary)
var(--surface-raised)
var(--text-primary)
var(--radius-lg)
var(--space-4)
var(--shadow-soft)
```

Os nomes tÃ©cnicos finais podem seguir a convenÃ§Ã£o escolhida na implementaÃ§Ã£o, desde que mantenham equivalÃªncia semÃ¢ntica e origem centralizada.

### 40.2. Fonte Ãºnica

Os tokens devem existir em fonte central Ãºnica e reutilizÃ¡vel.

Componentes podem consumir tokens, mas nÃ£o redefini-los localmente sem justificativa documentada.

### 40.3. AlteraÃ§Ãµes

MudanÃ§as em tokens globais exigem revisÃ£o visual, anÃ¡lise de impacto, validaÃ§Ã£o desktop/mobile, comparaÃ§Ã£o com o Brand Kit e atualizaÃ§Ã£o documental quando alterarem o contrato visual.

### 40.4. CritÃ©rio de aceite

Nenhuma tela Ã© aprovada quando utiliza valores visuais arbitrÃ¡rios que deveriam vir de tokens oficiais.

---

## 41. Feature Flags

O App Shell deverÃ¡ nascer preparado para recursos ainda nÃ£o liberados, sem implementar regras funcionais antecipadamente.

Flags estruturais previstas:

```text
FEATURE_PRICING
FEATURE_STOCK
FEATURE_SUPPLIERS
FEATURE_COURSES
FEATURE_SUBSCRIPTION
FEATURE_ADMIN
```

### 41.1. Regras

- feature flag nÃ£o substitui autorizaÃ§Ã£o;
- feature flag nÃ£o substitui plano;
- feature flag nÃ£o substitui RLS;
- flag controla disponibilidade estrutural ou rollout;
- decisÃ£o final de acesso continua no backend;
- o frontend pode usar a flag somente para composiÃ§Ã£o visual;
- rota protegida deve continuar bloqueada mesmo quando o item estiver oculto.

### 41.2. Valores

As flags devem ser resolvidas de modo tipado e centralizado.

NÃ£o criar strings soltas espalhadas pelo frontend.

### 41.3. Comportamento

Uma funcionalidade nÃ£o liberada pode ficar oculta, aparecer como em preparaÃ§Ã£o, aparecer bloqueada ou ser disponibilizada apenas em desenvolvimento. O comportamento exato deve respeitar o estado oficial do mÃ³dulo e o contexto de acesso.

---

## 42. Estados Oficiais dos MÃ³dulos

Todo mÃ³dulo deverÃ¡ utilizar um dos estados oficiais abaixo:

```text
COMING_SOON
AVAILABLE
LOCKED
DISABLED
MAINTENANCE
```

| Estado | Significado | Comportamento esperado |
|---|---|---|
| `COMING_SOON` | MÃ³dulo aprovado, mas ainda nÃ£o implementado | Exibir como em preparaÃ§Ã£o, sem simular funcionalidade |
| `AVAILABLE` | MÃ³dulo disponÃ­vel e autorizado | Permitir navegaÃ§Ã£o e acesso |
| `LOCKED` | MÃ³dulo existente, mas nÃ£o liberado | Exibir bloqueio ou ocultar conforme regra; URL direta deve ser negada |
| `DISABLED` | MÃ³dulo desativado globalmente | NÃ£o permitir uso |
| `MAINTENANCE` | MÃ³dulo temporariamente indisponÃ­vel | Exibir manutenÃ§Ã£o e impedir operaÃ§Ã£o |

PrecedÃªncia:

```text
DISABLED
-> MAINTENANCE
-> LOCKED
-> COMING_SOON
-> AVAILABLE
```

NÃ£o criar estados alternativos com nomes diferentes para representar o mesmo comportamento.

---

## 43. Profundidade de NavegaÃ§Ã£o e Overlays

PadrÃ£o esperado:

```text
Tela pai
-> Tela filha
-> Detalhes
-> Modal ou Drawer contextual
```

Regras:

- nÃ£o abrir modal sobre modal;
- nÃ£o abrir drawer sobre drawer;
- nÃ£o usar modal para navegaÃ§Ã£o principal;
- nÃ£o usar drawer como substituto permanente de pÃ¡gina;
- overlays devem resolver uma decisÃ£o curta ou contexto complementar;
- fluxos longos devem utilizar pÃ¡gina ou etapa prÃ³pria;
- fechar overlay deve devolver foco ao elemento de origem.

A interface deve manter no mÃ¡ximo uma camada modal ativa por vez.

ExceÃ§Ãµes exigem justificativa tÃ©cnica, revisÃ£o de acessibilidade e aprovaÃ§Ã£o do Product Owner.

---

## 44. Performance Budget

A implementaÃ§Ã£o futura deverÃ¡ trabalhar com orÃ§amento de desempenho, validado apÃ³s escolha real da stack e ferramentas.

Metas iniciais para produÃ§Ã£o:

- JavaScript inicial por rota pÃºblica crÃ­tica: preferencialmente atÃ© 250 KB comprimidos;
- JavaScript inicial do App Shell autenticado: preferencialmente atÃ© 350 KB comprimidos;
- assets crÃ­ticos da primeira carga: preferencialmente atÃ© 2 MB;
- fontes: no mÃ¡ximo duas famÃ­lias e pesos estritamente necessÃ¡rios;
- Ã­cones: SVG otimizado, sem pacote integral enviado ao cliente;
- imagens: formatos modernos e dimensÃµes responsivas;
- animaÃ§Ãµes: sem bloquear interaÃ§Ã£o ou degradar dispositivos modestos.

Validar:

- Largest Contentful Paint;
- Interaction to Next Paint;
- Cumulative Layout Shift;
- tamanho do bundle;
- quantidade de JavaScript no cliente;
- tempo atÃ© interaÃ§Ã£o;
- comportamento em rede mÃ³vel simulada.

Regras:

- Server Components por padrÃ£o;
- Client Components apenas quando necessÃ¡rios;
- lazy loading para conteÃºdo nÃ£o crÃ­tico;
- nenhuma biblioteca grande sem justificativa;
- nenhum efeito visual pode sacrificar legibilidade ou resposta;
- splash nÃ£o pode esconder carregamento excessivo.

Desvios relevantes precisam ser documentados com causa, impacto e plano de correÃ§Ã£o.

---

## 45. ConvenÃ§Ãµes de Nomenclatura

### Componentes

```text
Button.tsx
PasswordInput.tsx
AppShell.tsx
MobileNavigation.tsx
```

Componentes React utilizam `PascalCase`.

### Hooks

```text
useAuth.ts
useConnectionState.ts
usePwaUpdate.ts
```

Hooks utilizam prefixo `use`.

### UtilitÃ¡rios

```text
auth-errors.ts
route-access.ts
session-resolution.ts
```

UtilitÃ¡rios e arquivos nÃ£o componentes utilizam `kebab-case`, salvo convenÃ§Ã£o obrigatÃ³ria da ferramenta.

### Tipos e contratos

```text
AuthenticatedUserContext
TenantContext
AccessContext
NavigationItem
ModuleAccessState
```

Interfaces, tipos e contratos utilizam `PascalCase`.

### Rotas

Rotas utilizam portuguÃªs em `kebab-case`:

```text
/minha-conta
/recuperar-senha
/redefinir-senha
/acesso-negado
```

### Tokens

```text
brand.primary
surface.raised
text.secondary
state.danger
radius.lg
space.4
```

### VariÃ¡veis de ambiente

VariÃ¡veis pÃºblicas precisam de prefixo permitido pela stack. Segredos nunca podem possuir prefixo pÃºblico.

---

## 46. Estados Oficiais de FormulÃ¡rio

Todo formulÃ¡rio deverÃ¡ trabalhar com estados consistentes:

```text
IDLE
DIRTY
VALID
INVALID
SUBMITTING
SUBMITTED
ERROR
DISABLED
READONLY
```

| Estado | Comportamento |
|---|---|
| `IDLE` | FormulÃ¡rio carregado sem alteraÃ§Ã£o |
| `DIRTY` | Pelo menos um campo foi alterado |
| `VALID` | Entradas locais vÃ¡lidas, sem substituir validaÃ§Ã£o backend |
| `INVALID` | HÃ¡ erro de entrada conhecido |
| `SUBMITTING` | Envio em andamento; impedir duplicaÃ§Ã£o |
| `SUBMITTED` | OperaÃ§Ã£o concluÃ­da com sucesso |
| `ERROR` | Backend ou integraÃ§Ã£o retornou falha |
| `DISABLED` | FormulÃ¡rio nÃ£o pode ser operado |
| `READONLY` | Dados visÃ­veis, sem permissÃ£o de ediÃ§Ã£o |

Regras:

- `SUBMITTING` impede envio duplo;
- dados preenchidos devem ser preservados apÃ³s erro recuperÃ¡vel;
- foco deve ir ao primeiro erro relevante;
- validaÃ§Ã£o frontend nÃ£o substitui backend;
- sair com estado `DIRTY` pode exigir confirmaÃ§Ã£o;
- `DISABLED` deve ter motivo compreensÃ­vel;
- `READONLY` nÃ£o deve parecer campo quebrado.

---

## 47. Definition of Ready

Uma entrega de implementaÃ§Ã£o sÃ³ pode comeÃ§ar quando:

```text
DEFINITION OF READY

[ ] SPEC aprovada
[ ] Escopo incluÃ­do e excluÃ­do entendido
[ ] ReferÃªncias visuais disponÃ­veis
[ ] Regras de produto definidas
[ ] Rotas afetadas definidas
[ ] Dados e contratos definidos
[ ] DependÃªncias avaliadas
[ ] SeguranÃ§a analisada
[ ] RLS e tenant considerados
[ ] Estados de tela definidos
[ ] Desktop e mobile definidos
[ ] CritÃ©rios de aceite definidos
[ ] Testes esperados definidos
[ ] PendÃªncias bloqueadoras resolvidas
[ ] OperaÃ§Ãµes externas identificadas

RESULTADO:

READY
ou
NOT READY
```

Nenhuma tarefa deverÃ¡ iniciar implementaÃ§Ã£o com resultado `NOT READY`.

---

## 48. Ajustes na Definition of Done

AlÃ©m da seÃ§Ã£o 35, a implementaÃ§Ã£o deverÃ¡ comprovar:

- uso de tokens oficiais para valores visuais globais;
- estados oficiais dos mÃ³dulos;
- ausÃªncia de modal sobre modal e drawer sobre drawer;
- convenÃ§Ãµes de nomenclatura respeitadas;
- estados de formulÃ¡rio implementados;
- performance budget medido;
- feature flags centralizadas;
- Definition of Ready aprovada antes do inÃ­cio;
- nenhuma feature flag utilizada como substituta de autorizaÃ§Ã£o.

---

## 49. AprovaÃ§Ã£o da SPEC

A SPEC-002 versÃ£o 1.1 fica aprovada como contrato para a implementaÃ§Ã£o da fundaÃ§Ã£o frontend, autenticaÃ§Ã£o, PWA e App Shell da usuÃ¡ria final.

Esta aprovaÃ§Ã£o nÃ£o autoriza automaticamente:

- deploy;
- merge;
- aplicaÃ§Ã£o remota de migration;
- configuraÃ§Ã£o de Supabase remoto;
- configuraÃ§Ã£o de OAuth;
- configuraÃ§Ã£o de Stripe;
- configuraÃ§Ã£o de Vercel;
- alteraÃ§Ã£o de domÃ­nio;
- operaÃ§Ã£o externa;
- implementaÃ§Ã£o de mÃ³dulos de negÃ³cio fora do escopo.

A implementaÃ§Ã£o deverÃ¡ ocorrer em tarefa separada, respeitando o plano de entregas da seÃ§Ã£o 36, o Security Gate, o Frontend Gate e a Definition of Ready.
