# FRONTEND DESIGN SYSTEM
## Arquitetura Visual Oficial da MARIED UNIVERSITY

**Projeto:** MARIED UNIVERSITY
**Status:** APROVADO
**Aplicação:** obrigatória em todas as telas, módulos e estados visuais
**Última atualização:** 30/07/2026

---

# 1. OBJETIVO

Este documento define o padrão oficial de frontend, experiência do usuário e identidade visual da MARIED UNIVERSITY.

Ele deve ser lido antes de qualquer implementação de:

- página pública;
- login;
- cadastro;
- onboarding;
- dashboard;
- formulário;
- tabela;
- card;
- modal;
- drawer;
- lista;
- relatório;
- painel administrativo;
- fluxo mobile;
- componente PWA.

Este documento complementa:

- `PROJECT.md`;
- `SECURITY_POLICY.md`;
- `CODEX_EXECUTION_PROTOCOL.md`;
- SPECS;
- ADRs;
- documentação de módulos.

---

# 2. VISÃO VISUAL

A MARIED UNIVERSITY deve parecer um produto digital proprietário, premium, contemporâneo e fácil de operar.

A experiência deve transmitir:

- clareza;
- leveza;
- tecnologia;
- sofisticação;
- confiança;
- produtividade;
- acolhimento visual;
- domínio operacional.

O sistema não deve parecer:

- template administrativo genérico;
- painel Bootstrap;
- tema comprado;
- coleção de cards desconectados;
- interface excessivamente decorada;
- software corporativo pesado;
- aplicativo infantilizado;
- dashboard com informação comprimida.

---

# 3. DIREÇÃO ESTÉTICA

A direção visual oficial será:

> **Claymorphism tecnológico, leve, funcional e responsivo.**

O claymorphism será usado com disciplina.

Características:

- superfícies macias;
- volumes sutis;
- bordas arredondadas;
- sombras internas e externas;
- gradientes controlados;
- profundidade visual;
- elementos com aparência tátil;
- brilho suave;
- contraste suficiente;
- animações discretas;
- leitura confortável.

O efeito tridimensional nunca deve prejudicar:

- legibilidade;
- velocidade;
- acessibilidade;
- contraste;
- hierarquia;
- compreensão da ação.

---

# 4. PRINCÍPIOS DE DESIGN

Toda tela deve obedecer aos seguintes princípios:

1. uma ação principal clara;
2. hierarquia visual evidente;
3. poucos elementos competindo;
4. informações agrupadas por contexto;
5. responsividade real;
6. interação confortável por mouse e toque;
7. feedback imediato;
8. acessibilidade;
9. consistência;
10. segurança visual;
11. redução de cliques;
12. desempenho.

---

# 5. STACK OFICIAL

## Aplicação

- Next.js;
- React;
- TypeScript;
- HTML semântico em TSX;
- Tailwind CSS;
- CSS Modules quando necessário;
- CSS global controlado;
- PWA.

## Ícones

- Lucide Icons como padrão principal;
- SVG customizado apenas quando o ícone necessário não existir ou não combinar com a identidade visual;
- não misturar bibliotecas de ícones sem justificativa.

## Movimento

- CSS transitions;
- CSS keyframes;
- Framer Motion somente quando houver ganho real de experiência.

## Componentes

Os componentes devem ser próprios do projeto ou baseados em primitivas acessíveis.

Bibliotecas externas podem apoiar comportamento, mas não devem impor aparência genérica.

---

# 6. PROCESSO VISUAL OBRIGATÓRIO

Antes de implementar uma superfície complexa, o Codex deve:

1. ler esta documentação;
2. levantar requisitos da tela;
3. definir a hierarquia;
4. criar um conceito visual completo;
5. definir os estados desktop e mobile;
6. extrair tokens;
7. definir componentes;
8. implementar;
9. testar no navegador;
10. comparar conceito e implementação;
11. corrigir diferenças;
12. executar o Frontend Gate.

Para telas complexas, dashboards, editores, formulários extensos ou páginas com muitos estados, o conceito deve cobrir:

- tela principal;
- estados vazios;
- carregamento;
- erro;
- sucesso;
- modal;
- mobile;
- interação principal.

---

# 7. DESIGN TOKENS

Todos os valores visuais devem ser centralizados.

## 7.1. Cores base

A paleta deve ser refinada e tecnológica.

### Fundo

- branco;
- off-white controlado;
- cinza muito claro;
- tonalidades suaves com leve temperatura quente.

### Superfícies

- branco levemente translúcido;
- bege claro;
- cinza claro;
- superfícies com gradiente sutil.

### Marca

- dourado;
- marrom;
- champagne;
- cobre suave;
- azul tecnológico como contraste secundário.

### Semânticas

- verde para sucesso;
- azul para informação;
- laranja para atenção;
- vermelho para erro;
- roxo para automação, IA ou destaque especial.

## 7.2. Gradientes

Gradientes devem ser suaves e intencionais.

Exemplos de uso:

- fundo de página;
- cabeçalho;
- botão primário;
- card de destaque;
- indicador ativo;
- progresso;
- áreas de onboarding.

Evitar:

- arco-íris;
- múltiplos gradientes competindo;
- brilho exagerado;
- cores neon em excesso;
- gradiente sobre todo componente.

## 7.3. Tipografia

A tipografia deve ser legível e contemporânea.

### Hierarquia sugerida

- Display: 40–56 px desktop;
- H1: 32–40 px desktop;
- H2: 26–32 px;
- H3: 20–24 px;
- Body Large: 18 px;
- Body: 16 px;
- Body Small: 14 px;
- Caption: 12–13 px;
- Button: 14–16 px;
- Label: 13–14 px.

### Regras

- evitar textos menores que 12 px;
- evitar títulos excessivamente grandes em telas pequenas;
- usar line-height confortável;
- evitar texto em caixa alta em blocos longos;
- usar peso para hierarquia, não excesso de cor.

## 7.4. Espaçamento

Escala recomendada:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
```

Regras:

- espaços internos devem seguir a escala;
- componentes equivalentes devem ter o mesmo espaçamento;
- evitar valores arbitrários;
- telas densas devem preservar respiro;
- mobile deve reduzir espaçamento sem comprimir conteúdo.

## 7.5. Bordas

Raio sugerido:

- pequeno: 8 px;
- médio: 12 px;
- grande: 16 px;
- extra grande: 20–28 px;
- circular: 9999 px.

Claymorphism deve privilegiar:

- 14–22 px em controles;
- 18–28 px em cards;
- 24–32 px em painéis de destaque.

## 7.6. Sombras

As sombras devem criar profundidade sem parecer borrão pesado.

Usar combinações:

- sombra externa suave;
- luz superior;
- sombra inferior;
- sombra interna discreta;
- brilho de foco;
- sombra de elevação.

Nunca usar sombras fortes em todos os componentes.

Níveis:

1. Base;
2. Elevado;
3. Flutuante;
4. Modal;
5. Destaque.

---

# 8. CONTAINERS

## 8.1. Container principal

Regras:

- largura máxima entre 1280 e 1440 px;
- padding lateral responsivo;
- centralizado;
- sem bordas desnecessárias;
- fundo aberto quando apropriado.

### Desktop

```text
padding lateral: 24–48 px
```

### Tablet

```text
padding lateral: 20–32 px
```

### Mobile

```text
padding lateral: 16–20 px
```

## 8.2. Painéis

Painéis devem ser usados para áreas funcionais.

Características:

- claymorphism leve;
- gradiente sutil;
- borda translúcida;
- sombra suave;
- boa separação;
- sem múltiplos painéis aninhados sem necessidade.

## 8.3. Regra contra excesso de cards

Não transformar toda informação em card.

Usar também:

- listas abertas;
- seções;
- tabelas;
- faixas;
- painéis;
- drawers;
- accordions;
- timelines;
- linhas;
- agrupamentos visuais.

Cards devem existir apenas quando ajudam a compreender um bloco independente.

---

# 9. BOTÕES

## 9.1. Variantes oficiais

- Primário;
- Secundário;
- Terciário;
- Outline;
- Ghost;
- Destrutivo;
- Ícone;
- Flutuante;
- Link Action.

## 9.2. Botão primário

Características:

- gradiente da marca;
- sombra tecnológica suave;
- texto de alto contraste;
- peso 600;
- borda arredondada;
- feedback visual;
- foco visível.

Estados:

- default;
- hover;
- active;
- focus-visible;
- loading;
- disabled;
- success.

## 9.3. Tamanhos

- Small: 36 px;
- Medium: 44 px;
- Large: 52 px;
- Touch Mobile: mínimo 44 px.

## 9.4. Ícones em botões

Regras:

- tamanho entre 16 e 20 px;
- alinhamento óptico;
- espaço entre texto e ícone;
- ícone deve reforçar a ação;
- evitar ícone decorativo.

## 9.5. Botões destrutivos

Devem:

- usar vermelho de forma controlada;
- exigir confirmação quando a ação for irreversível;
- nunca ser visualmente igual ao botão principal;
- explicar consequência.

---

# 10. INPUTS

## 10.1. Estrutura

Todo campo deve possuir:

- label;
- input;
- texto de apoio quando necessário;
- mensagem de erro;
- estado de sucesso quando útil.

## 10.2. Estilo

Inputs devem possuir:

- altura mínima de 44 px;
- borda sutil;
- fundo claro;
- sombra interna leve;
- raio consistente;
- foco visível;
- texto legível;
- placeholder com contraste suficiente.

## 10.3. Estados

- default;
- hover;
- focus;
- filled;
- error;
- success;
- disabled;
- read-only;
- loading.

## 10.4. Regra

Placeholder nunca substitui label.

---

# 11. SELECTS, COMBOBOXES E AUTOCOMPLETE

Devem:

- permitir navegação por teclado;
- ter busca quando houver muitos itens;
- exibir valor atual claramente;
- ter estado vazio;
- ter mensagem de nenhum resultado;
- funcionar bem em touch;
- usar drawer no mobile quando a lista for extensa.

---

# 12. CARDS

## 12.1. Anatomia

Um card pode conter:

- título;
- descrição;
- dado principal;
- ícone;
- ação;
- rodapé;
- status.

## 12.2. Estilo claymorphism

- borda arredondada;
- sombra suave;
- brilho superior discreto;
- gradiente leve;
- profundidade controlada;
- fundo com boa leitura.

## 12.3. Variantes

- Informativo;
- Indicador;
- Ação;
- Produto;
- Alerta;
- Resumo;
- Estatística;
- Vazio;
- Selecionável.

## 12.4. Mobile

Cards no mobile devem:

- ocupar largura disponível;
- ter toque confortável;
- evitar excesso de texto;
- mostrar ação principal;
- permitir expansão quando necessário.

---

# 13. LISTAS

## 13.1. Tipos

- lista simples;
- lista com ícone;
- lista de ações;
- lista de registros;
- lista hierárquica;
- lista com avatar;
- lista responsiva;
- lista com swipe futuro.

## 13.2. Regras

Cada item deve ter:

- informação principal;
- informação secundária;
- status;
- ação quando aplicável.

Evitar:

- divisores pesados;
- excesso de ícones;
- muitos botões por linha;
- linhas muito altas sem necessidade.

No mobile, ações secundárias devem migrar para:

- menu contextual;
- drawer;
- swipe;
- modal;
- expansão.

---

# 14. TABELAS

Tabelas devem ser usadas em desktop quando a comparação entre registros for importante.

Devem possuir:

- cabeçalho claro;
- alinhamento consistente;
- colunas proporcionais;
- ordenação;
- filtros;
- paginação;
- estados vazios;
- loading;
- ações contextuais.

No mobile:

- converter para cards;
- usar lista compacta;
- usar scroll horizontal apenas quando necessário;
- preservar dados mais importantes;
- esconder colunas secundárias de forma consciente.

---

# 15. ÍCONES

## Padrão

- Lucide Icons;
- stroke consistente;
- tamanho padronizado;
- sem mistura de ícones preenchidos e outline;
- cor herdada por `currentColor`;
- alinhamento óptico.

## Tamanhos

- 14 px: legenda;
- 16 px: controles compactos;
- 18 px: inputs;
- 20 px: botões;
- 24 px: navegação;
- 28–32 px: cards de destaque.

## Regra

Ícone não substitui texto quando a ação não for óbvia.

---

# 16. TEXTOS

## 16.1. Voz da interface

A interface deve ser:

- clara;
- objetiva;
- amigável;
- profissional;
- sem jargão desnecessário.

## 16.2. Botões

Usar verbos:

- Salvar;
- Continuar;
- Criar conta;
- Adicionar produto;
- Gerar preço;
- Confirmar;
- Cancelar.

Evitar:

- OK;
- Sim;
- Não;
- Clique aqui;
- Enviar, quando uma ação mais específica existir.

## 16.3. Mensagens

Mensagens devem explicar:

1. o que aconteceu;
2. por que aconteceu;
3. o que o usuário pode fazer.

---

# 17. FEEDBACK VISUAL

Toda ação deve apresentar feedback.

Usar:

- loading;
- skeleton;
- toast;
- mensagem inline;
- progresso;
- confirmação;
- mudança de estado;
- animação curta.

Nenhuma ação importante pode parecer que “não fez nada”.

---

# 18. MODAIS E DRAWERS

## Modal

Usar para:

- confirmação;
- decisão curta;
- alerta;
- formulário pequeno;
- conteúdo de foco único.

## Drawer

Usar para:

- formulário lateral;
- filtros;
- detalhes;
- ações no mobile;
- edição contextual.

Regras:

- título claro;
- ação primária visível;
- botão de fechar;
- foco controlado;
- scroll interno;
- escape;
- responsividade.

---

# 19. NAVEGAÇÃO

## Desktop

- sidebar;
- header;
- breadcrumbs quando necessário;
- busca contextual;
- ações rápidas.

## Mobile

- barra inferior;
- menu compacto;
- drawer;
- cabeçalho reduzido;
- ação principal acessível ao polegar.

Nunca duplicar navegação sem necessidade.

---

# 20. APP SHELL

Estrutura padrão:

```text
App
├── Header
├── Sidebar Desktop
├── Navigation Mobile
├── Main Content
├── Feedback Layer
├── Modal Layer
└── PWA Update Layer
```

O App Shell deve permanecer consistente entre módulos.

---

# 21. RESPONSIVIDADE

O sistema será responsivo desde a origem.

Breakpoints conceituais:

- Mobile: 320–639 px;
- Tablet: 640–1023 px;
- Desktop: 1024–1439 px;
- Wide: 1440 px ou mais.

Regras:

- não apenas reduzir escala;
- reorganizar hierarquia;
- reposicionar ações;
- transformar tabelas;
- reduzir colunas;
- adaptar navegação;
- aumentar áreas de toque;
- evitar overflow.

Cada tela deve ser validada em:

- 360 px;
- 390 px;
- 768 px;
- 1024 px;
- 1366 px;
- 1440 px.

---

# 22. MOBILE FIRST SEM PREJUDICAR DESKTOP

Mobile deve ser pensado desde o início, mas o desktop deve aproveitar a área disponível.

Mobile:

- foco em tarefa;
- poucas ações;
- cards;
- drawers;
- navegação inferior;
- câmera;
- toque.

Desktop:

- visão ampla;
- tabelas;
- painéis;
- atalhos;
- múltiplas colunas;
- produtividade.

---

# 23. PWA

A MARIED UNIVERSITY será instalável como PWA.

Obrigatório:

- `manifest.webmanifest`;
- service worker;
- ícones;
- nome curto;
- nome completo;
- cor de tema;
- fundo;
- modo standalone;
- atualização controlada;
- fallback offline;
- política de cache.

## Estados PWA

- instalação disponível;
- atualização disponível;
- offline;
- reconectado;
- erro de sincronização;
- versão desatualizada.

## Regra

Nenhum dado sensível deve ser armazenado offline sem decisão explícita de segurança.

---

# 24. ANIMAÇÕES

## Direção

Animações devem reforçar a tecnologia e a fluidez.

Permitidas:

- fade-in;
- fade-out;
- slide curto;
- scale suave;
- hover lift;
- glow discreto;
- transição de sombra;
- skeleton;
- progress;
- ripple controlado;
- expansão de conteúdo;
- entrada de drawer;
- modal scale-fade.

## Duração

- microinteração: 120–180 ms;
- controle: 180–240 ms;
- painel: 240–320 ms;
- modal: 220–300 ms;
- entrada de página: 280–420 ms.

## Regras

- respeitar `prefers-reduced-motion`;
- evitar animação contínua;
- evitar atraso em ações;
- evitar fade longo;
- evitar movimento decorativo excessivo.

---

# 25. EFEITOS TECNOLÓGICOS

Podem ser usados:

- brilho de borda;
- glow leve;
- gradiente dinâmico;
- background mesh sutil;
- partículas muito discretas em áreas especiais;
- linha luminosa;
- shimmer em loading;
- glass suave combinado com clay;
- profundidade por camadas.

Não usar em excesso.

A área operacional deve permanecer limpa.

---

# 26. CLAYMORPHISM

## Anatomia recomendada

```text
Background suave
+
Surface elevada
+
Borda translúcida
+
Highlight superior
+
Sombra externa
+
Sombra interna
+
Raio generoso
```

## Regras

- não deixar todos os elementos “fofos”;
- componentes críticos devem ser claros;
- contraste deve atender acessibilidade;
- sombras devem ser consistentes;
- claymorphism não substitui hierarquia;
- estados ativos devem ser evidentes;
- elementos clicáveis devem parecer clicáveis.

---

# 27. ACESSIBILIDADE

Obrigatório:

- HTML semântico;
- labels;
- foco visível;
- navegação por teclado;
- contraste;
- estados não dependentes apenas de cor;
- áreas de toque mínimas;
- texto alternativo;
- ARIA quando necessário;
- suporte a leitores de tela;
- redução de movimento.

---

# 28. PERFORMANCE

Priorizar:

- Server Components;
- Client Components apenas quando necessário;
- carregamento progressivo;
- lazy loading;
- imagens otimizadas;
- suspense;
- streaming;
- redução de JavaScript;
- componentes pequenos;
- memoização somente quando necessária.

Evitar:

- animações pesadas;
- bibliotecas grandes sem necessidade;
- componentes gigantes;
- re-renderizações;
- efeitos visuais que prejudiquem dispositivos simples.

---

# 29. SEGURANÇA DO FRONTEND

O frontend nunca será fonte de autorização.

Nunca confiar em:

- papel;
- tenant;
- módulo;
- preço;
- desconto;
- assinatura;
- pagamento;
- estado local;
- botão escondido.

Toda ação sensível deve ser revalidada no backend.

Seguir integralmente:

- `SECURITY_POLICY.md`;
- Backend First;
- RLS;
- validação server-side.

---

# 30. COMPONENTES OFICIAIS

O Design System deve possuir:

## Base

- Button;
- IconButton;
- Input;
- Textarea;
- Select;
- Combobox;
- Checkbox;
- Radio;
- Switch;
- Label;
- Field;
- FormMessage.

## Layout

- Container;
- Stack;
- Grid;
- Section;
- Panel;
- Divider;
- Spacer.

## Dados

- Card;
- StatCard;
- DataTable;
- List;
- ListItem;
- Badge;
- Avatar;
- Progress;
- Timeline.

## Navegação

- Sidebar;
- Header;
- BottomNav;
- Breadcrumb;
- Tabs;
- Pagination;
- Menu;
- Dropdown.

## Feedback

- Toast;
- Alert;
- EmptyState;
- Skeleton;
- Spinner;
- ProgressBar;
- ErrorState;
- SuccessState.

## Overlay

- Modal;
- Dialog;
- Drawer;
- Popover;
- Tooltip;
- CommandPalette.

---

# 31. ESTADOS OBRIGATÓRIOS

Todo componente interativo deve definir:

- default;
- hover;
- active;
- focus-visible;
- selected;
- disabled;
- loading;
- error;
- success.

Todo módulo deve definir:

- carregando;
- vazio;
- erro;
- sucesso;
- sem permissão;
- sem conexão;
- conteúdo disponível.

---

# 32. TESTES VISUAIS

Antes de aprovar uma tela:

1. abrir no navegador;
2. testar desktop;
3. testar mobile;
4. testar teclado;
5. testar foco;
6. testar loading;
7. testar vazio;
8. testar erro;
9. testar ação principal;
10. comparar com o conceito aprovado.

---

# 33. FRONTEND GATE

```text
FRONTEND GATE

[ ] Identidade visual preservada
[ ] Claymorphism aplicado com disciplina
[ ] Gradientes controlados
[ ] Sombras consistentes
[ ] Tipografia correta
[ ] Botões padronizados
[ ] Inputs padronizados
[ ] Ícones consistentes
[ ] Containers corretos
[ ] Sem excesso de cards
[ ] Desktop validado
[ ] Mobile validado
[ ] PWA considerada
[ ] Animações respeitam reduced motion
[ ] Acessibilidade validada
[ ] Sem overflow
[ ] Sem texto cortado
[ ] Sem controles inativos
[ ] Sem lógica sensível no frontend
[ ] Performance aceitável
[ ] Conceito e implementação comparados

RESULTADO:

APROVADO
ou
REPROVADO
```

Nenhuma tela deve entrar na `main` com resultado REPROVADO.

---

# 34. REGRAS PARA O CODEX

O Codex deve:

- ler este documento antes de frontend;
- criar conceito antes de tela complexa;
- extrair tokens;
- usar componentes reutilizáveis;
- preservar responsividade;
- validar navegador;
- comparar conceito e implementação;
- corrigir diferenças;
- não inventar interface genérica;
- não adicionar cards sem necessidade;
- não usar decoração sem função;
- não encerrar com problemas visuais corrigíveis.

O Codex deve parar quando:

- faltar decisão de produto;
- faltar identidade visual aprovada;
- houver conflito com segurança;
- houver risco de acessibilidade;
- houver necessidade de alterar arquitetura;
- não for possível validar a implementação.

---

# 35. REGRA FINAL

Uma tela só é considerada concluída quando:

- é bonita;
- é fácil de usar;
- é rápida;
- funciona no mobile;
- funciona no desktop;
- é acessível;
- respeita o Design System;
- respeita a Segurança;
- passa no Frontend Gate;
- possui fidelidade ao conceito aprovado.

A MARIED UNIVERSITY deve ser reconhecida pela consistência visual, pela sensação tecnológica e pela simplicidade operacional.

O efeito visual deve encantar sem transformar a interface em enfeite.

A tecnologia deve aparecer no acabamento.

A facilidade deve aparecer no uso.
