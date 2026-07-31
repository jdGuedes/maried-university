# Referencias Visuais Oficiais da MARIED UNIVERSITY

Esta pasta versiona as referencias visuais oficiais usadas pelo Product Owner, Codex, ChatGPT, desenvolvedores, testes visuais, revisao de fidelidade e Frontend Gate.

As imagens representam composicao, hierarquia, layout, navegacao, fluxos, componentes, estados, drawers, modais, responsividade e identidade visual. Elas nao criam regra funcional fora de escopo aprovado.

## Hierarquia de autoridade

1. Regra funcional mais recente aprovada.
2. Seguranca.
3. Frontend Design System.
4. SPEC vigente.
5. Referencia visual aprovada.
6. Implementacao existente.

## Indice v1

| Codigo | Arquivo | Versao | Status | Finalidade | Modulos relacionados | SPEC relacionada |
|---|---|---|---|---|---|---|
| REF-01 | `v1/01_controle_acesso_detalhes.png` | v1 | APROVADA | Controle de acesso detalhes | Central Administrativa, Controle de Acesso | SPEC-002 e futuras SPECs admin |
| REF-02 | `v1/02_controle_acesso.png` | v1 | APROVADA | Controle de acesso tela principal | Central Administrativa, Controle de Acesso | SPEC-002 e futuras SPECs admin |
| REF-03 | `v1/03_planos_fluxos.png` | v1 | APROVADA | Planos fluxos | Planos e Assinaturas | SPEC-002 e futuras SPECs admin |
| REF-04 | `v1/04_planos_listagem.png` | v1 | APROVADA | Planos listagem | Planos e Assinaturas | SPEC-002 e futuras SPECs admin |
| REF-05 | `v1/05_usuario_cadastro.png` | v1 | APROVADA | Usuario cadastro | Central Administrativa, Usuarios | SPEC-002 e futuras SPECs admin |
| REF-06 | `v1/06_usuario_detalhes.png` | v1 | APROVADA | Usuario detalhes | Central Administrativa, Usuarios | SPEC-002 e futuras SPECs admin |
| REF-07 | `v1/07_central_dashboard.png` | v1 | APROVADA | Central administrativa dashboard | Central Administrativa | SPEC-002 e futuras SPECs admin |
| REF-08 | `v1/08_minicursos.png` | v1 | APROVADA | Minicursos | Minicursos | SPEC-002 e futura SPEC de minicursos |
| REF-09 | `v1/09_fornecedor_detalhes.png` | v1 | APROVADA | Fornecedor detalhes | Fornecedores | SPEC-002 e futura SPEC de fornecedores |
| REF-10 | `v1/10_fornecedores_lista.png` | v1 | APROVADA | Fornecedores listagem | Fornecedores | SPEC-002 e futura SPEC de fornecedores |
| REF-11 | `v1/11_perfis_categorias.png` | v1 | APROVADA | Perfis comerciais e categorias | Precificacao | SPEC-002 e futura SPEC de precificacao |
| REF-12 | `v1/12_calculadora_fluxo.png` | v1 | APROVADA | Calculadora/precificacao | Precificacao | SPEC-002 e futura SPEC de precificacao |
| REF-13 | `v1/13_estoque_fluxos.png` | v1 | APROVADA | Estoque | Estoque | SPEC-002 e futura SPEC de estoque |
| REF-14 | `v1/14_fluxo_geral.png` | v1 | APROVADA | Fluxo geral | Shell, modulos do MVP | SPEC-002 |
| REF-15 | `v1/15_brand_kit.jpeg` | v1 | APROVADA | Brand kit | Identidade visual, PWA, assets | SPEC-002 |
| REF-16 | `v1/16_splash.jpeg` | v1 | APROVADA | Splash | Autenticacao, PWA | SPEC-002 |
| REF-17 | `v1/17_login.jpeg` | v1 | APROVADA | Login | Autenticacao | SPEC-002 |

## Governanca

- Imagens aprovadas sao imutaveis.
- Correcoes devem gerar nova versao; a versao antiga permanece como historico.
- A pasta `futuras/` nao autoriza implementacao.`n- A pasta `archive/` preserva fontes originais imutaveis para auditoria; a implementacao deve usar `references/v1/`.
- Apenas referencias com status APROVADA podem ser usadas como contrato visual.
- Substituicoes precisam ser documentadas com motivo e aprovacao.
- Estas referencias nao sao assets publicos de producao.
- Assets de producao serao criados futuramente em `apps/web/public/`.
- Nao copiar uma referencia completa para dentro do produto.
- Logos e assets devem ser extraidos, medidos e otimizados na Entrega A da SPEC-002.
- As imagens nao devem conter secrets nem dados reais de clientes.

## Versionamento

A versao atual fica em `references/v1/`. Versoes futuras devem usar `references/v2/`, `references/v3/` e assim por diante.

Cada nova versao deve registrar data, responsavel, motivo, telas substituidas, telas mantidas, SPECS impactadas, impacto esperado e aprovacao do Product Owner.
