# MARIED UNIVERSITY

> Arquivo de contexto permanente para Codex, ChatGPT e demais agentes de desenvolvimento.

**Versão do contexto:** 0.1  
**Data de consolidação:** 29/07/2026  
**Status do produto:** SPEC-001 concluida; SPEC-002 v1.1 em implementacao; Entrega A concluida localmente
**Repositório oficial:** `jdGuedes/maried-university`  
**Responsável pelo produto:** MARIED Semijoias  
**Idioma da documentação:** Português do Brasil  
**Etapa atual:** Preparacao da Entrega B da SPEC-002

---

## 1. Finalidade deste arquivo

Este arquivo é a porta de entrada obrigatória para qualquer agente que trabalhe no projeto.

Antes de criar, alterar ou excluir código, banco, migration, fluxo, módulo, motor ou documentação, o agente deve:

1. Ler este arquivo por completo.
2. Consultar a documentação específica relacionada à tarefa.
3. Distinguir claramente o que está implementado, aprovado, planejado ou fora do escopo.
4. Não inventar regras de negócio.
5. Não considerar uma estrutura planejada como já implementada.
6. Atualizar a documentação quando uma alteração modificar comportamento, arquitetura ou banco.

Quando existir conflito entre conversa, prompt isolado e documentação versionada, prevalece a documentação mais recente aprovada no repositório.

---

## 2. Visão do produto

A MARIED UNIVERSITY será um ecossistema SaaS de micro soluções para pessoas que estão iniciando ou organizando negócios de semijoias, folheados e acessórios.

A proposta não é começar com um ERP grande. O produto deverá oferecer ferramentas pequenas, guiadas e práticas, cada uma resolvendo uma dor específica.

Princípio central:

> Tudo junto tecnicamente e separado comercialmente.

Isso significa:

- uma aplicação;
- um banco central;
- um login;
- um núcleo compartilhado;
- motores internos reutilizáveis;
- vários módulos comercializáveis;
- contratação independente por módulo ou pacote;
- dados compartilhados sem duplicação.

As mensalidades por módulo devem ser acessíveis, preferencialmente abaixo de R$ 28,00, mas os valores oficiais ainda não foram definidos.

---

## 3. Público-alvo

- pessoas iniciando no segmento de semijoias e folheados;
- pequenos fabricantes;
- pequenos lojistas;
- revendedores;
- negócios que enviam peças para banho;
- usuários que hoje dependem de calculadora, papel ou planilhas;
- empreendedores que ainda não precisam de um ERP completo.

---

## 4. Problemas que o produto resolve

- dificuldade para calcular banho em ouro, prata e verniz;
- precificação incorreta;
- esquecimento de custos;
- divergência entre custo, etiqueta, catálogo e estoque;
- repetição de cadastros em várias ferramentas;
- dificuldade para organizar lotes e remessas;
- sistemas tradicionais complexos demais para iniciantes;
- falta de rastreabilidade dos parâmetros usados em cálculos anteriores.

---

## 5. Escopo atual

### Incluído

- MARIED UNIVERSITY para semijoias e folheados;
- SaaS modular;
- banco central multitenant;
- núcleo compartilhado;
- motores internos;
- módulos próprios da MARIED;
- Supabase;
- Stripe;
- Vercel;
- GitHub;
- Codex;
- MVP atual com Fundacao Frontend, Autenticacao, Splash, Login, PWA e App Shell antes dos modulos funcionais.

### Fora do escopo atual

- marketplace de desenvolvedores;
- venda de módulos de terceiros;
- plataforma genérica para qualquer segmento;
- Dom Diego OS;
- Parking OS;
- arquitetura de microserviços distribuídos;
- construção simultânea de todos os módulos;
- expansão para outros mercados antes da validação do MVP.

Não ampliar o escopo sem ADR aprovado.

---

## 6. Modelo comercial

O cliente poderá contratar módulos individualmente ou por pacotes.

A assinatura pertence à empresa, não ao usuário individual.

Uma empresa poderá possuir vários usuários conforme regras de acesso e limites do plano.

### Módulos aprovados

| Código | Módulo | Responsabilidade | Prioridade |
|---|---|---|---|
| MODULE-001 | Precificador Inteligente | Custos, tratamentos e preço comercial | Primeiro MVP |
| MODULE-002 | Etiquetas Express | Criação e impressão de etiquetas | Próxima fase |
| MODULE-003 | Produção e Banho | Lotes, remessas, perdas e rateios | Próxima fase |
| MODULE-004 | Estoque Pocket | Entradas, saídas e saldos | Futuro |
| MODULE-005 | Catálogo Digital | Catálogo por link, PDF e WhatsApp | Futuro |
| MODULE-006 | Financeiro Simples | Entradas, saídas e visão financeira | Futuro |

### Pacotes discutidos

- **Começar:** Precificador + Etiquetas;
- **Produzir:** Precificador + Produção e Banho + Etiquetas;
- **Organizar:** Precificador + Estoque + Financeiro;
- **Completo:** todos os módulos ativos.

Os preços dos módulos e pacotes ainda são hipóteses. Não criar produtos oficiais na Stripe sem aprovação.

---

## 7. Princípios obrigatórios de produto

### 7.1. Simplicidade antes da quantidade

Cada módulo deve resolver uma dor principal.

Antes de adicionar uma funcionalidade, responder:

1. Qual problema real resolve?
2. Quem utiliza?
3. Quem não utiliza?
4. A funcionalidade pertence a este módulo?
5. Qual motor utiliza?
6. Quais dados cria ou altera?
7. Quantos passos exige?
8. O iniciante entende sem treinamento técnico?

### 7.2. Uma conta, vários módulos

O usuário não deve precisar:

- criar logins diferentes;
- cadastrar a empresa novamente;
- repetir produtos;
- repetir fornecedores;
- repetir galvânicas;
- repetir configurações compartilhadas.

### 7.3. Independência dos módulos

Classificação:

- **Independente:** funciona sozinho;
- **Complementar:** funciona sozinho, mas melhora quando integrado;
- **Dependente:** exige outro módulo e deve ser exceção.

### 7.4. Histórico preservado

Cotações, custos, preços aprovados, remessas finalizadas, assinaturas e pagamentos concluídos não podem ser alterados automaticamente.

Correções devem gerar nova versão, reabertura auditada ou registro de ajuste.

---

## 8. Arquitetura oficial

### 8.1. Stack

| Componente | Tecnologia | Responsabilidade |
|---|---|---|
| Aplicação | Next.js com App Router | UI, rotas, server actions e APIs |
| Linguagem | TypeScript em modo estrito | Código da aplicação |
| Banco | Supabase PostgreSQL | Dados e regras |
| Autenticação | Supabase Auth | Login e sessões |
| Segurança | PostgreSQL RLS | Isolamento por empresa |
| Arquivos | Supabase Storage | Fotos e documentos |
| Cobrança | Stripe Checkout + Billing | Assinaturas e pagamentos |
| Hospedagem | Vercel | Preview e produção |
| Código | GitHub | Versionamento e PRs |
| Desenvolvimento assistido | Codex + ChatGPT + Build Web Apps | Implementação, revisão e interface |

### 8.2. Monólito modular

A primeira versão será um monólito modular moderno.

Teremos:

- um repositório;
- uma aplicação;
- um projeto Supabase;
- um projeto Vercel;
- uma integração Stripe;
- domínios internos bem separados;
- motores reutilizáveis;
- módulos liberados por autorização.

Não introduzir microserviços sem necessidade comprovada e ADR aprovado.

### 8.3. Camadas

```text
MARIED UNIVERSITY
├── Painel Central da MARIED
├── Núcleo Compartilhado
├── Motores Internos
├── Módulos Comercializáveis
└── Serviços Técnicos e Integrações
```

---

## 9. Multiempresa e segurança

Cada empresa é um `tenant`.

Dados operacionais devem possuir `tenant_id`.

Regra inegociável:

> Nenhum cliente pode visualizar, editar ou excluir dados de outra empresa.

O isolamento deve existir em:

- banco;
- RLS;
- backend;
- server actions;
- APIs;
- consultas;
- relatórios;
- Storage;
- exportações;
- interface.

Esconder menu ou botão não é proteção suficiente.

Antes de executar uma ação, validar:

1. empresa ativa;
2. usuário ativo;
3. vínculo com a empresa;
4. módulo contratado;
5. assinatura válida;
6. permissão;
7. limite disponível.

Nunca usar `user_metadata` editável pelo usuário como fonte confiável de autorização.

Nunca expor `service_role` ou chave secreta no navegador.

### 9.1. Backend First para Operações Sensíveis

Frontend apenas apresenta, coleta e inicia. Backend valida e conclui.

Nenhuma identidade, tenant, papel, preço, assinatura ou pagamento enviado pelo navegador é confiável.

Operações sensíveis precisam de validação server-side, incluindo sessão, tenant, papel, módulo, permissão e entrada recebida.

RLS é defesa obrigatória adicional no banco, mesmo quando a operação passa pelo backend.

Segredos ficam exclusivamente no servidor. `service_role`, chaves secretas, webhooks e credenciais administrativas nunca chegam ao navegador.

---

## 10. Estado real do Supabase

### Projeto

- **Nome:** `maried-university`
- **Project ID:** `yotjgorlqybhsexwrryy`
- **Região:** `sa-east-1` - São Paulo
- **Banco:** PostgreSQL 17
- **Status verificado:** `ACTIVE_HEALTHY`
- **Organização:** `DomDiegoOrgs`

### Migração confirmada

Somente a migration `core_identity_and_tenants` está confirmada como aplicada.

Ela criou:

- extensão `pgcrypto`;
- enum `tenant_status`;
- enum `member_role`;
- tabela `profiles`;
- tabela `tenants`;
- tabela `tenant_members`;
- índice `tenant_members_user_idx`;
- função `is_tenant_member`;
- RLS inicial;
- políticas iniciais de perfil, empresa e vínculo.

### Políticas confirmadas

- `profiles_select_own`;
- `profiles_update_own`;
- `tenants_insert_authenticated`;
- `tenants_select_members`;
- `tenant_members_select_members`.

### Estado da SPEC-001

A fundacao tecnica da SPEC-001 foi concluida, validada localmente, commitada e enviada na branch de trabalho.

Entregas consolidadas:

- baseline local reproduzivel de `core_identity_and_tenants`;
- migration `core_identity_ownership_and_roles` preparada localmente;
- trigger de perfil automatico;
- owner automatico ao criar tenant;
- funcao `has_tenant_role`;
- politicas seguras para gestao de membros;
- teste SQL de isolamento entre dois usuarios e dois tenants;
- validacao local descartavel aprovada com dois ciclos de reset e teste.

Nenhuma migration da SPEC-001 deve ser aplicada no Supabase remoto sem autorizacao explicita.
---

## 11. Estado do reposit�rio

- **Repositório:** `jdGuedes/maried-university`
- **Branch principal:** `main`
- **Clone local esperado:** `C:\Projetos\maried-university`
- **Remoto:** `https://github.com/jdGuedes/maried-university.git`

Fluxo recomendado:

1. criar branch de trabalho;
2. implementar uma entrega específica;
3. executar validações;
4. revisar diff;
5. fazer commit;
6. enviar para GitHub;
7. abrir PR;
8. revisar antes do merge.

Sugestão de branch inicial:

```text
agent/initial-project-foundation
```

---

## 12. Núcleo compartilhado

O núcleo será dono de:

- autenticação;
- perfis;
- empresas;
- membros;
- papéis;
- permissões;
- catálogo de módulos;
- assinaturas;
- acesso aos módulos;
- produtos;
- categorias;
- fornecedores;
- galvânicas;
- arquivos;
- imagens;
- configurações;
- notificações;
- auditoria estrutural.

O produto deve existir uma única vez no núcleo e ser reutilizado pelos módulos.

---

## 13. Motores internos

Motores não são produtos vendidos. São componentes internos compartilhados.

Todo motor deve possuir:

- responsabilidade única;
- entradas claras;
- validações;
- saída padronizada;
- versionamento;
- testes unitários;
- documentação;
- independência da interface.

| Código | Motor | Responsabilidade |
|---|---|---|
| ENGINE-001 | Custos e Precificação | Peça bruta, tratamentos, fretes, perdas, taxas, margens e preço |
| ENGINE-002 | Perfis Comerciais | Pix, cartão, revendedora, atacado, marketplace e personalizados |
| ENGINE-003 | Assinaturas e Acesso | Trial, ativação, atraso, renovação, suspensão e cancelamento |
| ENGINE-004 | Permissões | Tenant, usuário, papel, módulo e ação permitida |
| ENGINE-005 | Auditoria | Autoria, alterações, valores anteriores/posteriores e motivo |
| ENGINE-006 | Etiquetas | Modelos, dimensões, QR Code, código de barras, PDF, A4 e térmica |
| ENGINE-007 | Lotes e Rateios | Rateio por peso, quantidade, manual, perdas e custo real |

### Ordem aprovada

1. Assinaturas e Acesso;
2. Permissões;
3. Custos e Precificação;
4. Perfis Comerciais;
5. Auditoria;
6. Etiquetas junto ao segundo módulo;
7. Lotes e Rateios junto ao módulo Produção e Banho.

Não criar cópias locais das fórmulas dentro dos módulos.

---

## 14. Fonte oficial dos dados

| Informação | Dono oficial |
|---|---|
| Usuário e sessão | Supabase Auth + Núcleo |
| Empresa e membros | Núcleo |
| Produto | Núcleo de Produtos |
| Cálculo de custo | ENGINE-001 |
| Perfil comercial | ENGINE-002 |
| Preço aprovado | Resultado aprovado do ENGINE-001 |
| Assinatura | Stripe + ENGINE-003 |
| Permissão | ENGINE-004 |
| Auditoria | ENGINE-005 |
| Etiqueta | ENGINE-006 |
| Lote e remessa | Produção e Banho + ENGINE-007 |
| Pagamento | Stripe sincronizado no banco |

Nunca manter múltiplas fontes concorrentes para a mesma informação.

---

## 15. Regras do Motor de Precificação

### 15.1. Conceitos

- **Custo técnico do banho:** soma dos tratamentos;
- **Custo base:** peça bruta + tratamentos;
- **Custo real:** custo base + fretes + embalagem + etiqueta + extras + perdas + rateios;
- **Preço técnico:** mínimo necessário para cobrir custos percentuais e margem;
- **Preço sugerido:** preço técnico após arredondamento comercial;
- **Preço aprovado:** valor escolhido e congelado pelo usuário.

### 15.2. Banho em ouro

Entradas:

- peso da peça em gramas;
- milésimos de ouro;
- milésimos de mão de obra;
- cotação da grama do ouro.

Fórmulas:

```text
valor_do_quilo =
(milesimos_ouro + milesimos_mao_de_obra) * cotacao_grama_ouro

valor_por_grama = valor_do_quilo / 1000

custo_ouro = valor_por_grama * peso_peca
```

Exemplo obrigatório de teste:

```text
ouro = 5 milésimos
mão de obra = 3 milésimos
cotação = R$ 600,00
peso = 1,20 g

valor do quilo = R$ 4.800,00
valor por grama = R$ 4,80
custo do ouro = R$ 5,76
```

### 15.3. Banho em prata

```text
valor_por_grama_prata = valor_kg_prata / 1000
custo_prata = valor_por_grama_prata * peso_peca
```

### 15.4. Verniz

Aplicável a cataforético, alemão, prime e outros.

```text
valor_por_grama_verniz = valor_kg_verniz / 1000
custo_verniz = valor_por_grama_verniz * peso_peca
```

### 15.5. Tratamentos cumulativos

A peça pode receber ouro, prata e verniz simultaneamente.

Cada tratamento:

- usa o peso-base da peça;
- é calculado separadamente;
- não altera o peso usado pelo tratamento seguinte;
- é somado aos demais tratamentos.

### 15.6. Histórico

Cada cálculo deve salvar snapshot dos parâmetros usados.

Mudanças futuras de cotação ou valor por quilograma não podem alterar cálculos antigos.

---

## 16. Custos adicionais

O motor deve admitir:

- frete de compra;
- frete de ida e retorno da galvânica;
- embalagem;
- cartela;
- expositor;
- etiqueta;
- tag;
- material de garantia;
- montagem;
- cravação;
- solda;
- tarraxa;
- outros serviços;
- reserva para perdas;
- cobrança mínima;
- rateios.

Métodos de rateio:

- por quantidade;
- por peso;
- manual.

---

## 17. Formação de preço

Fórmula de margem líquida:

```text
preco_venda =
custo_total / (1 - (margem + comissao + impostos + taxas))
```

Todos os percentuais devem ser convertidos corretamente para frações no cálculo.

Validação obrigatória:

> A soma de margem, comissão, impostos e taxas deve ser menor que 100%.

Quando for igual ou superior a 100%, bloquear o cálculo com mensagem explicativa.

O preço técnico não pode ser sobrescrito pelo arredondamento. O sistema deve guardar:

- preço técnico;
- regra de arredondamento;
- preço sugerido;
- preço aprovado.

---

## 18. Perfis comerciais

Perfis iniciais:

- Pix;
- cartão;
- revendedora;
- atacado;
- marketplace;
- personalizado.

Cada perfil pode definir:

- margem;
- comissão;
- imposto;
- taxa de pagamento;
- reserva;
- desconto máximo;
- arredondamento;
- quantidade mínima;
- pedido mínimo;
- prazo ou condição de pagamento.

Perfis podem ser duplicados e personalizados sem alterar silenciosamente os perfis já usados em cálculos históricos.

---

## 19. Lotes e remessas

### Entidades

- **Produto:** modelo permanente;
- **Lote de compra:** entrada específica com custo, peso, quantidade e fornecedor daquele momento;
- **Remessa:** agrupamento de lotes enviados para galvânica.

### Fluxo

1. selecionar produto;
2. registrar lote;
3. criar remessa;
4. adicionar itens;
5. aplicar tratamentos gerais ou individuais;
6. registrar custos compartilhados;
7. registrar retorno;
8. conferir quantidades;
9. classificar ocorrências;
10. ratear perdas e custos;
11. consolidar custo;
12. enviar resultado ao Precificador.

### Ocorrências

- perdida;
- faltante;
- quebrada;
- manchada;
- queimada;
- pedra solta;
- banho irregular;
- peso divergente;
- peça trocada;
- retrabalho;
- outra.

A remessa não pode ser finalizada quando as quantidades não fecharem.

---

## 20. Banco planejado

### Identidade

- `profiles`;
- `tenants`;
- `tenant_members`.

### Comercial SaaS

- `modules`;
- `plans`;
- `plan_modules`;
- `subscriptions`;
- `tenant_module_access`;
- `payments`.

### Núcleo

- `categories`;
- `products`;
- `product_images`;
- `suppliers`;
- `plating_suppliers`.

### Precificação

- `pricing_calculations`;
- `pricing_treatments`;
- `pricing_additional_costs`;
- `pricing_profiles`;
- `pricing_results`.

### Produção e banho

- `purchase_batches`;
- `purchase_batch_items`;
- `plating_shipments`;
- `plating_shipment_items`;
- `plating_item_treatments`;
- `plating_occurrences`.

### Auditoria

- `audit_logs`.

Essas estruturas são planejadas, exceto aquelas explicitamente confirmadas como implementadas na seção do Supabase.

---

## 21. Padrões obrigatórios de banco

- dinheiro: `numeric`/`decimal`, nunca `float`;
- pesos: `numeric` com ao menos 4 casas;
- percentuais: `numeric` com validação;
- IDs de negócio: UUID;
- datas: `timestamptz`;
- soft delete quando o histórico precisar ser preservado;
- `tenant_id` obrigatório em tabelas operacionais;
- RLS obrigatória em tabelas expostas;
- índices compostos por `tenant_id` e campos frequentes;
- migrations pequenas, versionadas e reversíveis quando viável;
- não duplicar migration já aplicada;
- não alterar migration aplicada em produção, criar nova migration corretiva.

---

## 22. Stripe

Estado atual:

- conta conectada;
- produtos da MARIED UNIVERSITY ainda não criados;
- Checkout planejado;
- Billing planejado;
- webhooks pendentes;
- portal do cliente planejado.

Antes de produção, validar:

- nome comercial exibido;
- dados empresariais;
- identidade da conta;
- descrições das cobranças.

Webhooks devem ser:

- assinados e verificados;
- idempotentes;
- registrados;
- resistentes a reenvio;
- incapazes de duplicar assinatura, acesso ou pagamento.

Nunca confiar no retorno do navegador como confirmação definitiva de pagamento.

---

## 23. Vercel

Estado atual:

- time conectado: `SrGuedes`;
- projeto `maried-university` ainda deve ser criado;
- deploy automático planejado via GitHub;
- ambientes Preview e Production planejados.

Não realizar deploy antes de:

- build passar;
- lint passar;
- testes passarem;
- variáveis estarem configuradas;
- RLS estar revisada;
- segredos estarem fora do código.

---

## 24. Estrutura inicial recomendada

```text
/
├── PROJECT.md
├── README.md
├── CHANGELOG.md
├── .env.example
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── pricing-engine/
│   ├── commercial-profile-engine/
│   ├── subscription-engine/
│   ├── permission-engine/
│   ├── audit-engine/
│   ├── label-engine/
│   ├── allocation-engine/
│   └── shared/
├── docs/
│   ├── 00-VISAO-GERAL/
│   ├── 01-ARQUITETURA/
│   ├── 02-BANCO-DE-DADOS/
│   ├── 03-MOTORES/
│   ├── 04-MODULOS/
│   ├── 05-REGRAS-DE-NEGOCIO/
│   ├── 06-INTEGRACOES/
│   ├── 07-PADROES-DE-DESENVOLVIMENTO/
│   ├── 08-ROADMAP/
│   ├── 09-ADR/
│   ├── 10-HISTORICO/
│   └── 11-IA-CODING-GUIDE/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   ├── policies/
│   └── seed/
├── tests/
└── scripts/
```

A estrutura pode ser refinada durante a fundação, mas mudanças relevantes exigem documentação e ADR.

---

## 25. Diretrizes para Codex

### Sempre

- ler `PROJECT.md`;
- consultar a SPEC da tarefa;
- usar TypeScript strict;
- manter regra de negócio fora de componente React;
- criar funções puras para motores;
- escrever testes para fórmulas;
- usar clientes Supabase separados para browser e servidor;
- criar cliente Supabase por requisição no SSR;
- usar migrations versionadas;
- proteger dados com RLS;
- atualizar documentação;
- apresentar resumo das mudanças;
- listar arquivos alterados;
- informar validações executadas.

### Nunca

- inventar requisito;
- implementar funcionalidade futura sem solicitação;
- duplicar fórmula;
- usar `float` para dinheiro;
- expor chave secreta;
- colocar `service_role` no cliente;
- confiar apenas em proteção visual;
- alterar cálculo histórico;
- criar tabela sem `tenant_id` quando operacional;
- criar migration duplicada;
- apagar dados históricos sem política;
- fazer deploy ou merge sem autorização;
- transformar o projeto em marketplace ou plataforma genérica.

### Ao detectar ambiguidade

Parar e registrar a dúvida antes de decidir sozinho quando ela afetar:

- regra financeira;
- fórmula;
- banco;
- RLS;
- assinatura;
- permissão;
- histórico;
- escopo comercial.

---

## 26. Testes mínimos

### Multitenancy

- usuário A vê apenas tenant A;
- usuário B não vê tenant A;
- alteração de URL ou UUID não permite acesso;
- operador não administra assinatura sem permissão;
- usuário removido perde acesso;
- criação de tenant adiciona owner corretamente.

### Precificação

- exemplo de ouro retorna R$ 5,76;
- prata usa kg / 1000 × peso;
- verniz usa kg / 1000 × peso;
- tratamentos combinados somam resultados;
- peso não é acumulado entre tratamentos;
- snapshot histórico é preservado;
- percentuais >= 100% são bloqueados;
- arredondamento não altera preço técnico.

### Assinaturas

- pagamento libera apenas módulos contratados;
- atraso aplica tolerância;
- cancelamento preserva dados;
- reativação recupera histórico;
- webhook repetido não duplica registros.

---

## 27. ADRs aprovados

- **ADR-001:** banco central multitenant;
- **ADR-002:** módulos vendidos separadamente;
- **ADR-003:** núcleo compartilhado;
- **ADR-004:** motores internos compartilhados;
- **ADR-005:** marketplace fora do escopo;
- **ADR-006:** monólito modular;
- **ADR-007:** Precificador como modulo funcional historicamente aprovado, agora posicionado apos a Fundacao Frontend pela SPEC-002;
- **ADR-008:** Produção e Banho separado;
- **ADR-009:** histórico congelado;
- **ADR-010:** Supabase + Stripe + Vercel + GitHub.
- **ADR-011:** Backend First para operações sensíveis.

---

## 28. Roadmap

### Fase 1: Fundacao tecnica e multitenancy

Status: concluida pela SPEC-001.

- perfil automatico;
- owner automatico;
- papeis;
- gestao de membros;
- RLS;
- testes de isolamento;
- validacao local descartavel.

### Fase 2: Fundacao Frontend, Auth, PWA e App Shell

Status: SPEC-002 v1.1 em implementacao; Entrega A concluida localmente e Entrega B e a proxima etapa.

Ordem oficial:

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

A Entrega A da SPEC-002 foi concluida localmente com fundacao frontend, tokens, assets, estrutura global e validacao E2E. A proxima tarefa e preparar a Entrega B da SPEC-002:

- Supabase browser/server;
- sessao server-side;
- protecao de rotas;
- resolucao segura de usuario, tenant e vinculo ativo;
- ausencia de segredos no browser.

### Fase 3: Modulos funcionais do MVP

Os modulos funcionais comecam somente apos a fundacao frontend estar implementada e validada:

- Precificacao Inteligente;
- Controle de Estoque;
- Fornecedores;
- Microcursos.

### Fase 4: Central Administrativa e SaaS comercial

- shell da Central Administrativa;
- usuarios;
- planos e assinaturas;
- controle de acesso;
- Stripe e webhooks somente com SPEC propria aprovada.

### Fase 5: Piloto

- Vercel;
- dominio;
- observabilidade;
- usuarios piloto;
- ajustes com uso real.

---

## 29. Ponto oficial de retomada

A proxima tarefa e implementar a Entrega B da SPEC-002 aprovada:

```text
SPEC-002 | Entrega B | Supabase browser/server, sessao e acesso
```

A ordem oficial de continuidade e:

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

Nao iniciar Precificacao Inteligente, Controle de Estoque, Fornecedores, Microcursos, Stripe, OAuth, Vercel ou deploy antes de concluir e validar a fundacao definida pela SPEC-002.
---

## 30. Definition of Done

Uma tarefa só está concluída quando:

- objetivo foi atendido;
- regras foram respeitadas;
- banco está coerente;
- RLS foi considerada;
- testes relevantes passaram;
- lint e build passaram quando aplicável;
- nenhum segredo foi incluído;
- documentação foi atualizada;
- diff foi revisado;
- pendências foram registradas;
- nenhuma funcionalidade extra foi introduzida silenciosamente.

---

## 31. Regra final

A prioridade é entregar um MVP simples, confiável e seguro.

Não construir uma catedral de código para resolver um anel de borboleta. A arquitetura deve ser sólida, mas o produto precisa continuar leve para o iniciante e sustentável para uma equipe pequena.
