# MVP INITIAL SCOPE â€” MARIED UNIVERSITY
## Regra Oficial de Continuidade, Design, Hierarquia, Fluxos e ValidaÃ§Ãµes

**Projeto:** MARIED UNIVERSITY
**VersÃ£o:** 2.0
**Status:** APROVADO PARA IMPLEMENTAÃ‡ÃƒO
**AplicaÃ§Ã£o:** obrigatÃ³ria para SPECS, implementaÃ§Ã£o, revisÃ£o, testes e aceite
**ResponsÃ¡vel de produto:** Product Owner da MARIED UNIVERSITY
**Data de consolidaÃ§Ã£o:** 30/07/2026

---

# 1. FINALIDADE DESTE DOCUMENTO

Este documento substitui e amplia o escopo inicial do MVP. Ele passa a ser a fonte principal de verdade para o Codex e para qualquer agente, desenvolvedor ou ferramenta que implemente a MARIED UNIVERSITY.

O objetivo Ã© garantir que:

1. cada imagem de referÃªncia seja interpretada como uma tela, estado, fluxo ou conjunto de componentes do sistema;
2. a implementaÃ§Ã£o seja visualmente fiel Ã s telas aprovadas;
3. todos os mÃ³dulos compartilhem o mesmo padrÃ£o de navegaÃ§Ã£o, formulÃ¡rios, listas, detalhes, aÃ§Ãµes, modais, mensagens e hierarquia;
4. a experiÃªncia da usuÃ¡ria final e a experiÃªncia da Central Administrativa pertenÃ§am ao mesmo sistema visual;
5. as regras de negÃ³cio, validaÃ§Ãµes e relacionamentos sejam implementados de forma segura e previsÃ­vel;
6. funcionalidades futuras nÃ£o sejam introduzidas sem aprovaÃ§Ã£o do Product Owner.

---

# 2. REGRA OBRIGATÃ“RIA PARA O CODEX

Antes de escrever cÃ³digo, o Codex deverÃ¡ analisar individualmente todas as imagens da pasta `references/`.

Cada imagem representa uma ou mais das seguintes categorias:

- tela principal;
- tela pai;
- tela filha;
- formulÃ¡rio;
- detalhes;
- drawer lateral;
- modal;
- confirmaÃ§Ã£o;
- erro;
- toast;
- estado vazio;
- estado carregando;
- fluxo de criaÃ§Ã£o;
- fluxo de ediÃ§Ã£o;
- fluxo de exclusÃ£o;
- navegaÃ§Ã£o entre mÃ³dulos;
- regra visual global.

## 2.1. Fidelidade obrigatÃ³ria

O Codex nÃ£o deverÃ¡ reinterpretar livremente o layout aprovado. Deve preservar:

- hierarquia visual;
- posiÃ§Ã£o e papel dos elementos;
- organizaÃ§Ã£o da navegaÃ§Ã£o;
- relaÃ§Ã£o entre tabela, cards, drawer e modal;
- paleta de cores;
- tipografia e pesos visuais;
- bordas, raios e sombras;
- espaÃ§amentos e respiros;
- densidade das telas;
- Ã­cones e significado das aÃ§Ãµes;
- mensagens, estados e feedbacks;
- comportamento responsivo;
- marca MARIED UNIVERSITY.

AdaptaÃ§Ãµes tÃ©cnicas sÃ£o permitidas apenas quando necessÃ¡rias para responsividade, acessibilidade ou funcionamento real. A adaptaÃ§Ã£o nÃ£o pode descaracterizar o design.

## 2.2. Regra de divergÃªncia

Quando houver divergÃªncia entre:

1. uma imagem;
2. este documento;
3. uma implementaÃ§Ã£o anterior;

seguir esta prioridade:

1. regra funcional e de escopo escrita neste documento;
2. fluxo e hierarquia mostrados nas imagens aprovadas;
3. implementaÃ§Ã£o existente, somente quando nÃ£o contrariar os dois itens anteriores.

## 2.3. Elementos visuais fora do escopo

Se uma imagem mostrar funÃ§Ã£o ainda nÃ£o aprovada funcionalmente, o Codex deverÃ¡:

- manter a consistÃªncia visual quando o componente fizer parte do layout;
- nÃ£o criar regra de negÃ³cio nova por conta prÃ³pria;
- ocultar, desabilitar ou proteger por feature flag o recurso nÃ£o aprovado;
- registrar a divergÃªncia na documentaÃ§Ã£o tÃ©cnica.

---

# 3. REFERÃŠNCIAS VISUAIS OFICIAIS

| CÃ³digo | Arquivo | Papel no sistema |
|---|---|---|
| REF-01 | `references/v1/01_controle_acesso_detalhes.png` | Detalhamento de recursos e aÃ§Ãµes por mÃ³dulo no Controle de Acesso |
| REF-02 | `references/v1/02_controle_acesso.png` | Tela pai de Controle de Acesso por plano |
| REF-03 | `references/v1/03_planos_fluxos.png` | Fluxos e aÃ§Ãµes dos planos: visualizar, editar, duplicar, ativar, inativar, histÃ³rico e excluir |
| REF-04 | `references/v1/04_planos_listagem.png` | Tela pai de Planos e Assinaturas |
| REF-05 | `references/v1/05_usuario_cadastro.png` | Fluxo de cadastro de usuÃ¡rio na Central Administrativa |
| REF-06 | `references/v1/06_usuario_detalhes.png` | Tela completa de detalhes do usuÃ¡rio |
| REF-07 | `references/v1/07_central_dashboard.png` | Dashboard da Central Administrativa |
| REF-08 | `references/v1/08_minicursos.png` | CatÃ¡logo e detalhes de minicursos da usuÃ¡ria final |
| REF-09 | `references/v1/09_fornecedor_detalhes.png` | Lista de fornecedores com drawer de detalhes |
| REF-10 | `references/v1/10_fornecedores_lista.png` | Listagem, aÃ§Ãµes, estados e exclusÃ£o de fornecedores |
| REF-11 | `references/v1/11_perfis_categorias.png` | Cadastro, ediÃ§Ã£o e aÃ§Ãµes de perfis comerciais e categorias |
| REF-12 | `references/v1/12_calculadora_fluxo.png` | Fluxo completo da Calculadora de Custo |
| REF-13 | `references/v1/13_estoque_fluxos.png` | Estoque: listagem, formulÃ¡rios, movimentos, detalhes e confirmaÃ§Ãµes |
| REF-14 | `references/v1/14_fluxo_geral.png` | VisÃ£o geral das telas do sistema e relaÃ§Ãµes entre mÃ³dulos |
| REF-15 | `references/v1/15_brand_kit.jpeg` | Brand Kit oficial e variaÃ§Ãµes da marca |
| REF-16 | `references/v1/16_splash.jpeg` | Tela de carregamento inicial |
| REF-17 | `references/v1/17_login.jpeg` | Tela oficial de login desktop |

Todas essas referÃªncias sÃ£o obrigatÃ³rias para a implementaÃ§Ã£o.

---

# 4. BRAND KIT E SISTEMA VISUAL

A identidade oficial Ã© definida por `REF-15`.

## 4.1. Uso das marcas

- **Logo principal:** login, pÃ¡ginas institucionais e telas de maior destaque.
- **Logo horizontal:** cabeÃ§alhos, sidebar, navbar e Ã¡reas compactas.
- **Logo vertical:** apresentaÃ§Ãµes e materiais institucionais.
- **Ãcone M:** favicon, PWA, atalhos, splash e avatar do sistema.
- **VersÃ£o branca:** fundos escuros.
- **VersÃ£o preta:** documentos monocromÃ¡ticos.
- **VersÃ£o dourada metÃ¡lica:** aplicaÃ§Ãµes premium, certificados e peÃ§as institucionais.

## 4.2. Regras visuais globais

- Fundo principal: claro, marfim ou branco quente conforme as referÃªncias.
- Destaque primÃ¡rio: dourado MARIED.
- Texto principal: grafite ou preto suave.
- Sidebar da Central Administrativa: fundo escuro com marca dourada.
- Sucesso: verde.
- InformaÃ§Ã£o: azul.
- AtenÃ§Ã£o: amarelo/Ã¢mbar.
- Erro e aÃ§Ã£o destrutiva: vermelho.
- Estado limitado: cinza ou Ã¢mbar, conforme a tela.
- Estado bloqueado: vermelho claro.
- Estado liberado: verde claro.

## 4.3. Componentes compartilhados

Todos os mÃ³dulos deverÃ£o reutilizar os mesmos componentes-base:

- AppShell;
- Sidebar;
- Topbar;
- Breadcrumb;
- PageHeader;
- SummaryCard;
- DataTable;
- FilterBar;
- SearchInput;
- FormSection;
- InputCurrency;
- InputPercentage;
- Select;
- DatePicker;
- Toggle;
- StatusBadge;
- ActionMenu;
- DetailDrawer;
- ModalConfirm;
- Toast;
- InlineAlert;
- EmptyState;
- LoadingState;
- Pagination;
- Tabs;
- Stepper.

NÃ£o duplicar componentes visualmente equivalentes em cada mÃ³dulo.

---

# 5. ARQUITETURA DE EXPERIÃŠNCIAS

A plataforma possui duas experiÃªncias conectadas:

## 5.1. ExperiÃªncia da usuÃ¡ria final

A usuÃ¡ria acessa somente os mÃ³dulos liberados por plano ou exceÃ§Ã£o individual:

- Dashboard;
- Calculadora de Custo / PrecificaÃ§Ã£o Inteligente;
- Estoque;
- Fornecedores;
- Minicursos;
- Perfil e configuraÃ§Ãµes bÃ¡sicas.

## 5.2. Central Administrativa

A Central Administrativa Ã© o backoffice da dona da MARIED UNIVERSITY e do Product Owner.

Ela controla:

- usuÃ¡rios;
- planos;
- assinaturas;
- mÃ³dulos e recursos;
- permissÃµes por plano;
- permissÃµes por usuÃ¡rio;
- fornecedores;
- categorias de fornecedores;
- pacotes/listas comercializadas;
- minicursos, mÃ³dulos, aulas e vÃ­deos;
- conteÃºdo exibido Ã  usuÃ¡ria final;
- histÃ³rico e auditoria;
- configuraÃ§Ãµes essenciais da plataforma.

A Central Administrativa nÃ£o Ã© uma empresa cliente separada. Ela Ã© a camada de governo da prÃ³pria MARIED UNIVERSITY.

---

# 6. HIERARQUIA PADRÃƒO DE TELAS

Todo mÃ³dulo deverÃ¡ seguir a mesma hierarquia.

```text
MÃ³dulo
â”œâ”€â”€ Tela pai: Listagem ou Dashboard do mÃ³dulo
â”‚   â”œâ”€â”€ Filtros
â”‚   â”œâ”€â”€ Busca
â”‚   â”œâ”€â”€ Indicadores
â”‚   â”œâ”€â”€ Tabela ou cards
â”‚   â””â”€â”€ AÃ§Ãµes principais
â”œâ”€â”€ Tela filha: Detalhes
â”‚   â”œâ”€â”€ Resumo
â”‚   â”œâ”€â”€ Abas
â”‚   â”œâ”€â”€ HistÃ³rico
â”‚   â””â”€â”€ AÃ§Ãµes contextuais
â”œâ”€â”€ Tela filha: Criar
â”‚   â”œâ”€â”€ FormulÃ¡rio
â”‚   â”œâ”€â”€ ValidaÃ§Ãµes inline
â”‚   â””â”€â”€ ConfirmaÃ§Ã£o
â”œâ”€â”€ Tela filha: Editar
â”‚   â”œâ”€â”€ FormulÃ¡rio preenchido
â”‚   â”œâ”€â”€ DetecÃ§Ã£o de alteraÃ§Ãµes
â”‚   â””â”€â”€ ConfirmaÃ§Ã£o
â””â”€â”€ Estados e aÃ§Ãµes
    â”œâ”€â”€ Ativar/Inativar
    â”œâ”€â”€ Bloquear/Desbloquear
    â”œâ”€â”€ Duplicar
    â”œâ”€â”€ Excluir
    â”œâ”€â”€ Toast
    â”œâ”€â”€ Erro
    â””â”€â”€ Estado vazio/carregando
```

## 6.1. Tela pai

ResponsÃ¡vel por localizar, resumir e iniciar aÃ§Ãµes.

Deve conter quando aplicÃ¡vel:

- tÃ­tulo e descriÃ§Ã£o;
- botÃ£o primÃ¡rio;
- cards de resumo;
- busca;
- filtros;
- listagem;
- paginaÃ§Ã£o;
- menu de aÃ§Ãµes por item.

## 6.2. Tela filha de detalhes

ResponsÃ¡vel por apresentar todos os dados do registro sem obrigar a ediÃ§Ã£o.

Deve conter:

- identificaÃ§Ã£o;
- status;
- dados principais;
- relaÃ§Ãµes;
- abas temÃ¡ticas;
- histÃ³rico;
- aÃ§Ãµes permitidas.

## 6.3. FormulÃ¡rios

FormulÃ¡rios longos devem ser divididos por etapas ou seÃ§Ãµes. O usuÃ¡rio nÃ£o deve enfrentar um â€œparedÃ£o de camposâ€.

PadrÃ£o:

- tÃ­tulo claro;
- campos obrigatÃ³rios marcados com `*`;
- ajuda contextual;
- validaÃ§Ã£o inline;
- resumo lateral quando Ãºtil;
- botÃµes Voltar, Cancelar, PrÃ³ximo ou Salvar;
- bloqueio contra envio duplicado;
- confirmaÃ§Ã£o de saÃ­da quando houver alteraÃ§Ãµes nÃ£o salvas.

---

# 7. AUTENTICAÃ‡ÃƒO E INICIALIZAÃ‡ÃƒO

## 7.1. Splash screen

ReferÃªncia: `REF-16`.

Fluxo:

```text
Abrir aplicaÃ§Ã£o
â†’ Exibir splash
â†’ Validar sessÃ£o e token
â†’ Carregar permissÃµes
â†’ UsuÃ¡rio autenticado: redirecionar ao dashboard correto
â†’ UsuÃ¡rio nÃ£o autenticado: redirecionar ao login
```

Regras:

- nÃ£o manter a splash artificialmente quando a aplicaÃ§Ã£o jÃ¡ estiver pronta;
- exibir o carregador aprovado;
- respeitar reduced motion;
- tratar falha de rede com mensagem recuperÃ¡vel.

## 7.2. Login

ReferÃªncia: `REF-17`.

Campos obrigatÃ³rios:

- e-mail;
- senha.

ValidaÃ§Ãµes:

- e-mail com formato vÃ¡lido;
- senha nÃ£o vazia;
- usuÃ¡rio ativo;
- assinatura ou acesso vÃ¡lido;
- credenciais corretas;
- limite de tentativas;
- sessÃ£o segura.

Mensagens:

- `Informe seu e-mail.`
- `Informe sua senha.`
- `E-mail invÃ¡lido.`
- `E-mail ou senha incorretos.`
- `Seu acesso estÃ¡ inativo. Entre em contato com o suporte.`
- `Seu perÃ­odo de acesso terminou.`
- `NÃ£o foi possÃ­vel entrar. Tente novamente.`

---

# 8. ESCOPO FUNCIONAL DA USUÃRIA FINAL

O MVP mantÃ©m quatro blocos de valor:

1. PrecificaÃ§Ã£o Inteligente;
2. Controle de Estoque;
3. Lista de Fornecedores;
4. Minicursos.

A Central Administrativa, planos, assinaturas e controle de acesso sÃ£o funÃ§Ãµes de sustentaÃ§Ã£o e comercializaÃ§Ã£o do MVP.

---

# 9. PRECIFICAÃ‡ÃƒO INTELIGENTE

ReferÃªncias: `REF-11`, `REF-12` e `REF-14`.

## 9.1. Hierarquia

```text
PrecificaÃ§Ã£o
â”œâ”€â”€ HistÃ³rico/Listagem de cÃ¡lculos
â”œâ”€â”€ Novo cÃ¡lculo
â”‚   â”œâ”€â”€ IdentificaÃ§Ã£o
â”‚   â”œâ”€â”€ Custos
â”‚   â”œâ”€â”€ Perdas
â”‚   â”œâ”€â”€ Custos comerciais
â”‚   â”œâ”€â”€ Perfis e margem de ganho
â”‚   â””â”€â”€ Resultado
â”œâ”€â”€ Detalhes do cÃ¡lculo
â”œâ”€â”€ Editar cÃ¡lculo
â”œâ”€â”€ Excluir cÃ¡lculo
â”œâ”€â”€ Perfis comerciais
â””â”€â”€ Categorias de peÃ§as
```

## 9.2. IdentificaÃ§Ã£o da peÃ§a

Campos:

- nome da peÃ§a, obrigatÃ³rio;
- categoria, opcional;
- descriÃ§Ã£o/observaÃ§Ãµes, opcional.

## 9.3. Custos diretos

Campos:

- custo da peÃ§a, obrigatÃ³rio e maior ou igual a zero;
- embalagem;
- tag ou etiqueta;
- frete;
- outros custos.

O custo total serÃ¡ recalculado em tempo real.

## 9.4. Perdas

Tipos:

- percentual;
- valor fixo.

Regras:

- somente um tipo ativo por cÃ¡lculo;
- valor nÃ£o pode ser negativo;
- percentual deve estar entre 0 e 100;
- a perda integra o custo real.

## 9.5. Custos comerciais

Campos por perfil:

- comissÃ£o percentual;
- impostos percentuais;
- taxa de pagamento percentual;
- taxa fixa;
- encargos de marketplace;
- outros encargos.

ValidaÃ§Ã£o crÃ­tica:

```text
soma de taxas percentuais < 100%
```

Caso contrÃ¡rio, o preÃ§o se torna matematicamente invÃ¡lido e o sistema deve bloquear o cÃ¡lculo.

Mensagem:

`A soma das taxas percentuais deve ser menor que 100%.`

## 9.6. Modos de ganho

Obrigatoriamente selecionar um:

1. lucro lÃ­quido fixo;
2. acrÃ©scimo sobre custo;
3. margem lÃ­quida desejada.

O respectivo valor deve ser obrigatÃ³rio e maior que zero.

## 9.7. Perfis comerciais

Perfis iniciais:

- Pix;
- CartÃ£o;
- Revendedora;
- Atacado;
- Marketplace;
- Personalizado.

Cada perfil possui regras prÃ³prias e poderÃ¡ ser ativado ou inativado.

## 9.8. Resultado

Exibir por perfil:

- custo total;
- preÃ§o sugerido;
- lucro lÃ­quido;
- margem lÃ­quida;
- taxas consideradas;
- opÃ§Ã£o de arredondamento.

## 9.9. IntegraÃ§Ã£o com estoque

Ao salvar um cÃ¡lculo, perguntar:

`Deseja cadastrar esta peÃ§a no estoque?`

OpÃ§Ãµes:

- `Agora nÃ£o`;
- `Cadastrar no estoque`.

Ao escolher cadastrar:

- abrir modal de confirmaÃ§Ã£o;
- redirecionar ao formulÃ¡rio de novo produto;
- preencher automaticamente nome, categoria, descriÃ§Ã£o, custo unitÃ¡rio e preÃ§o sugerido escolhido;
- marcar campos originados da calculadora;
- permitir ajuste antes de salvar;
- nÃ£o criar o produto automaticamente sem confirmaÃ§Ã£o final.

## 9.10. Relacionamentos

```text
User 1:N PricingCalculation
PricingCalculation 1:N PricingProfileResult
CommercialProfile 1:N PricingProfileResult
ProductCategory 1:N PricingCalculation
PricingCalculation 0..1:1 Product
```

---

# 10. PERFIS COMERCIAIS E CATEGORIAS

ReferÃªncia: `REF-11`.

## 10.1. Perfil comercial

Campos:

- nome, obrigatÃ³rio e Ãºnico;
- descriÃ§Ã£o;
- margem padrÃ£o;
- comissÃ£o;
- impostos;
- taxa de pagamento;
- taxa fixa;
- outros encargos;
- status.

AÃ§Ãµes:

- criar;
- editar;
- duplicar;
- ativar;
- inativar;
- excluir quando nÃ£o houver dependÃªncia.

NÃ£o permitir exclusÃ£o quando houver cÃ¡lculos relacionados. Neste caso, permitir apenas inativaÃ§Ã£o.

## 10.2. Categoria de peÃ§a

Campos:

- nome, obrigatÃ³rio e Ãºnico;
- descriÃ§Ã£o;
- Ã­cone;
- cor;
- status.

Relacionamento:

```text
ProductCategory 1:N Product
ProductCategory 1:N PricingCalculation
```

NÃ£o permitir exclusÃ£o de categoria em uso. Oferecer inativaÃ§Ã£o ou transferÃªncia dos registros para outra categoria.

---

# 11. CONTROLE DE ESTOQUE

ReferÃªncias: `REF-13` e `REF-14`.

## 11.1. Hierarquia

```text
Estoque
â”œâ”€â”€ Listagem de produtos
â”œâ”€â”€ Novo produto
â”œâ”€â”€ Detalhes do produto
â”‚   â”œâ”€â”€ Resumo
â”‚   â”œâ”€â”€ Entradas
â”‚   â”œâ”€â”€ SaÃ­das
â”‚   â””â”€â”€ HistÃ³rico
â”œâ”€â”€ Editar produto
â”œâ”€â”€ Nova entrada
â”œâ”€â”€ Nova saÃ­da
â””â”€â”€ Ajuste de estoque
```

## 11.2. Produto

Campos mÃ­nimos:

- nome, obrigatÃ³rio;
- categoria, obrigatÃ³ria;
- cÃ³digo, opcional e Ãºnico quando informado;
- unidade, obrigatÃ³ria;
- custo unitÃ¡rio, obrigatÃ³rio;
- preÃ§o de venda sugerido, opcional;
- quantidade inicial;
- estoque mÃ­nimo;
- fornecedor, opcional;
- observaÃ§Ãµes;
- status.

## 11.3. MovimentaÃ§Ãµes

Tipos:

- entrada;
- saÃ­da por venda;
- saÃ­da por perda;
- ajuste positivo;
- ajuste negativo.

Toda movimentaÃ§Ã£o deve registrar:

- produto;
- tipo;
- quantidade;
- valor unitÃ¡rio quando aplicÃ¡vel;
- data;
- responsÃ¡vel;
- origem;
- observaÃ§Ã£o.

## 11.4. Regras crÃ­ticas

- quantidade deve ser maior que zero;
- saÃ­da nÃ£o pode superar o estoque disponÃ­vel;
- produto inativo nÃ£o pode receber saÃ­da normal;
- estoque atual Ã© calculado por movimentaÃ§Ãµes, nÃ£o editado silenciosamente;
- exclusÃ£o de produto com histÃ³rico nÃ£o deve apagar movimentaÃ§Ãµes;
- preferir inativaÃ§Ã£o ou exclusÃ£o lÃ³gica.

Mensagem de estoque insuficiente:

`A quantidade solicitada Ã© maior que o estoque disponÃ­vel.`

## 11.5. Relacionamentos

```text
ProductCategory 1:N Product
Supplier 0..1:N Product
Product 1:N StockMovement
User 1:N StockMovement
PricingCalculation 0..1:1 Product
```

---

# 12. FORNECEDORES

ReferÃªncias: `REF-09`, `REF-10` e `REF-14`.

## 12.1. Hierarquia

```text
Fornecedores
â”œâ”€â”€ Lista de fornecedores
â”œâ”€â”€ Detalhes do fornecedor
â”‚   â”œâ”€â”€ Resumo
â”‚   â”œâ”€â”€ Produtos/ServiÃ§os
â”‚   â”œâ”€â”€ AvaliaÃ§Ãµes
â”‚   â””â”€â”€ HistÃ³rico
â”œâ”€â”€ Novo fornecedor
â”œâ”€â”€ Editar fornecedor
â”œâ”€â”€ Categorias
â””â”€â”€ Pacotes/Listas
```

## 12.2. Dados do fornecedor

Campos:

- nome fantasia, obrigatÃ³rio;
- razÃ£o social;
- CNPJ, opcional e Ãºnico quando informado;
- categoria, obrigatÃ³ria;
- descriÃ§Ã£o;
- responsÃ¡vel;
- telefone;
- WhatsApp;
- e-mail;
- site;
- endereÃ§o;
- cidade;
- estado;
- prazo mÃ©dio;
- pedido mÃ­nimo;
- formas de pagamento;
- regra de frete;
- observaÃ§Ãµes;
- status.

## 12.3. AÃ§Ãµes

- visualizar;
- editar;
- duplicar;
- ativar;
- inativar;
- excluir quando permitido.

Fornecedor vinculado a pacote vendido, produto ou histÃ³rico nÃ£o deve ser fisicamente excluÃ­do. Utilizar inativaÃ§Ã£o ou soft delete.

## 12.4. Pacotes de fornecedores

A MARIED UNIVERSITY vende acesso atualizado a conjuntos de fornecedores.

Relacionamentos:

```text
SupplierCategory 1:N Supplier
SupplierPackage N:M Supplier
Plan N:M SupplierPackage
User N:M SupplierPackage (liberaÃ§Ã£o individual opcional)
```

A usuÃ¡ria acessarÃ¡ somente fornecedores pertencentes a pacotes liberados por seu plano ou exceÃ§Ã£o individual.

---

# 13. MINICURSOS

ReferÃªncias: `REF-08` e `REF-14`.

## 13.1. Hierarquia

```text
Minicursos
â”œâ”€â”€ CatÃ¡logo
â”œâ”€â”€ Detalhes do curso
â”œâ”€â”€ Curso
â”‚   â”œâ”€â”€ MÃ³dulos
â”‚   â””â”€â”€ Aulas
â”œâ”€â”€ Player da aula
â”œâ”€â”€ Material complementar
â”œâ”€â”€ Progresso
â””â”€â”€ Favoritos
```

## 13.2. Modelos

```text
Course
CourseModule
Lesson
LessonMaterial
CourseEnrollment
LessonProgress
```

Relacionamentos:

```text
Course 1:N CourseModule
CourseModule 1:N Lesson
Lesson 1:N LessonMaterial
User N:M Course via CourseEnrollment
User N:M Lesson via LessonProgress
Plan N:M Course
```

## 13.3. Regras

- curso precisa ter tÃ­tulo, descriÃ§Ã£o, categoria, nÃ­vel e status;
- mÃ³dulo precisa pertencer a um curso;
- aula precisa pertencer a um mÃ³dulo;
- ordem deve ser Ãºnica dentro do pai;
- aula nÃ£o publicada nÃ£o aparece Ã  usuÃ¡ria final;
- progresso deve ser salvo por usuÃ¡rio;
- curso concluÃ­do quando todas as aulas obrigatÃ³rias forem concluÃ­das;
- acesso depende do plano ou liberaÃ§Ã£o individual.

---

# 14. CENTRAL ADMINISTRATIVA

ReferÃªncias: `REF-01` a `REF-07`.

## 14.1. Dashboard

ReferÃªncia: `REF-07`.

Indicadores permitidos no MVP administrativo:

- total de usuÃ¡rios;
- usuÃ¡rios ativos;
- novos cadastros;
- assinaturas ativas;
- planos utilizados;
- fornecedores cadastrados;
- minicursos publicados;
- atividades recentes.

Indicadores financeiros avanÃ§ados devem ser implementados somente quando houver integraÃ§Ã£o real de pagamento. NÃ£o exibir valores fictÃ­cios em produÃ§Ã£o.

## 14.2. UsuÃ¡rios

Hierarquia:

```text
UsuÃ¡rios
â”œâ”€â”€ Listagem
â”œâ”€â”€ Novo usuÃ¡rio
â”œâ”€â”€ Detalhes
â”‚   â”œâ”€â”€ InformaÃ§Ãµes gerais
â”‚   â”œâ”€â”€ Acesso e permissÃµes
â”‚   â”œâ”€â”€ Assinaturas
â”‚   â”œâ”€â”€ HistÃ³rico
â”‚   â””â”€â”€ Notas internas
â”œâ”€â”€ Editar
â”œâ”€â”€ Redefinir senha
â”œâ”€â”€ Enviar link de acesso
â”œâ”€â”€ Ativar/Inativar
â”œâ”€â”€ Bloquear/Desbloquear
â””â”€â”€ Excluir
```

### Campos do usuÃ¡rio

- foto;
- nome completo, obrigatÃ³rio;
- e-mail, obrigatÃ³rio e Ãºnico;
- telefone;
- CPF, opcional e Ãºnico quando informado;
- data de nascimento;
- gÃªnero;
- nacionalidade;
- observaÃ§Ãµes internas;
- papel de acesso;
- plano;
- inÃ­cio do acesso;
- expiraÃ§Ã£o;
- status.

### Fluxo de cadastro

1. informaÃ§Ãµes bÃ¡sicas;
2. acesso e permissÃµes;
3. plano e mÃ³dulos;
4. revisÃ£o e confirmaÃ§Ã£o.

### SeguranÃ§a

- preferÃªncia por link de definiÃ§Ã£o de senha;
- senha manual exige polÃ­tica forte;
- e-mail de acesso deve ter expiraÃ§Ã£o;
- bloquear mÃºltiplos envios rÃ¡pidos;
- todas as aÃ§Ãµes sensÃ­veis devem gerar log.

## 14.3. Planos e assinaturas

ReferÃªncias: `REF-03` e `REF-04`.

Hierarquia:

```text
Planos e Assinaturas
â”œâ”€â”€ Planos
â”‚   â”œâ”€â”€ Listagem
â”‚   â”œâ”€â”€ Novo plano
â”‚   â”œâ”€â”€ Detalhes
â”‚   â”œâ”€â”€ Editar
â”‚   â”œâ”€â”€ Duplicar
â”‚   â”œâ”€â”€ Ativar/Inativar
â”‚   â”œâ”€â”€ HistÃ³rico
â”‚   â””â”€â”€ Excluir
â””â”€â”€ Assinaturas
    â”œâ”€â”€ Listagem
    â”œâ”€â”€ Detalhes
    â”œâ”€â”€ Ativar
    â”œâ”€â”€ Suspender
    â”œâ”€â”€ Cancelar
    â””â”€â”€ Alterar plano
```

### Plano

Campos:

- nome, obrigatÃ³rio e Ãºnico;
- descriÃ§Ã£o;
- tipo: gratuito, trial ou pago;
- preÃ§o;
- perÃ­odo: dias, mensal ou anual;
- destaque;
- status;
- mÃ³dulos incluÃ­dos;
- limites por recurso;
- pacotes de fornecedores;
- cursos incluÃ­dos.

### ExclusÃ£o de plano

NÃ£o permitir excluir plano com assinatura ativa. Permitir inativar para impedir novas contrataÃ§Ãµes, preservando assinantes atuais atÃ© migraÃ§Ã£o ou tÃ©rmino.

### DuplicaÃ§Ã£o

Duplicar estrutura, mÃ³dulos e limites, mas:

- gerar novo identificador;
- adicionar sufixo `(CÃ³pia)`;
- iniciar como rascunho ou inativo;
- exigir revisÃ£o antes de publicaÃ§Ã£o.

## 14.4. Controle de acesso

ReferÃªncias: `REF-01` e `REF-02`.

Abas:

1. Por planos;
2. Por usuÃ¡rios;
3. Grupos de acesso;
4. PermissÃµes avanÃ§adas.

### Estados

- **Liberado:** recurso disponÃ­vel sem restriÃ§Ã£o adicional.
- **Limitado:** disponÃ­vel com cota, prazo ou condiÃ§Ã£o.
- **Bloqueado:** indisponÃ­vel.

### PrecedÃªncia

```text
Bloqueio de seguranÃ§a global
â†’ exceÃ§Ã£o individual do usuÃ¡rio
â†’ configuraÃ§Ã£o do plano
â†’ padrÃ£o global do mÃ³dulo
```

A exceÃ§Ã£o individual deve registrar motivo, responsÃ¡vel e validade opcional.

### Aba Por planos

- selecionar plano;
- visualizar mÃ³dulos;
- expandir recursos;
- alterar status inline;
- configurar limites;
- salvar alteraÃ§Ãµes;
- visualizar histÃ³rico.

### Aba Por usuÃ¡rios

- buscar usuÃ¡rio;
- visualizar plano herdado;
- aplicar exceÃ§Ã£o individual;
- indicar visualmente o que Ã© herdado e o que foi sobrescrito;
- restaurar heranÃ§a do plano.

### Aba Grupos de acesso

Usada para grupos operacionais internos como:

- administradora de conteÃºdo;
- instrutora;
- suporte;
- financeira.

Um grupo nÃ£o substitui o plano comercial da usuÃ¡ria final. Ele complementa permissÃµes administrativas.

### Aba PermissÃµes avanÃ§adas

Destinada somente ao Super Admin.

Deve controlar aÃ§Ãµes granulares como:

- acessar;
- criar;
- editar;
- excluir;
- publicar;
- exportar;
- gerenciar acesso.

MudanÃ§as nessa aba exigem confirmaÃ§Ã£o reforÃ§ada e registro de auditoria.

---

# 15. MODELOS E RELACIONAMENTOS PRINCIPAIS

## 15.1. Identidade e acesso

```text
User
Role
Permission
RolePermission
UserRole
Plan
Subscription
Module
ModuleResource
PlanModuleAccess
PlanResourceAccess
UserModuleOverride
UserResourceOverride
AccessGroup
AccessGroupUser
AccessAuditLog
```

## 15.2. PrecificaÃ§Ã£o

```text
PricingCalculation
PricingCostItem
PricingLoss
CommercialProfile
PricingProfileResult
ProductCategory
```

## 15.3. Estoque

```text
Product
StockMovement
InventoryBalance (visÃ£o ou projeÃ§Ã£o calculada)
```

## 15.4. Fornecedores

```text
Supplier
SupplierCategory
SupplierPackage
SupplierPackageItem
PlanSupplierPackage
UserSupplierPackageOverride
```

## 15.5. Cursos

```text
Course
CourseModule
Lesson
LessonMaterial
CourseEnrollment
LessonProgress
PlanCourse
UserCourseOverride
```

## 15.6. Regras de integridade

- usar chaves estrangeiras;
- usar soft delete para registros com histÃ³rico;
- nÃ£o apagar auditoria;
- nÃ£o usar campos de texto soltos quando houver relaÃ§Ã£o de domÃ­nio;
- valores monetÃ¡rios em decimal, nunca float;
- percentuais com precisÃ£o definida;
- datas em UTC no banco e convertidas para o fuso do usuÃ¡rio;
- status com enum ou tabela de domÃ­nio controlada;
- operaÃ§Ãµes financeiras e de estoque em transaÃ§Ã£o de banco.

---

# 16. PADRÃƒO DE VALIDAÃ‡Ã•ES

## 16.1. No frontend

- feedback imediato;
- mÃ¡scara para moeda, telefone, CPF e CNPJ;
- botÃ£o desabilitado somente quando a causa estiver clara;
- mensagem abaixo do campo;
- foco no primeiro erro;
- preservar dados preenchidos apÃ³s erro.

## 16.2. No backend

Toda regra deve ser repetida no servidor. ValidaÃ§Ã£o frontend nÃ£o Ã© seguranÃ§a.

## 16.3. Mensagens padrÃ£o

### ObrigatÃ³rio

`Este campo Ã© obrigatÃ³rio.`

### InvÃ¡lido

`Verifique o valor informado.`

### Duplicado

`JÃ¡ existe um registro com esta informaÃ§Ã£o.`

### NÃ£o encontrado

`O registro nÃ£o foi encontrado ou nÃ£o estÃ¡ mais disponÃ­vel.`

### Sem permissÃ£o

`VocÃª nÃ£o tem permissÃ£o para realizar esta aÃ§Ã£o.`

### AlteraÃ§Ãµes nÃ£o salvas

`Existem alteraÃ§Ãµes nÃ£o salvas. Deseja sair mesmo assim?`

### Erro geral

`NÃ£o foi possÃ­vel concluir a operaÃ§Ã£o. Tente novamente.`

---

# 17. PADRÃƒO DE AÃ‡Ã•ES E FEEDBACKS

## 17.1. Criar

```text
Abrir formulÃ¡rio
â†’ preencher
â†’ validar
â†’ salvar
â†’ confirmaÃ§Ã£o de sucesso
â†’ abrir detalhes ou voltar Ã  listagem
```

## 17.2. Editar

```text
Abrir registro preenchido
â†’ detectar mudanÃ§as
â†’ validar
â†’ salvar
â†’ toast de sucesso
â†’ manter contexto
```

## 17.3. Excluir

```text
Solicitar exclusÃ£o
â†’ verificar dependÃªncias
â†’ modal com nome do registro e impacto
â†’ confirmar
â†’ soft delete ou exclusÃ£o permitida
â†’ toast
```

A aÃ§Ã£o destrutiva deve usar vermelho e nunca ser o botÃ£o padrÃ£o do modal.

## 17.4. Ativar/Inativar

Sempre informar o efeito operacional.

Exemplo:

`Ao inativar este plano, ele nÃ£o poderÃ¡ receber novas assinaturas. Assinaturas atuais permanecerÃ£o preservadas.`

## 17.5. Loading

- botÃµes devem mostrar progresso;
- bloquear duplo clique;
- tabelas devem usar skeleton quando apropriado;
- nÃ£o apagar conteÃºdo antigo durante atualizaÃ§Ã£o silenciosa.

## 17.6. Toasts

- sucesso: verde;
- erro: vermelho;
- atenÃ§Ã£o: Ã¢mbar;
- informaÃ§Ã£o: azul;
- texto curto;
- fechamento automÃ¡tico, exceto erro crÃ­tico;
- aÃ§Ã£o opcional de desfazer quando tecnicamente segura.

---

# 18. RESPONSIVIDADE

## 18.1. Desktop

- sidebar fixa ou recolhÃ­vel;
- tabelas completas;
- drawers laterais;
- formulÃ¡rios em duas colunas quando houver espaÃ§o.

## 18.2. Mobile

- sidebar vira menu lateral;
- tabelas viram cards ou listas responsivas;
- aÃ§Ãµes ficam em menu contextual ou bottom sheet;
- drawers ocupam tela inteira;
- botÃµes principais permanecem acessÃ­veis;
- nenhum campo pode exigir zoom;
- Ã¡reas de toque mÃ­nimas de 44px;
- splash e login devem seguir `REF-16` e a adaptaÃ§Ã£o mobile de `REF-17`.

## 18.3. PWA

- manifest configurado;
- Ã­cones derivados do Brand Kit;
- tela de instalaÃ§Ã£o;
- tratamento de atualizaÃ§Ã£o de versÃ£o;
- cache apenas do que for seguro;
- dados sensÃ­veis nÃ£o devem ser persistidos de forma insegura.

---

# 19. SEGURANÃ‡A E AUDITORIA

Registrar:

- login e logout;
- tentativas invÃ¡lidas relevantes;
- criaÃ§Ã£o, ediÃ§Ã£o e exclusÃ£o;
- ativaÃ§Ã£o, inativaÃ§Ã£o e bloqueio;
- alteraÃ§Ã£o de plano;
- alteraÃ§Ã£o de permissÃµes;
- alteraÃ§Ã£o de mÃ³dulos e limites;
- publicaÃ§Ã£o de curso;
- alteraÃ§Ã£o de fornecedor;
- movimentaÃ§Ã£o de estoque.

Cada log deve conter:

- usuÃ¡rio responsÃ¡vel;
- data e hora;
- aÃ§Ã£o;
- entidade;
- identificador;
- antes e depois quando aplicÃ¡vel;
- IP e dispositivo quando disponÃ­vel;
- motivo, quando exigido.

---

# 20. CRITÃ‰RIOS DE ACEITE VISUAL

Uma tela sÃ³ pode ser considerada concluÃ­da quando:

- usa a logo correta;
- respeita o Brand Kit;
- reproduz a composiÃ§Ã£o da referÃªncia;
- possui estados hover, focus, disabled e loading;
- possui mensagens de erro;
- possui confirmaÃ§Ã£o de aÃ§Ãµes sensÃ­veis;
- funciona em desktop e mobile;
- nÃ£o apresenta overflow;
- mantÃ©m a hierarquia pai-filho;
- nÃ£o inventa componentes fora do padrÃ£o;
- foi comparada visualmente com a imagem de referÃªncia.

---

# 21. CRITÃ‰RIOS DE ACEITE FUNCIONAL

- validaÃ§Ãµes frontend e backend;
- permissÃµes aplicadas no backend;
- usuÃ¡rios nÃ£o acessam rotas bloqueadas por URL direta;
- mudanÃ§as de acesso refletem na prÃ³xima requisiÃ§Ã£o ou atualizaÃ§Ã£o de sessÃ£o;
- operaÃ§Ãµes crÃ­ticas usam transaÃ§Ã£o;
- exclusÃµes respeitam relacionamentos;
- histÃ³rico nÃ£o Ã© perdido;
- filtros e paginaÃ§Ã£o funcionam;
- mensagens sÃ£o claras;
- aÃ§Ãµes nÃ£o ficam silenciosas;
- testes cobrem regras crÃ­ticas.

---

# 22. ORDEM DE IMPLEMENTAÃ‡ÃƒO

1. Brand Kit, tokens e componentes globais;
2. autenticaÃ§Ã£o, splash, login e PWA;
3. shell da usuÃ¡ria final;
4. PrecificaÃ§Ã£o Inteligente;
5. Estoque;
6. Fornecedores;
7. Minicursos;
8. shell da Central Administrativa;
9. usuÃ¡rios;
10. planos e assinaturas;
11. controle de acesso;
12. gestÃ£o administrativa de fornecedores;
13. gestÃ£o administrativa de minicursos;
14. logs e auditoria;
15. testes, responsividade e lanÃ§amento.

---

# 23. FORA DO ESCOPO SEM NOVA APROVAÃ‡ÃƒO

- emissÃ£o fiscal;
- notas fiscais;
- contabilidade completa;
- integraÃ§Ã£o tributÃ¡ria;
- automaÃ§Ãµes avanÃ§adas;
- IA operacional;
- produÃ§Ã£o e banho como mÃ³dulo produtivo completo;
- lotes e remessas;
- etiquetas;
- catÃ¡logo digital completo;
- exportaÃ§Ãµes avanÃ§adas;
- relatÃ³rios analÃ­ticos avanÃ§ados;
- integraÃ§Ãµes comerciais nÃ£o aprovadas.

Elementos mostrados em referÃªncias que pertenÃ§am a essa lista nÃ£o devem ganhar implementaÃ§Ã£o funcional automÃ¡tica.

---

# 24. REGRA FINAL

A MARIED UNIVERSITY deverÃ¡ ser simples para a usuÃ¡ria final e poderosa para a Central Administrativa.

O sistema deve parecer um Ãºnico produto, nÃ£o um conjunto de telas desconectadas. Toda nova tela deverÃ¡ herdar:

- o Brand Kit;
- o shell correspondente;
- a hierarquia de telas;
- os componentes compartilhados;
- o padrÃ£o de validaÃ§Ãµes;
- o padrÃ£o de aÃ§Ãµes;
- o padrÃ£o de mensagens;
- as regras de acesso;
- a rastreabilidade por logs.

O Codex deverÃ¡ tratar as imagens como especificaÃ§Ãµes visuais oficiais, este documento como especificaÃ§Ã£o funcional oficial e qualquer implementaÃ§Ã£o como sujeita a revisÃ£o de fidelidade antes de ser aprovada.
