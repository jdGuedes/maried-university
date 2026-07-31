# CODEX EXECUTION PROTOCOL
## Protocolo de Trabalho Autônomo com Paradas Controladas

**Projeto:** MARIED UNIVERSITY
**Aplicação:** Codex local no repositório `jdGuedes/maried-university`
**Status:** APROVADO PARA USO
**Objetivo:** permitir que o Codex trabalhe de forma contínua, segura e produtiva, parando somente quando houver motivo real.

---

# 1. REGRA PRINCIPAL

O Codex deve continuar trabalhando até concluir integralmente a tarefa autorizada.

Ele não deve parar por:

- pequenas dúvidas que possam ser resolvidas lendo a documentação;
- ausência de instrução sobre detalhes técnicos já definidos por padrões do projeto;
- necessidade de criar arquivos auxiliares coerentes com a tarefa;
- necessidade de ajustar documentação relacionada;
- necessidade de criar ou ampliar testes;
- necessidade de refatorar código diretamente ligado ao escopo;
- necessidade de corrigir erros encontrados durante a própria implementação;
- necessidade de revisar o próprio trabalho;
- necessidade de executar validações disponíveis no ambiente.

O Codex deve agir como um desenvolvedor responsável, não como um gerador de arquivos que abandona a obra na metade.

---

# 2. FONTES OBRIGATÓRIAS

Antes de iniciar qualquer tarefa, ler:

1. `PROJECT.md`
2. a SPEC relacionada;
3. ADRs relacionados;
4. documentação do banco;
5. guia de IA e desenvolvimento;
6. migrations existentes;
7. testes existentes;
8. arquivos diretamente afetados.

Ordem de prioridade:

1. documentação mais recente aprovada;
2. SPEC da tarefa;
3. ADRs;
4. estado real do banco e código;
5. prompt da tarefa;
6. inferências técnicas seguras.

Quando houver conflito, não escolher silenciosamente. Registrar o conflito e parar somente se ele impedir uma decisão segura.

---

# 3. COMO TRABALHAR

## 3.1. Antes de alterar arquivos

O Codex deve:

- identificar o objetivo;
- listar o escopo;
- listar explicitamente o que está fora do escopo;
- localizar arquivos existentes;
- verificar migrations já aplicadas;
- verificar dependências;
- identificar riscos de segurança;
- identificar testes necessários;
- montar um plano interno de execução.

Não precisa pedir aprovação para esse plano quando o escopo já estiver claro.

---

## 3.2. Durante a execução

O Codex deve:

- trabalhar em etapas;
- manter compatibilidade com o projeto;
- evitar duplicação;
- preferir alterações pequenas e rastreáveis;
- atualizar testes junto com código;
- atualizar documentação junto com decisões;
- revisar a segurança de cada alteração;
- validar tenant, papéis, RLS e backend first;
- corrigir problemas diretamente relacionados que forem descobertos;
- não abandonar arquivos em estado parcialmente inconsistente.

---

## 3.3. Depois da execução

O Codex deve:

- revisar o diff completo;
- procurar segredos;
- procurar duplicação de regra;
- procurar violação de RLS;
- procurar lógica sensível no frontend;
- procurar uso de `float` para dinheiro;
- procurar ausência de `tenant_id`;
- verificar testes;
- verificar documentação;
- informar riscos restantes;
- informar o que não conseguiu executar.

---

# 4. QUANDO O CODEX DEVE CONTINUAR SEM PERGUNTAR

O Codex deve continuar sem interromper quando:

- encontrar erro de sintaxe;
- encontrar nome inconsistente;
- precisar criar arquivo de teste;
- precisar atualizar changelog;
- precisar corrigir documentação;
- precisar adicionar índice relacionado;
- precisar adicionar constraint diretamente necessária;
- precisar ajustar função para evitar recursão de RLS;
- precisar proteger `search_path`;
- precisar revogar privilégios públicos;
- precisar criar função privada;
- precisar ampliar teste para cobrir vulnerabilidade encontrada;
- precisar refatorar uma função insegura dentro do escopo;
- precisar corrigir migration ainda não aplicada;
- precisar corrigir arquivo criado na mesma tarefa;
- precisar criar README em pasta nova;
- precisar registrar decisão já aprovada.

Não parar para pedir confirmação sobre detalhes técnicos triviais já cobertos por boas práticas e pela documentação do projeto.

---

# 5. QUANDO O CODEX DEVE PARAR

O Codex só deve parar quando existir um bloqueio real.

## 5.1. Decisão de produto

Parar quando for necessário decidir:

- preço;
- regra comercial;
- margem;
- comissão;
- comportamento de negócio não documentado;
- funcionalidade nova;
- alteração de escopo;
- prioridade entre módulos;
- experiência do usuário não definida;
- regra que afete clientes.

---

## 5.2. Risco de segurança

Parar quando:

- houver risco de vazamento de dados;
- a solução exigir expor segredo;
- houver dúvida sobre `service_role`;
- houver risco de quebrar RLS;
- houver dúvida sobre owner, admin ou último owner;
- houver risco de escalada de privilégio;
- houver dúvida sobre autorização entre tenants;
- a mudança puder permitir fraude;
- não for possível provar que a operação é segura.

---

## 5.3. Banco de dados

Parar quando:

- houver necessidade de apagar dados;
- houver migration destrutiva;
- houver alteração irreversível;
- houver conflito entre schema documentado e schema real;
- houver necessidade de aplicar migration remota;
- houver risco de incompatibilidade com dados existentes;
- não for possível confirmar dependências do banco.

---

## 5.4. Integrações externas

Parar quando precisar:

- aplicar migration no Supabase;
- criar ou alterar produtos Stripe;
- configurar webhook;
- alterar Vercel;
- configurar OAuth;
- inserir segredos;
- acessar produção;
- fazer deploy;
- alterar domínio;
- executar operação cobrada;
- alterar conta real de cliente.

---

## 5.5. Controle de versão

Parar antes de:

- fazer merge;
- apagar branch;
- reescrever histórico;
- usar `git push --force`;
- criar tag de produção;
- publicar release;
- aplicar commit diretamente em `main`;
- fazer deploy automático.

Commit local ou push para branch só deve ocorrer se a tarefa autorizar explicitamente.

---

# 6. COMO PARAR CORRETAMENTE

Quando precisar parar, o Codex deve informar:

1. ponto exato onde parou;
2. motivo objetivo;
3. risco envolvido;
4. arquivos já alterados;
5. estado atual da tarefa;
6. opções possíveis;
7. recomendação;
8. pergunta única e clara necessária para continuar.

Evitar mensagens vagas como:

> “Preciso de mais informações.”

Usar formato:

```text
BLOQUEIO REAL

Ponto:
Migração de tenant_members.

Motivo:
O schema real possui coluna diferente da documentação.

Risco:
Aplicar a migration pode quebrar vínculos existentes.

Opções:
A. Confirmar schema no Supabase.
B. Ajustar migration para compatibilidade.

Recomendação:
Confirmar o schema real antes de aplicar.

Pergunta:
Posso consultar o schema remoto do projeto Supabase?
```

---

# 7. BACKEND FIRST

Toda operação sensível deve ser validada e concluída no backend, Supabase Auth, PostgreSQL protegido por RLS ou webhook verificado.

O frontend pode:

- apresentar;
- coletar;
- iniciar;
- solicitar;
- exibir resposta.

O frontend não pode decidir:

- identidade;
- tenant;
- papel;
- permissão;
- módulo;
- assinatura;
- preço;
- desconto;
- pagamento;
- liberação de acesso.

Nunca confiar em:

- `tenant_id` enviado pelo navegador;
- `role` enviado pelo navegador;
- `price_id` enviado pelo navegador;
- valor financeiro enviado pelo navegador;
- status de assinatura enviado pelo navegador;
- retorno visual de Checkout.

Server Actions e Route Handlers devem ser tratados como endpoints públicos.

Toda operação sensível deve validar novamente:

1. sessão;
2. usuário;
3. tenant;
4. vínculo;
5. papel;
6. módulo;
7. assinatura;
8. entrada;
9. limites;
10. auditoria.

RLS continua obrigatória mesmo quando a operação passa pelo backend.

---

# 8. SEGURANÇA DO SUPABASE

## Sempre

- usar RLS;
- usar `tenant_id`;
- usar funções com `search_path` explícito;
- revogar privilégios desnecessários;
- usar schema privado para funções internas;
- separar cliente browser e servidor;
- criar cliente server-side por requisição;
- manter `service_role` somente no servidor;
- testar dois usuários e dois tenants;
- proteger último owner;
- impedir promoção indevida;
- impedir alteração de `tenant_id` e `user_id`.

## Nunca

- usar `service_role` no frontend;
- confiar em `user_metadata` editável;
- criar política baseada apenas em `authenticated`;
- permitir update amplo em tabela de membros;
- usar função `security definer` sem `search_path`;
- deixar função privilegiada exposta sem necessidade;
- considerar esconder botão como proteção.

---

# 9. SEGURANÇA DE PAGAMENTOS

Quando a fase de pagamentos chegar:

- preço oficial vem do servidor;
- produto e `price_id` vêm do banco;
- Checkout é criado no backend;
- confirmação vem por webhook;
- webhook valida assinatura;
- webhook é idempotente;
- módulo só é liberado após evento válido;
- página de sucesso não libera acesso;
- valor enviado pelo frontend é ignorado;
- toda alteração financeira gera auditoria.

Até existir SPEC aprovada, não implementar Stripe.

---

# 10. PADRÕES DE IMPLEMENTAÇÃO

## Código

- TypeScript strict;
- funções pequenas;
- regras de negócio fora do React;
- motores puros;
- validação de entrada;
- erros claros;
- contratos tipados;
- nenhuma lógica duplicada.

## Banco

- UUID para negócio;
- `numeric`/`decimal` para dinheiro;
- `timestamptz` para datas;
- soft delete quando necessário;
- índices por tenant e campos frequentes;
- constraints para integridade;
- migrations versionadas;
- não editar migration aplicada.

## Testes

Criar ou atualizar testes para:

- caminho permitido;
- caminho proibido;
- isolamento entre tenants;
- escalada de privilégio;
- membro inativo;
- owner;
- admin;
- último owner;
- inputs inválidos;
- idempotência;
- histórico preservado.

---

# 11. REGRA DE ESCOPO

O Codex pode corrigir problemas encontrados durante a tarefa quando forem:

- diretamente relacionados;
- necessários para segurança;
- necessários para testes;
- necessários para consistência;
- necessários para concluir o escopo.

O Codex não pode:

- adicionar módulo novo;
- implementar ideia futura;
- criar marketplace;
- alterar modelo comercial;
- ampliar escopo;
- introduzir microserviço;
- configurar integração não solicitada;
- redesenhar arquitetura aprovada.

---

# 12. REGRA DE DOCUMENTAÇÃO

Toda alteração deve atualizar, quando aplicável:

- `PROJECT.md`;
- SPEC;
- ADR;
- estado do banco;
- guia para IA;
- changelog;
- README da área;
- testes.

Nunca marcar como implementado algo apenas planejado.

Usar status:

- IMPLEMENTADO;
- APROVADO;
- EM DESENVOLVIMENTO;
- PENDENTE;
- FUTURO;
- FORA DO ESCOPO.

## 12.1. DOCUMENTACAO CONTINUA DE IMPLEMENTACAO

Toda etapa de desenvolvimento da MARIED UNIVERSITY deve manter documentacao continua antes de ser considerada concluida.

Regra permanente:

> Codigo sem documentacao atualizada e registro de implementacao e implementacao incompleta.

Para cada entrega, modulo, hotfix relevante, migration relevante, decisao tecnica executada separadamente, correcao pos-producao ou revisao de seguranca com alteracoes, o Codex deve criar ou atualizar um registro em:

```text
docs/implementation-log/
```

O registro deve seguir:

```text
docs/implementation-log/README.md
docs/implementation-log/TEMPLATE.md
```

O arquivo de log deve usar a data real de inicio da execucao e o padrao:

```text
AAAA-MM-DD-spec-NNN-entrega-identificador.md
```

Antes de declarar uma tarefa concluida, o Codex deve verificar e registrar quando aplicavel:

- implementacao correta;
- testes executados ou justificativa de nao aplicabilidade;
- revisao do diff;
- documentacao atualizada;
- implementation log atualizado;
- `CHANGELOG.md` atualizado;
- SPEC atualizada quando o contrato, evidencia ou aceite mudar;
- ADR criado ou atualizado quando houver decisao arquitetural;
- `ARCHITECTURE_DECISIONS.md` atualizado quando houver decisao relevante;
- Security Gate;
- Frontend Gate quando houver frontend;
- riscos, pendencias e bloqueios.

O Implementation Log responde como a etapa foi executada, validada e concluida. Ele nao substitui CHANGELOG, SPEC ou ADR.

---

# 13. REGRA DE AUTORREVISÃO

Antes de declarar conclusão, o Codex deve executar uma revisão final respondendo internamente:

1. O escopo foi totalmente atendido?
2. Algo ficou parcial?
3. Existe vulnerabilidade?
4. Existe recursão de RLS?
5. Existe escalada de privilégio?
6. Último owner está protegido?
7. Existe segredo no código?
8. Frontend está decidindo algo sensível?
9. Há lógica duplicada?
10. Testes cobrem permitido e proibido?
11. Documentação está atualizada?
12. Foi criado algo fora do escopo?
13. Há risco para dados existentes?
14. Alguma ação externa ainda precisa de autorização?

Se houver falha corrigível dentro do escopo, corrigir antes de parar.

---

# 14. FORMATO DA ENTREGA FINAL

Ao concluir, entregar:

## Resumo

O que foi implementado.

## Arquivos

Lista de arquivos criados e alterados.

## Segurança

Proteções adicionadas.

## Testes

Testes criados e resultados.

## Validações

Comandos executados.

## Riscos restantes

Riscos que dependem de ambiente ou decisão.

## Ações não executadas

Exemplo:

- migration não aplicada;
- deploy não realizado;
- commit não realizado.

## Próximo passo

Uma recomendação objetiva.

---

# 15. TAREFA ATUAL

A tarefa atual e implementar a SPEC-002 apos aprovacao documental.

A SPEC vigente e:

```text
.specs/002-FRONTEND-AUTH-PWA-USER-SHELL/SPEC-002-FRONTEND-AUTH-PWA-USER-SHELL-v1.1-APROVADA.md
```

A Entrega A da SPEC-002 foi concluida localmente. O Codex deve preparar a Entrega B da SPEC-002 quando autorizado:

- Supabase browser/server;
- sessao server-side;
- protecao de rotas;
- resolucao segura de usuario, tenant e vinculo ativo;
- ausencia de segredos no browser.

O Codex deve respeitar integralmente:

- Backend First;
- Security Gate;
- Frontend Gate;
- Definition of Ready da SPEC-002;
- ausencia de segredos no frontend;
- validacao server-side de sessao, usuario, tenant e vinculo;
- RLS como defesa obrigatoria.

O Codex deve parar antes de:

- implementar modulos funcionais fora da SPEC-002;
- criar migration;
- aplicar migration no Supabase;
- configurar OAuth;
- configurar Stripe;
- configurar webhook;
- configurar Vercel;
- fazer deploy;
- fazer merge.
---

# 16. COMANDO OPERACIONAL PARA O CODEX

```text
Leia PROJECT.md, a SPEC atual, os ADRs e este protocolo.

Execute a tarefa até concluí-la integralmente.

Não pare por detalhes técnicos que possam ser resolvidos pela documentação,
pelo código existente, por testes ou por boas práticas aprovadas.

Corrija problemas diretamente relacionados ao escopo.

Pare somente diante de:
- decisão de produto;
- risco de segurança não resolvível;
- operação destrutiva;
- necessidade de acesso externo;
- aplicação em ambiente remoto;
- conflito real entre documentação e schema;
- necessidade de segredo;
- ação de deploy, merge ou produção.

Antes de parar, revise todo o trabalho.

Não aplique migration, não faça deploy, não configure integrações externas
e não faça merge sem autorização explícita.

Ao final, entregue resumo, arquivos, segurança, testes, validações,
riscos restantes e ações não executadas.
```

---

# 17. PRINCÍPIO FINAL

Autonomia não significa agir sem limites.

Autonomia significa:

- continuar quando o caminho é seguro;
- resolver o que está claro;
- revisar o próprio trabalho;
- proteger o projeto;
- parar somente quando a decisão realmente pertence ao responsável pelo produto.

O Codex deve evitar duas falhas:

1. parar cedo demais;
2. avançar longe demais.

A meta é concluir o máximo possível dentro do escopo aprovado, com segurança, rastreabilidade e disciplina.
