# SPEC-003 | Precificador Inteligente

**Status:** APROVADA PARA IMPLEMENTACAO

## 1. Identificacao

| Campo | Valor |
|---|---|
| Codigo | SPEC-003 |
| Titulo | Precificador Inteligente |
| Versao | 1.0 |
| Status | APROVADA PARA IMPLEMENTACAO |
| Data | 2026-08-01 |
| Responsavel de produto | Product Owner da MARIED UNIVERSITY |
| Branch de trabalho | `agent/initial-project-foundation` |
| Commit base | `d70e056 docs(spec-003): define intelligent pricing module` |
| Dependencias | SPEC-001 concluida; SPEC-002 concluida com ressalvas |
| Escopo desta SPEC | Especificacao documental aprovada do modulo, sem implementacao |

Referencias obrigatorias:

- `PROJECT.md`
- `SECURITY_POLICY.md`
- `CODEX_EXECUTION_PROTOCOL.md`
- `FRONTEND_DESIGN_SYSTEM.md`
- `MVP_INITIAL_SCOPE_UPDATED.md`
- `docs/PROJECT_STATE.md`
- `docs/03-MOTORES/ENGINE-001-MOTOR-DE-PRECIFICACAO.md`
- `docs/02-BANCO-DE-DADOS/ESTADO-ATUAL.md`
- ADR-001 a ADR-006 e ADR-011
- SPEC-001
- SPEC-002 v1.1
- `references/README.md`
- REF-11 `references/v1/11_perfis_categorias.png`
- REF-12 `references/v1/12_calculadora_fluxo.png`
- REF-14 `references/v1/14_fluxo_geral.png`
- REF-15 `references/v1/15_brand_kit.jpeg`

## 2. Resumo executivo

O Precificador Inteligente ajuda a empreendedora de semijoias, folheados e acessorios a calcular o preco correto de venda de uma peca considerando custos, perdas, taxas, comissoes, impostos e lucro desejado.

A experiencia deve ser simples na interface e robusta nos calculos. A usuaria nao deve precisar conhecer formulas complexas. O sistema deve responder, com seguranca e rastreabilidade:

- quanto a peca realmente custa;
- quanto vender no Pix;
- quanto vender no cartao;
- quanto vender para revendedora;
- quanto vender no atacado;
- quanto vender em marketplace;
- quanto cobrar para obter lucro liquido fixo;
- qual margem real sera obtida;
- quais taxas reduzem o lucro.

Esta SPEC publica o contrato aprovado para implementacao futura da Entrega A. Ela nao implementa funcionalidade, nao cria migrations, nao altera banco, nao autoriza Stripe, OAuth, deploy ou Supabase remoto.

## 3. Filosofia operacional

O modulo deve parecer uma calculadora guiada, nao uma planilha. A usuaria informa dados conhecidos, escolhe um modo de ganho e compara resultados por perfil comercial.

O frontend pode coletar entradas e mostrar uma previa de simulacao, mas o resultado oficial salvo deve ser calculado no backend, com validacao server-side, tenant resolvido no servidor e RLS como defesa obrigatoria.

Todo calculo salvo deve preservar snapshot dos parametros usados. Mudancas futuras de perfil, taxa, margem, categoria, frete, impostos ou configuracao nao podem alterar silenciosamente calculos antigos.

## 4. Problema resolvido

- precificacao por intuicao;
- esquecimento de custos indiretos;
- confusao entre markup, margem e lucro;
- venda abaixo do custo real;
- falta de visao do impacto de taxa, comissao e imposto;
- perda de historico de como um preco foi formado;
- dificuldade de comparar canais comerciais;
- divergencia futura entre precificacao, estoque e etiquetas.

## 5. Beneficios

| Beneficio | Evidencia esperada |
|---|---|
| Preco mais seguro | Testes matematicos cobrindo custos, taxas e margens |
| Simplicidade para iniciante | Fluxo guiado, mensagens claras e componentes do App Shell |
| Comparacao por canal | Resultados separados por perfil comercial |
| Historico confiavel | Snapshot imutavel dos parametros e resultados |
| Base para estoque | Contrato futuro sem acoplamento mutavel |
| Seguranca multitenant | RLS e validacao server-side por tenant |

## 6. Personas

| Persona | Necessidade |
|---|---|
| Empreendedora iniciante | Descobrir preco de venda sem entender formulas complexas |
| Revendedora organizada | Comparar preco por Pix, cartao e revenda |
| Pequeno fabricante | Considerar perdas, frete, embalagem e custos comerciais |
| Gestora do tenant | Configurar perfis comerciais e acompanhar historico |
| Operadora | Criar simulacoes e consultar resultados permitidos |

## 7. Escopo incluido

- historico/listagem de precificacoes;
- novo calculo;
- identificacao da peca;
- custos diretos;
- perdas por valor fixo ou percentual;
- custos comerciais fixos e percentuais;
- tres modos oficiais de ganho;
- perfis comerciais oficiais;
- preco tecnico, sugerido e aprovado;
- arredondamento comercial;
- resultados por perfil;
- snapshot e versionamento;
- modelo de dados proposto;
- RLS e seguranca propostas;
- contratos futuros com estoque;
- testes matematicos, unitarios, integracao, E2E e seguranca;
- criterios de aceite;
- plano de implementacao futuro.

## 8. Fora do escopo

Ficam fora do MVP desta SPEC:

- impressao;
- PDF;
- Excel;
- exportacao;
- WhatsApp;
- etiquetas;
- atualizacao em lote;
- relatorio avancado;
- IA;
- integracao fiscal;
- emissao de nota;
- sincronizacao offline;
- Stripe;
- cobranca;
- marketplace funcional;
- estoque funcional;
- producao;
- banho;
- lotes;
- deploy;
- migration nesta meta documental.

## 9. Regras de negocio

### 9.1. Identificacao

Campos iniciais:

| Campo | Obrigatorio | Regra |
|---|---|---|
| nome da peca | Sim | Texto entre 2 e 120 caracteres |
| categoria | Nao | Referencia futura ou texto controlado enquanto categoria nao existir |
| observacoes | Nao | Texto limitado; nao deve aceitar HTML |
| produto vinculado | Nao | Futuro; somente quando produto existir |
| imagem | Nao | Pendente de aprovacao; nao implementar no MVP inicial |
| criado em | Sim | `timestamptz`, gerado no servidor |
| atualizado em | Sim | `timestamptz`, gerado no servidor |
| usuario responsavel | Sim | `auth.uid()` validado no servidor |
| tenant responsavel | Sim | Resolvido no servidor, nunca confiado do cliente |

### 9.2. Custos diretos

Campos obrigatorios na SPEC:

| Campo | Tipo | Minimo | Zero permitido | Origem |
|---|---|---|---|---|
| custo da peca | Dinheiro | 0 | Sim | Manual ou produto futuro |
| embalagem | Dinheiro | 0 | Sim | Manual |
| tag ou etiqueta | Dinheiro | 0 | Sim | Manual |
| frete | Dinheiro | 0 | Sim | Manual/rateio futuro |
| outros custos | Dinheiro | 0 | Sim | Manual detalhado |

Formato: BRL, exibicao em `R$ 0,00`, armazenamento como `numeric`, nunca `float`.

Validacoes:

- valor vazio em campo obrigatorio: `Este campo e obrigatorio.`
- valor negativo: `Informe um valor maior ou igual a zero.`
- valor monetario invalido: `Verifique o valor informado.`
- casas decimais acima do permitido: arredondar somente na camada aprovada e registrar regra.

### 9.3. Custo Base e Custo Total

`Custo Base` e a soma dos custos essenciais da peca antes de perdas comerciais:

```text
custo_peca
+embalagem
+tag_ou_etiqueta
+frete
+outros_custos
=custo_base
```

`Custo Total` e o custo base acrescido de perdas fixas ou percentuais e demais ajustes de custo aprovados:

```text
custo_base
+perda_calculada
=custo_total
```

No MVP, custos comerciais percentuais nao integram `custo_total`; eles entram na formacao do preco porque variam conforme o preco de venda.

### 9.4. Frete

Opcoes avaliadas:

- frete direto da peca;
- rateio por quantidade;
- rateio por valor;
- valor fixo manual.

Regra MVP aprovada:

- sem frete;
- frete informado diretamente por peca;
- frete total rateado pela quantidade de pecas.

Formula do rateio:

```text
frete_unitario = frete_total / quantidade_de_pecas
```

Validacoes obrigatorias:

- frete nao pode ser negativo;
- quantidade deve ser maior que zero quando houver rateio;
- divisao por zero deve ser bloqueada;
- o sistema deve informar o frete unitario calculado;
- rateio por valor financeiro fica fora do MVP.

### 9.5. Perdas

Tipos permitidos:

- valor fixo;
- percentual.

Regra MVP vinda do MVP atualizado: somente um tipo ativo por calculo.

Validacoes:

- valor fixo nao pode ser negativo;
- percentual deve estar entre 0 e 100;
- percentual igual a 100 e permitido apenas se a regra de negocio confirmar a base e o impacto; por seguranca, a implementacao futura deve bloquear percentual de perda que torne o custo inconsistente;
- mensagens devem explicar o campo, nao a formula interna.

Base aprovada da perda percentual:

```text
base_perda = custo_peca + embalagem + tag_ou_etiqueta + frete_unitario + outros_custos
perda_calculada = base_perda * percentual_perda
```

A perda percentual incide sobre os custos diretos da unidade. Ela nao incide sobre o preco de venda e nao incide novamente sobre ela mesma.

### 9.6. Custos comerciais

Suportar:

- comissao percentual;
- impostos percentuais;
- taxa percentual;
- taxa fixa;
- encargos de marketplace;
- desconto comercial;
- outros encargos.

Diferenciar:

- custos fixos: somados ao numerador;
- custos percentuais: compoem o denominador;
- custos por perfil: configurados em Pix, Cartao, Revendedora, Atacado, Marketplace ou Personalizado;
- custos globais: aplicados a todos os perfis de uma precificacao, quando aprovados.

Nao inventar taxas padrao. Todos os valores devem ser informados pela usuaria, herdados de perfis configurados ou definidos por regra aprovada em SPEC futura.

## 10. Formulas

### 10.1. Variaveis

```text
CB = custo_base
P = perda_calculada
CT = custo_total
LF = lucro_fixo_desejado
TF = taxas_fixas_aplicaveis
TP = percentual_total_aplicavel
A = acrescimo_sobre_custo
ML = margem_liquida_desejada
PV = preco_venda
LT = lucro_liquido
```

Percentuais devem ser convertidos para fracao decimal antes do calculo:

```text
30% = 0.30
```

### 10.2. Custo base

```text
CB = custo_peca + embalagem + tag_ou_etiqueta + frete + outros_custos
```

### 10.3. Perda fixa

```text
P = perda_fixa
CT = CB + P
```

### 10.4. Perda percentual

A base aprovada da perda percentual e o conjunto de custos diretos da unidade.

```text
base_perda = custo_peca + embalagem + tag_ou_etiqueta + frete_unitario + outros_custos
P = base_perda * percentual_perda
CT = CB + P
```

A perda nao incide sobre o preco de venda e nao incide recursivamente sobre ela mesma.

### 10.5. Percentual total aplicavel

```text
TP = comissao + impostos + taxa_percentual + encargos_percentuais + desconto_percentual
```

Validacao critica:

```text
TP < 1
```

Mensagem:

```text
A soma das taxas percentuais deve ser menor que 100%.
```

### 10.6. Modo 1: lucro fixo desejado

Objetivo: garantir lucro liquido fixo depois dos custos e percentuais.

```text
PV = (CT + LF + TF) / (1 - TP)
```

Lucro liquido real:

```text
LT = PV - CT - TF - (PV * TP)
```

### 10.7. Modo 2: acrescimo sobre custo

Este modo aplica um acrescimo sobre o custo total. A SPEC diferencia:

- acrescimo: percentual aplicado sobre custo;
- markup: multiplicador entre custo e preco;
- margem: lucro como percentual do preco de venda.

Formula base:

```text
preco_alvo = CT * (1 + A)
```

O acrescimo define o preco tecnico inicial por custo. Depois, o motor deve calcular lucro e margem reais considerando taxas fixas, taxas percentuais, comissao e impostos. Este modo nao transforma acrescimo em margem liquida garantida.

Lucro liquido real:

```text
LT = PV - CT - TF - (PV * TP)
```

### 10.8. Modo 3: margem liquida desejada

Objetivo: lucro liquido representar percentual do preco de venda.

```text
PV = (CT + TF) / (1 - (ML + TP))
```

Validacao critica:

```text
ML + TP < 1
```

Lucro liquido real:

```text
LT = PV - CT - TF - (PV * TP)
```

Margem liquida real:

```text
margem_liquida_real = LT / PV
```

### 10.9. Preco de equilibrio e minimo recomendado

Preco de equilibrio e o menor preco que cobre todos os custos fixos e percentuais, sem lucro.

```text
preco_equilibrio = (CT + TF) / (1 - TP)
```

Validacoes:

- `TP >= 1` bloqueia o calculo;
- preco aprovado abaixo do equilibrio e bloqueado;
- preco aprovado igual ao equilibrio e permitido apenas como lucro zero, com alerta;
- preco aprovado acima do equilibrio e abaixo da meta desejada e permitido com alerta e confirmacao;
- preco que atende ou supera a meta e permitido normalmente;
- aprovacao manual nunca pode permitir prejuizo calculado.

Preco minimo recomendado e o preco que cobre custos e atende ao lucro ou margem minima definida.

Para lucro fixo desejado:

```text
preco_minimo_recomendado = (CT + TF + LF) / (1 - TP)
```

Para margem liquida desejada:

```text
preco_minimo_recomendado = (CT + TF) / (1 - TP - ML)
```

Quando `TP + ML >= 1`, o denominador e invalido e o calculo deve ser bloqueado.
### 10.10. Formula correta do ganho

E proibido usar:

```text
Valor de quanto vou ganhar = Valor de custo - Valor de venda
```

Formula correta:

```text
Lucro = preco_de_venda - custos - taxas - comissao - impostos
```

A formulacao antiga deve ser tratada como historico de decisao corrigida, nao como regra valida.

## 11. Ordem dos calculos

1. Coletar custos diretos.
2. Calcular frete unitario.
3. Calcular custo base.
4. Calcular perda.
5. Calcular custos fixos aplicaveis.
6. Carregar perfil comercial.
7. Somar percentuais aplicaveis.
8. Validar denominador.
9. Calcular preco tecnico.
10. Aplicar arredondamento.
11. Calcular preco sugerido.
12. Permitir preco aprovado.
13. Recalcular lucro real.
14. Recalcular margem real.
15. Validar preco de equilibrio.
16. Emitir alertas.
17. Criar snapshot.
18. Salvar historico.

## 12. Modos de precificacao

| Modo | Entrada obrigatoria | Formula principal | Bloqueio |
|---|---|---|---|
| Lucro fixo desejado | valor de lucro > 0 | `(CT + LF + TF) / (1 - TP)` | `TP >= 1` |
| Acrescimo sobre custo | percentual > 0 | `CT * (1 + A)` | preco final abaixo do equilibrio |
| Margem liquida desejada | percentual > 0 | `(CT + TF) / (1 - (ML + TP))` | `ML + TP >= 1` |

## 13. Perfis comerciais

Perfis oficiais:

- Pix;
- Cartao;
- Revendedora;
- Atacado;
- Marketplace;
- Personalizado.

Campos por perfil:

| Campo | Regra |
|---|---|
| nome | Obrigatorio |
| finalidade | Texto curto |
| taxa percentual | `numeric`, 0 a menor que 100 |
| taxa fixa | dinheiro, minimo 0 |
| comissao | percentual, minimo 0 |
| desconto | percentual, minimo 0 |
| imposto | percentual, minimo 0 |
| lucro desejado | opcional conforme modo |
| margem desejada | opcional conforme modo |
| preco minimo recomendado | calculado por meta de lucro ou margem |
| arredondamento | regra configuravel |
| estado ativo | boolean |
| ordem de exibicao | inteiro positivo |

Nao existem taxas padrao universais aprovadas nesta SPEC. Taxas, impostos e comissoes devem ser configuraveis por tenant e por perfil comercial, editaveis apenas por usuarios autorizados e preservadas no snapshot. A implementacao nao deve inventar valores padrao.

## 14. Arredondamento

Opcoes possiveis:

- valor exato;
- final `,90`;
- final `,99`;
- arredondamento para cima;
- personalizado, quando aprovado.

Regra:

1. calcular preco tecnico;
2. aplicar arredondamento para preco sugerido;
3. recalcular lucro e margem com o preco sugerido;
4. alertar se o arredondamento reduzir lucro/margem abaixo do desejado;
5. nunca sobrescrever o preco tecnico.

## 15. Resultados

Para cada perfil comercial, exibir:

- custo base;
- custo total;
- preco tecnico;
- preco sugerido;
- preco aprovado;
- lucro bruto, quando definido como preco menos custo total antes de taxas;
- lucro liquido;
- margem liquida;
- taxas consideradas;
- comissao;
- impostos;
- perdas;
- diferenca entre preco e custo;
- alerta de preco insuficiente.

Terminologia:

- `preco tecnico`: resultado matematico exato;
- `preco sugerido`: resultado apos arredondamento comercial;
- `preco aprovado`: preco escolhido e salvo pela usuaria;
- `lucro liquido`: preco de venda menos custo total, taxas fixas, percentuais, comissao e impostos.

## 16. Historico

Cada precificacao salva deve preservar:

- custos;
- perdas;
- taxas;
- comissao;
- impostos;
- modo de calculo;
- perfil;
- lucro desejado;
- margem desejada;
- preco tecnico;
- preco sugerido;
- preco aprovado;
- arredondamento;
- data;
- usuario;
- tenant.

Alteracoes futuras devem criar nova versao ou novo snapshot. Registros antigos nao podem ser reprocessados silenciosamente.

Regras:

- editar calculo atual cria nova versao;
- recalcular registra nova versao;
- duplicar cria novo registro com novo UUID, referencia opcional ao registro de origem, parametros copiados, status `RASCUNHO`, novo salvamento obrigatorio, usuario e tenant registrados, original preservado;
- inativar preserva historico;
- rascunho nunca aprovado e sem historico relacionado pode ser excluido;
- calculo com historico relevante deve ser inativado;
- precificacao aprovada nunca deve ser excluida fisicamente;
- versoes e snapshots devem ser preservados.

## 17. Fluxos

Fluxo principal:

```text
Nova Precificacao
-> Identificacao
-> Custos
-> Perdas
-> Custos comerciais
-> Escolha do modo
-> Configuracao dos perfis
-> Calculo
-> Comparacao
-> Ajuste de arredondamento
-> Aprovacao
-> Salvamento
-> Historico
```

Escolha de UX proposta: fluxo por etapas dentro de pagina dedicada, com resumo fixo/adaptado. Justificativa: evita formulario longo, conversa bem com REF-12 e respeita mobile.

Nao usar modal sobre modal. Modais ficam reservados para confirmacoes curtas.

## 18. Rotas

Rotas propostas para implementacao futura:

| Rota | Finalidade | Acesso |
|---|---|---|
| `/precificacao` | Historico/listagem | Autenticada e modulo liberado |
| `/precificacao/nova` | Novo calculo | Criar precificacao |
| `/precificacao/[id]` | Detalhes | Ver registro do tenant |
| `/precificacao/[id]/editar` | Editar criando nova versao | Papel permitido |
| `/precificacao/perfis` | Perfis comerciais | `owner` e `admin` |
| `/precificacao/categorias` | Categorias de pecas | Futuro/pendente de SPEC propria |

URL direta deve revalidar sessao, tenant, vinculo, papel, modulo e RLS.

## 19. Componentes

Componentes propostos, sem implementacao nesta SPEC:

| Componente | Responsabilidade |
|---|---|
| `PricingForm` | Orquestrar etapas e estado do calculo |
| `CostField` | Campo de custo com label, ajuda e erro |
| `MoneyField` | Entrada monetaria segura |
| `PercentageField` | Entrada percentual com limites |
| `PricingModeSelector` | Escolha entre os tres modos |
| `CommercialProfileCard` | Configurar/ativar perfil |
| `PricingResultCard` | Resultado por perfil no mobile |
| `ProfitSummary` | Resumo de custo, lucro e margem |
| `MarginIndicator` | Indicador visual de margem |
| `PriceWarning` | Alertas de preco insuficiente |
| `RoundingSelector` | Escolha de arredondamento |
| `PricingHistoryTable` | Listagem desktop |
| `PricingFilters` | Busca e filtros essenciais |
| `CalculationBreakdown` | Detalhamento matematico |

Reutilizar componentes-base existentes: `Button`, `Input`, `Field`, `FormMessage`, `Panel`, `StatusBadge`, `Alert`, `EmptyState`, `PageHeader`, App Shell e tokens oficiais.

## 20. Modelo de dados

Nao criar migration nesta meta. Modelo proposto para implementacao futura:

### 20.1. `commercial_profiles`

Perfis comerciais configuraveis por tenant.

Campos:

- `id uuid primary key`
- `tenant_id uuid not null`
- `name text not null`
- `description text`
- `profile_key text`
- `tax_percent numeric(7,4) not null default 0`
- `fixed_fee numeric(12,2) not null default 0`
- `commission_percent numeric(7,4) not null default 0`
- `discount_percent numeric(7,4) not null default 0`
- `taxes_percent numeric(7,4) not null default 0`
- `default_rounding text not null`
- `is_active boolean not null default true`
- `display_order integer not null default 0`
- `created_by uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `deleted_at timestamptz`

Constraints:

- `tenant_id` FK `tenants(id)`;
- percentuais entre 0 e menor que 100;
- dinheiro maior ou igual a zero;
- unico por `tenant_id, name` para registros ativos.

### 20.2. `pricing_calculations`

Registro principal da precificacao.

Campos:

- `id uuid primary key`
- `tenant_id uuid not null`
- `product_id uuid null`
- `category_id uuid null`
- `piece_name text not null`
- `notes text`
- `status text not null` (`RASCUNHO`, `CALCULADA`, `APROVADA`, `INATIVA`)
- `current_version_id uuid null`
- `source_pricing_calculation_id uuid null`
- `approved_by uuid null`
- `approved_at timestamptz null`
- `inactivated_at timestamptz null`
- `created_by uuid not null`
- `updated_by uuid`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `deleted_at timestamptz`

### 20.3. `pricing_versions`

Snapshot versionado dos parametros globais.

Campos:

- `id uuid primary key`
- `tenant_id uuid not null`
- `pricing_calculation_id uuid not null`
- `version_number integer not null`
- `pricing_mode text not null`
- `piece_cost numeric(12,2) not null`
- `packaging_cost numeric(12,2) not null`
- `tag_cost numeric(12,2) not null`
- `freight_mode text not null`
- `freight_total numeric(12,2)`
- `freight_quantity numeric(12,4)`
- `freight_unit numeric(12,2) not null`
- `other_costs numeric(12,2) not null`
- `cost_base numeric(12,2) not null`
- `loss_type text not null`
- `loss_value numeric(12,4) not null`
- `loss_amount numeric(12,2) not null`
- `cost_total numeric(12,2) not null`
- `fixed_costs_total numeric(12,2) not null`
- `percent_fees_total numeric(7,4) not null`
- `break_even_price numeric(12,2) not null`
- `minimum_recommended_price numeric(12,2)`
- `technical_price numeric(12,2) not null`
- `suggested_price numeric(12,2) not null`
- `approved_price numeric(12,2)`
- `net_profit numeric(12,2) not null`
- `net_margin_percent numeric(7,4) not null`
- `profile_id uuid null`
- `profile_snapshot jsonb not null`
- `cost_snapshot jsonb not null`
- `desired_fixed_profit numeric(12,2)`
- `desired_markup_percent numeric(7,4)`
- `desired_net_margin_percent numeric(7,4)`
- `rounding_rule text not null`
- `snapshot jsonb not null`
- `created_by uuid not null`
- `created_at timestamptz not null`

### 20.4. `pricing_profile_results`

Resultado por perfil comercial e versao.

Campos:

- `id uuid primary key`
- `tenant_id uuid not null`
- `pricing_version_id uuid not null`
- `commercial_profile_id uuid null`
- `profile_name text not null`
- `profile_snapshot jsonb not null`
- `technical_price numeric(12,2) not null`
- `suggested_price numeric(12,2) not null`
- `approved_price numeric(12,2)`
- `gross_profit numeric(12,2)`
- `net_profit numeric(12,2) not null`
- `net_margin_percent numeric(7,4) not null`
- `fixed_fees_total numeric(12,2) not null`
- `percent_fees_total numeric(7,4) not null`
- `warnings jsonb not null default '[]'::jsonb`
- `created_at timestamptz not null`

### 20.5. `tenant_pricing_settings`

Configuracoes opcionais por tenant.

Campos:

- `tenant_id uuid primary key`
- `default_rounding_rule text not null`
- `default_currency text not null default 'BRL'`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### 20.6. Indices previstos

- `pricing_calculations(tenant_id, updated_at desc)`
- `pricing_calculations(tenant_id, status)`
- `pricing_calculations(tenant_id, piece_name)`
- `pricing_versions(tenant_id, pricing_calculation_id, version_number desc)`
- `pricing_profile_results(tenant_id, pricing_version_id)`
- `commercial_profiles(tenant_id, is_active, display_order)`

## 21. RLS

Todas as tabelas operacionais devem possuir `tenant_id` e RLS habilitada.

Politicas propostas:

- membros ativos podem selecionar precificacoes do proprio tenant;
- `owner`, `admin`, `manager` e `operator` podem criar calculos, se o modulo estiver liberado;
- `viewer` pode apenas consultar, se regra de produto confirmar;
- edicao cria nova versao, nunca altera snapshot historico;
- inativacao permitida apenas a papeis aprovados;
- configuracao de perfis comerciais exige papel `owner` ou `admin`.

RLS nao deve depender apenas de `authenticated`. Funcoes auxiliares devem evitar recursao, ter `search_path` explicito, grants minimos e justificativa se usarem `SECURITY DEFINER`.

## 22. Seguranca

Regras obrigatorias:

- tenant sempre resolvido no servidor;
- `tenant_id` enviado pelo cliente e ignorado como autoridade;
- valores financeiros enviados pelo frontend sao entrada, nao verdade;
- calculo oficial no backend;
- validacao server-side de tipos, faixas, enums e referencias;
- bloquear denominador zero ou negativo;
- bloquear preco negativo;
- bloquear percentuais invalidos;
- limitar payload e tamanho de textos;
- logs sem valores sensiveis desnecessarios;
- snapshots nao devem conter segredos;
- auditoria para criar, editar, aprovar, inativar e alterar perfis.

## 23. Permissoes

Usar papeis existentes confirmados em `public.member_role`: `owner`, `admin`, `manager`, `operator`, `viewer`. Nao criar novo papel.

OWNER (`owner`) e ADMIN (`admin`) podem criar, editar, ativar e inativar perfis comerciais, alem de criar, calcular, aprovar e inativar precificacoes no MVP. Demais papeis ficam condicionados a autorizacao futura e policies especificas; nao ha acesso novo por suposicao.

| Acao | Papeis propostos | Status |
|---|---|---|
| criar precificacao | owner, admin | Aprovado para MVP inicial; demais papeis pendentes |
| visualizar | owner, admin; demais papeis conforme autorizacao futura | Aprovado parcialmente |
| editar/recalcular | owner, admin | Aprovado para MVP inicial; demais papeis pendentes |
| aprovar preco | owner, admin | Aprovado para MVP |
| inativar | owner, admin | Aprovado para MVP |
| consultar historico | owner, admin; demais papeis conforme autorizacao futura | Aprovado parcialmente |
| alterar perfis comerciais | owner, admin | Aprovado para MVP |
| alterar configuracoes do tenant | owner | Futuro/pendente |

## 24. Backend First

O frontend pode:

- coletar dados;
- validar formato para melhor UX;
- mostrar previa claramente marcada como simulacao;
- iniciar salvamento;
- exibir resultados retornados pelo backend.

O backend deve:

- validar sessao;
- validar tenant;
- validar vinculo ativo;
- validar papel;
- validar modulo liberado;
- validar entradas;
- calcular resultado oficial;
- persistir snapshot;
- registrar auditoria;
- retornar somente dados necessarios.

## 25. Contratos

Contratos futuros:

- `PricingInput`: entradas normalizadas e validadas.
- `PricingMode`: `FIXED_PROFIT`, `COST_MARKUP`, `NET_MARGIN`.
- `CommercialProfileInput`: taxas e configuracoes do perfil.
- `PricingResult`: preco tecnico, sugerido, aprovado, lucro, margem e alertas.
- `PricingSnapshot`: parametros usados no calculo salvo.
- `PricingStatus`: `RASCUNHO`, `CALCULADA`, `APROVADA`, `INATIVA`.
- `source_pricing_calculation_id`: referencia opcional quando o registro for duplicado.
- `CommercialProfileSnapshot`: perfil comercial congelado no momento do calculo.
- `CostSnapshot`: custos diretos, frete, perdas e ajustes congelados no momento do calculo.

Todos os contratos devem ser tipados e testados. Regra de negocio nao deve ficar dentro de componente React.

## 26. Responsividade

Viewports obrigatorios:

- 360 px;
- 390 px;
- 768 px;
- 1024 px;
- 1366 px;
- 1440 px.

Mobile:

- priorizar entrada de custos;
- usar teclado numerico para moeda/percentual;
- evitar tabelas largas;
- exibir resultados em cards comparaveis;
- manter CTA principal visivel;
- evitar rolagem horizontal.

Desktop:

- permitir comparacao entre perfis;
- formulario e resultados lado a lado quando houver espaco;
- tabela para historico;
- preservar densidade sem virar painel pesado.

## 27. Acessibilidade

Obrigatorio:

- labels visiveis;
- mensagens associadas aos campos;
- foco visivel;
- navegacao por teclado;
- estados nao dependentes apenas de cor;
- `aria-live` para resultado recalculado;
- texto claro para alertas de preco insuficiente;
- areas de toque minimas de 44 px;
- reduced motion respeitado;
- sem modal sobre modal.

## 28. Mensagens

| Cenario | Mensagem |
|---|---|
| campo obrigatorio | `Este campo e obrigatorio.` |
| valor invalido | `Verifique o valor informado.` |
| percentual invalido | `Informe um percentual valido.` |
| preco abaixo do custo | `O preco informado nao cobre o custo total.` |
| preco abaixo do minimo | `O preco esta abaixo do minimo definido para este perfil.` |
| margem impossivel | `A margem desejada nao e possivel com as taxas informadas.` |
| denominador invalido | `A soma das taxas percentuais deve ser menor que 100%.` |
| calculo concluido | `Calculo concluido.` |
| salvamento concluido | `Precificacao salva com historico preservado.` |
| falha ao salvar | `Nao foi possivel salvar a precificacao. Tente novamente.` |
| registro atualizado | `Nova versao da precificacao criada.` |
| historico preservado | `O historico anterior foi preservado.` |
| perfil sem configuracao | `Configure este perfil para calcular o preco.` |

## 29. Estados

Estados de formulario:

- `IDLE`
- `DIRTY`
- `VALID`
- `INVALID`
- `SUBMITTING`
- `SUBMITTED`
- `ERROR`
- `DISABLED`
- `READONLY`

Estados de modulo:

- `COMING_SOON` antes da implementacao;
- `AVAILABLE` somente apos entrega funcional aprovada;
- `LOCKED`, `DISABLED` e `MAINTENANCE` conforme contrato da SPEC-002.

Estados de registro:

- `RASCUNHO`: incompleta ou ainda nao oficial;
- `CALCULADA`: calculo concluido, ainda nao aprovado;
- `APROVADA`: preco aprovado por usuario autorizado, com snapshot completo;
- `INATIVA`: registro preservado historicamente, sem uso como preco atual.

## 30. Testes matematicos

Matriz minima:

| Cenario | Entrada | Formula | Resultado esperado | Tolerancia | Comportamento proibido |
|---|---|---|---|---|---|
| custo simples | custo 10, demais 0 | `CB=10` | `CT=10` | 0 centavo | usar float |
| multiplos custos | 10+2+1+3+4 | soma | `CT=20` | 0 centavo | ignorar custo |
| perda fixa | CB 20, perda 5 | `CT=25` | 25 | 0 centavo | perda negativa |
| perda percentual | custos diretos 20, perda 10% | `P=20*0.10` | `P=2`, `CT=22` | 1 centavo | aplicar sobre preco de venda ou sobre a propria perda |
| taxa fixa | CT 20, LF 10, TF 2 | `(20+10+2)` | 32 sem TP | 0 centavo | subtrair taxa fixa |
| taxa percentual | CT 20, LF 10, TP 10% | `30/0.9` | 33,33 | 1 centavo | denominador errado |
| comissao | TP inclui comissao | `TP=sum` | conforme entradas | 1 centavo | comissao fora do TP |
| imposto | TP inclui imposto | `TP=sum` | conforme entradas | 1 centavo | imposto ignorado |
| lucro fixo | CT 50, LF 20, TP 0 | `70` | 70 | 0 centavo | lucro=custo-venda |
| acrescimo | CT 50, A 100% | `100` | 100 | 0 centavo | tratar como margem |
| margem liquida | CT 70, ML 30%, TP 0 | `70/0.7` | 100 | 1 centavo | markup como margem |
| varios perfis | Pix/Cartao com TP diferente | por perfil | precos diferentes | 1 centavo | reutilizar taxa errada |
| arredondamento ,99 | tecnico 32,41 | regra ,99 | 32,99 | 0 centavo | alterar tecnico |
| centavos | valores 0,01 | decimal | preciso | 1 centavo | drift binario |
| zero | custo 0 permitido | formulas | preco conforme lucro | 0 centavo | bloquear zero permitido |
| negativo | custo -1 | validacao | erro | N/A | calcular negativo |
| percentual 100% | TP 100% | bloqueio | erro | N/A | dividir por zero |
| percentual >100% | TP 120% | bloqueio | erro | N/A | preco negativo |
| preco manual abaixo equilibrio | aprovado menor que equilibrio | validar equilibrio | bloqueio | N/A | permitir prejuizo calculado |
| preco manual abaixo meta | aprovado acima equilibrio e abaixo meta | recalcular LT/ML | alerta e confirmacao | 1 centavo | salvar sem alerta |
| preco manual igual equilibrio | aprovado igual equilibrio | lucro zero | permitido com alerta | 1 centavo | tratar como lucro positivo |
| preco manual | aprovado diferente | recalcular LT | lucro real | 1 centavo | esconder diferenca |
| snapshot | editar perfil depois | snapshot | antigo igual | N/A | reprocessar antigo |
| reprocessamento | nova versao | versionamento | versao +1 | N/A | sobrescrever versao |

## 31. Testes unitarios

Planejar testes puros para:

- normalizacao monetaria;
- soma de custos;
- validacao de percentuais;
- calculo de cada modo;
- arredondamento;
- lucro/margem real;
- geracao de warnings;
- snapshot imutavel;
- mensagens de erro.

## 32. Testes de integracao

Planejar:

- server action/route handler valida sessao;
- tenant do cliente e ignorado;
- calculo oficial e server-side;
- persistencia cria calculo, versao e resultados na mesma transacao;
- edicao cria nova versao;
- perfil inativo nao e usado;
- historico antigo nao muda apos alterar perfil;
- erro seguro em payload invalido.

## 33. Testes E2E

Planejar:

- criar precificacao simples;
- validar campos obrigatorios;
- alternar modos;
- comparar perfis;
- ajustar arredondamento;
- aprovar preco;
- consultar historico;
- editar criando nova versao;
- mobile 360/390;
- desktop 1366/1440;
- teclado e foco;
- acesso direto sem permissao;
- sem overflow.

## 34. Testes de seguranca

Planejar:

- manipulacao de `tenant_id`;
- manipulacao de custo;
- manipulacao de taxas;
- manipulacao de preco final;
- chamada direta ao backend;
- usuario sem vinculo;
- usuario de outro tenant;
- registro inativo;
- percentuais invalidos;
- payload excessivo;
- logs sem segredos;
- RLS;
- historico imutavel.

## 35. Criterios de aceite

| Area | Criterio | Evidencia |
|---|---|---|
| Produto | Precificador calcula pelos tres modos oficiais | Testes matematicos e E2E |
| Matematica | Formulas batem com casos conhecidos | Unit tests |
| Backend | Resultado oficial calculado no servidor | Integration tests |
| Banco | Tabelas com `tenant_id`, constraints e RLS | Migration review futura |
| Frontend | Fluxo guiado conforme REF-12 | Screenshots e Frontend Gate |
| Seguranca | Tenant e papel validados | Security tests |
| Multitenancy | Usuario A nao acessa tenant B | SQL/integration tests |
| Mobile | 360 e 390 sem overflow | Playwright |
| Desktop | Comparacao por perfil legivel | Playwright |
| Acessibilidade | Teclado, foco e labels | E2E/checklist |
| Historico | Snapshot preservado | Integration tests |
| Performance | Sem biblioteca pesada injustificada | Bundle report |
| Documentacao | SPEC, log, changelog atualizados | Diff |

## 36. Definition of Ready

Para iniciar implementacao futura:

```text
DEFINITION OF READY

[x] SPEC-003 aprovada pelo Product Owner
[x] Pendencias bloqueadoras resolvidas ou explicitamente adiadas
[x] Base da perda percentual definida
[x] Frete MVP definido
[x] Permissoes de perfis comerciais definidas
[x] Modelo de dados aprovado para implementacao futura
[x] Contratos matematicos aprovados
[x] Casos de teste matematicos aceitos como matriz minima
[x] UX por etapas aprovada como direcao
[x] Referencias visuais oficiais localizadas
[x] Sem necessidade de segredo
[x] Sem operacao remota nao autorizada

RESULTADO:

READY
```

Status atual: READY PARA IMPLEMENTACAO DA ENTREGA A. A aprovacao e documental; nenhuma implementacao funcional foi iniciada.

## 37. Definition of Done

Para implementacao futura:

- calculos puros implementados e testados;
- backend calcula resultado oficial;
- migrations revisadas;
- RLS implementada;
- isolamento multitenant testado;
- historico por snapshot preservado;
- frontend usa App Shell e tokens existentes;
- responsividade validada;
- acessibilidade validada;
- Security Gate aprovado;
- Frontend Gate aprovado;
- `npm audit` reavaliado;
- documentacao e implementation log atualizados;
- nenhum dado sensivel em cache/log/bundle.

## 38. Security Gate

Checklist exigido para implementacao futura:

```text
SECURITY GATE

[ ] Backend First respeitado
[ ] Sessao validada no servidor
[ ] Tenant validado
[ ] Papel validado
[ ] RLS revisada
[ ] Isolamento entre tenants testado
[ ] Service Role protegida
[ ] Segredos protegidos
[ ] Sem logica critica apenas no frontend
[ ] Owner protegido
[ ] Ultimo owner protegido
[ ] Inputs validados
[ ] Auditoria considerada
[ ] Testes permitidos e proibidos
[ ] Sem migration destrutiva nao autorizada
[ ] Sem vazamento em logs
[ ] Documentacao atualizada

RESULTADO:

APROVADO ou REPROVADO
```

Para esta meta documental: APROVADO PARA DOCUMENTACAO, pois nenhuma implementacao, migration, banco remoto ou segredo foi alterado.

## 39. Frontend Gate

Checklist exigido para implementacao futura:

```text
FRONTEND GATE

[ ] Identidade visual preservada
[ ] Claymorphism aplicado com disciplina
[ ] Gradientes controlados
[ ] Sombras consistentes
[ ] Tipografia correta
[ ] Botoes padronizados
[ ] Inputs padronizados
[ ] Icones consistentes
[ ] Containers corretos
[ ] Sem excesso de cards
[ ] Desktop validado
[ ] Mobile validado
[ ] PWA considerada
[ ] Animacoes respeitam reduced motion
[ ] Acessibilidade validada
[ ] Sem overflow
[ ] Sem texto cortado
[ ] Sem controles inativos
[ ] Sem logica sensivel no frontend
[ ] Performance aceitavel
[ ] Conceito e implementacao comparados

RESULTADO:

APROVADO ou REPROVADO
```

Para esta meta documental: APROVADO PARA ESPECIFICACAO. Comparacao visual direta das imagens ficou NAO VALIDADA por ACL do visualizador, mas referencias foram localizadas e registradas.

## 40. Riscos

- `npm audit --audit-level=high` herdado da SPEC-002.
- Taxas, impostos e comissoes reais de cada tenant ainda dependem de configuracao real.
- Parametros comerciais recomendados pela MARIED UNIVERSITY ainda dependem de decisao futura.
- Regra de multiplos tenants pendente.
- Comparacao visual pixel-perfect pendente.
- Calculos monetarios exigem decimal/inteiro de centavos ou biblioteca decimal; nunca float.
- Preview frontend pode divergir do backend se contratos nao forem testados.

## 41. Pendencias

| Pendencia | Impacto | Decisao necessaria |
|---|---|---|
| multiplos tenants | Auth/App Shell | Selecionador futuro ou regra transversal aprovada |
| percentuais reais por tenant | Perfis | Cada tenant deve configurar seus proprios valores |
| impostos reais por empresa | Perfis | Depende de regime e orientacao da empresa |
| taxas reais de cartao | Perfis | Depende de adquirente/operadora |
| taxas reais de marketplace | Perfis | Depende de canal utilizado |
| integracao automatica com estoque | Estoque futuro | Definir politica antes de integrar |
| aprovacao em multiplos niveis | Governanca futura | Fora do MVP simples |
| parametros recomendados MARIED | Produto/comercial | Definir recomendacoes futuras sem inventar agora |
| perfis comerciais premium | Comercial futuro | Avaliar em SPEC propria |

## 42. Matriz de rastreabilidade

| Requisito | Origem | Regra | Formula | Componente | Rota | Tabela | RLS | Teste | Aceite |
|---|---|---|---|---|---|---|---|---|---|
| Identificacao | MVP 9.2 | nome obrigatorio | N/A | PricingForm | `/precificacao/nova` | pricing_calculations | tenant | E2E | campo validado |
| Custos | MVP 9.3 | custo >=0 | CB | MoneyField | nova/editar | pricing_versions | tenant | unit | custo correto |
| Perdas | MVP 9.4 | um tipo ativo | P | PercentageField | nova/editar | pricing_versions | tenant | unit | pendencia clara |
| Percentuais | MVP 9.5 | soma <100 | TP | PercentageField | nova/editar | results | tenant | unit/security | bloqueio |
| Lucro fixo | Goal/MVP | modo oficial | PV | ModeSelector | nova | versions/results | tenant | unit | lucro preservado |
| Acrescimo | Goal/MVP | nao confundir margem | PV | ModeSelector | nova | versions/results | tenant | unit | preco correto |
| Margem | PROJECT/MVP | margem liquida | PV | ModeSelector | nova | versions/results | tenant | unit | denominador valido |
| Perfis | MVP 9.7 | Pix etc | por perfil | CommercialProfileCard | perfis | commercial_profiles | tenant | integration | comparacao |
| Historico | PROJECT | snapshot | N/A | HistoryTable | `/precificacao` | pricing_versions | tenant | integration | antigo preservado |
| Estoque futuro | MVP 9.9 | sem auto criar | N/A | Confirmacao futura | detalhes | product_id futuro | tenant | E2E futuro | confirmacao |

## 43. Plano de implementacao futuro

Entrega A: modelo matematico, contratos e testes puros.

- criar motor puro em pacote/domain adequado;
- implementar validadores;
- cobrir formulas e centavos;
- sem banco e sem UI funcional.

Entrega B: banco, migrations, RLS e backend.

- criar migrations;
- criar policies;
- criar server actions/route handlers;
- testar dois usuarios e dois tenants;
- sem frontend completo.

Entrega C: formulario e calculo simples.

- fluxo por etapas;
- campos de custos e modo unico inicial;
- resultado oficial vindo do backend;
- mobile/desktop.

Entrega D: perfis comerciais e comparacao.

- perfis oficiais;
- comparacao por perfil;
- arredondamento;
- warnings.

Entrega E: salvamento, historico e edicao.

- snapshot;
- nova versao;
- listagem;
- detalhes;
- inativacao conforme regra aprovada.

Entrega F: testes finais, acessibilidade, responsividade e gates.

- E2E completo;
- Security Gate;
- Frontend Gate;
- bundle;
- documentacao final.

## 44. Conflitos, substituicoes e decisoes de precedencia

| Documentos | Regra antiga | Regra atual | Decisao | Justificativa | Impacto | Documento a atualizar |
|---|---|---|---|---|---|---|
| PROJECT vs MVP/Goal | Precificador inclui tratamentos de ouro, prata e verniz no motor | MVP do Precificador atual foca peca, custos, perdas, perfis e preco; Producao e Banho fica separado | SPEC-003 nao implementa banho no MVP inicial, mas preserva ENGINE-001 para evolucao | Evita complexidade excessiva e respeita separacao de Producao e Banho | Banho vira contrato futuro do motor, nao primeira entrega funcional | ENGINE-001 em fase futura |
| Formula antiga textual vs Goal | "ganho = custo - venda" | Lucro = venda - custos - taxas - comissao - impostos | Corrigir formula na SPEC sem apagar historico | Formula antiga inverte sinal e causaria prejuizo | Testes matematicos devem bloquear | Docs de regras quando implementado |
| Referencias visuais vs escopo funcional | Imagens mostram fluxos amplos | Funcionalidade depende de SPEC aprovada | Usar referencias para UX, nao para inventar regra | Governanca de referencias exige nao criar regra por imagem | Componentes planejados, nao implementados | SPEC-003 e futura implementacao |
| MVP 9.9 vs fora do escopo de Estoque | Perguntar cadastrar no estoque apos salvar | Estoque funcional fora do escopo | Registrar integracao futura sem criar produto automaticamente | Mantem contrato sem implementar estoque | CTA pode ficar futuro/feature flag | SPEC futura de Estoque |

## 45. Aprovacao

Esta SPEC esta em `APROVADA PARA IMPLEMENTACAO`.

Ela nao autoriza automaticamente:

- implementacao funcional;
- migrations;
- aplicacao no Supabase local ou remoto;
- deploy;
- Stripe;
- OAuth;
- merge;
- alteracao direta na `main`.

A proxima etapa autorizavel e criar o Goal da Entrega A: motor matematico, contratos e testes puros, sem banco e sem UI funcional ate nova tarefa explicita.
