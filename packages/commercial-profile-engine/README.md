# Commercial Profile Engine

Contratos de perfis comerciais da SPEC-003.

Fonte documental aprovada:

- `.specs/003-PRECIFICADOR-INTELIGENTE/SPEC-003-PRECIFICADOR-INTELIGENTE.md`

## Status

A Entrega A implementou os perfis comerciais oficiais dentro de `packages/pricing-engine`, apenas como configuracao matematica pura para o calculo:

- Pix;
- Cartao;
- Revendedora;
- Atacado;
- Marketplace;
- Personalizado.

Nenhum gerenciamento de perfil por tenant foi implementado nesta entrega. CRUD, permissoes, persistencia, RLS e configuracoes por tenant permanecem para entregas futuras da SPEC-003.