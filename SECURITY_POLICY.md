# SECURITY POLICY
## Política Permanente de Segurança da MARIED UNIVERSITY

**Projeto:** MARIED UNIVERSITY
**Status:** APROVADO
**Aplicação:** obrigatória em todo o projeto
**Última atualização:** 30/07/2026

---

# 1. OBJETIVO

Esta política define as regras permanentes de segurança da MARIED UNIVERSITY.

Ela deve ser lida antes de qualquer implementação que envolva:

- autenticação;
- autorização;
- usuários;
- tenants;
- papéis;
- permissões;
- assinaturas;
- pagamentos;
- integrações externas;
- dados sensíveis;
- operações administrativas;
- acesso ao banco;
- auditoria;
- segredos;
- infraestrutura.

Esta política não substitui:

- `PROJECT.md`;
- ADRs;
- SPECS;
- migrations;
- testes;
- documentação técnica específica.

Ela funciona como uma camada obrigatória de segurança sobre todos esses documentos.

---

# 2. PRINCÍPIOS FUNDAMENTAIS

A MARIED UNIVERSITY adota oficialmente os seguintes princípios:

1. Backend First para operações sensíveis.
2. Zero confiança no frontend.
3. Menor privilégio.
4. Defesa em profundidade.
5. Isolamento obrigatório entre tenants.
6. RLS obrigatória.
7. Segredos somente no servidor.
8. Auditoria de ações críticas.
9. Validação server-side.
10. Segurança por padrão.
11. Falha segura.
12. Mudanças sensíveis exigem revisão.

---

# 3. BACKEND FIRST

Toda operação sensível deve ser validada e concluída em ambiente controlado.

Ambientes válidos:

- Server Actions;
- Route Handlers;
- serviços de domínio no backend;
- Supabase Auth;
- PostgreSQL protegido por RLS;
- funções seguras no banco;
- webhooks verificados;
- jobs server-side;
- infraestrutura autorizada.

O frontend pode:

- apresentar interfaces;
- coletar entradas;
- iniciar fluxos;
- enviar solicitações;
- exibir respostas.

O frontend não pode decidir:

- identidade;
- tenant;
- papel;
- permissão;
- módulo contratado;
- plano;
- assinatura;
- preço;
- desconto;
- pagamento;
- liberação de acesso;
- status administrativo;
- autorização final.

---

# 4. O FRONTEND NÃO É FONTE CONFIÁVEL

Todo dado vindo do navegador deve ser considerado manipulável.

Nunca confiar diretamente em:

- `tenant_id`;
- `user_id`;
- `role`;
- `permission`;
- `module_id`;
- `plan_id`;
- `price_id`;
- valor financeiro;
- desconto;
- status de assinatura;
- status de pagamento;
- flags administrativas;
- retorno visual de Checkout;
- parâmetros ocultos;
- dados armazenados no estado React;
- dados armazenados apenas no local storage;
- campos desabilitados na interface.

Mesmo quando enviados pelo frontend, esses valores devem ser consultados, recalculados ou confirmados no servidor.

---

# 5. AUTENTICAÇÃO

A autenticação deve ser centralizada em provedor confiável.

Para a MARIED UNIVERSITY:

- Supabase Auth será o provedor principal;
- sessões devem ser validadas no servidor;
- tokens não devem ser tratados como fonte absoluta de autorização;
- autenticação e autorização são responsabilidades diferentes;
- login bem-sucedido não significa acesso irrestrito.

Regras obrigatórias:

- validar sessão no servidor;
- validar expiração;
- validar usuário ativo;
- validar vínculo com tenant;
- impedir uso de usuário removido ou desativado;
- impedir acesso após revogação;
- tratar recuperação de senha como fluxo sensível;
- não expor detalhes desnecessários de falha de login;
- não armazenar senha fora do provedor de autenticação.

---

# 6. OAUTH

OAuth poderá ser iniciado pelo frontend, mas não concluído por lógica confiável no navegador.

O frontend pode:

- abrir o provedor;
- redirecionar o usuário;
- iniciar o fluxo.

O backend ou provedor de autenticação deve:

- validar o provedor;
- validar redirect URI;
- trocar código por sessão;
- validar state e PKCE;
- gerar tokens;
- renovar sessão;
- revogar sessão;
- proteger client secrets.

Regras:

- client secret nunca no frontend;
- redirect URIs explícitas;
- HTTPS obrigatório em produção;
- PKCE obrigatório quando aplicável;
- callback tratado em rota segura;
- escopos mínimos necessários;
- provedor não deve conceder mais dados que o necessário.

---

# 7. AUTORIZAÇÃO

Autorização deve ser validada em todas as operações sensíveis.

Toda ação deve considerar:

1. usuário autenticado;
2. usuário ativo;
3. tenant correto;
4. vínculo ativo;
5. papel;
6. permissão;
7. módulo;
8. plano;
9. limite;
10. contexto da operação.

Nunca confiar apenas em:

- botão escondido;
- rota visual;
- menu oculto;
- componente protegido;
- estado de interface;
- validação no cliente.

Toda Server Action e Route Handler deve ser tratada como endpoint público.

---

# 8. MULTITENANCY

O isolamento entre empresas é obrigatório.

Toda tabela operacional deve possuir:

```text
tenant_id
```

Toda consulta deve:

- filtrar tenant;
- respeitar RLS;
- evitar consultas globais sem necessidade;
- impedir acesso cruzado;
- impedir update cruzado;
- impedir delete cruzado;
- impedir associação cruzada.

Regras adicionais:

- `tenant_id` não pode ser alterado livremente;
- vínculo não pode ser movido entre tenants por update;
- operações administrativas devem validar o tenant-alvo;
- IDs válidos não garantem autorização;
- UUID não é mecanismo de segurança.

---

# 9. RLS

RLS é obrigatória em tabelas expostas ou acessadas por usuários autenticados.

Toda política deve:

- ser específica;
- aplicar menor privilégio;
- validar vínculo ativo;
- validar tenant;
- evitar permissões amplas;
- evitar recursão;
- ser testada com múltiplos usuários e tenants.

Nunca criar política genérica baseada apenas em:

```sql
auth.role() = 'authenticated'
```

Funções auxiliares usadas por RLS devem:

- ter `search_path` explícito;
- evitar recursão;
- usar `SECURITY DEFINER` somente quando necessário;
- ter permissões restritas;
- viver em schema privado quando forem internas;
- ter execução revogada de `public` quando apropriado.

---

# 10. PAPÉIS E PERMISSÕES

Papéis oficiais devem ser centralizados e documentados.

Regras mínimas:

- owner possui controle máximo do tenant;
- admin não pode criar owner;
- admin não pode promover a si próprio para owner;
- admin não pode promover outro usuário para owner;
- admin não pode remover owner;
- admin não pode rebaixar owner;
- admin não pode desativar owner;
- último owner ativo não pode ser removido;
- último owner ativo não pode ser desativado;
- último owner ativo não pode ser rebaixado;
- alteração de papel deve gerar auditoria;
- vínculo inativo não concede acesso.

Papéis não devem ser controlados por strings soltas espalhadas no frontend.

---

# 11. OWNER PROTECTION

Todo tenant ativo deve possuir pelo menos um owner ativo.

São obrigatórias proteções contra:

- exclusão do último owner;
- desativação do último owner;
- rebaixamento do último owner;
- remoção acidental;
- autopromoção por admin;
- transferência silenciosa;
- alteração de ownership por update indevido.

Transferência de ownership deve ser fluxo explícito, validado e auditado.

---

# 12. SEGREDOS

Segredos nunca podem chegar ao navegador.

Exemplos:

- `SUPABASE_SERVICE_ROLE_KEY`;
- `SUPABASE_SECRET_KEY`;
- `STRIPE_SECRET_KEY`;
- `STRIPE_WEBHOOK_SECRET`;
- OAuth client secret;
- chaves privadas;
- tokens administrativos;
- credenciais de banco;
- certificados privados.

Regras:

- segredos apenas em variáveis de ambiente seguras;
- nunca versionar `.env`;
- nunca registrar segredo em log;
- nunca enviar segredo em resposta;
- nunca prefixar segredo com `NEXT_PUBLIC_`;
- nunca usar `service_role` no browser;
- nunca expor segredo em bundle frontend;
- rotacionar segredo em caso de suspeita.

---

# 13. SERVICE ROLE

A `service_role` deve ser tratada como credencial altamente privilegiada.

Uso permitido:

- operações administrativas controladas;
- jobs internos;
- webhooks;
- rotinas server-side específicas;
- ações sem alternativa segura.

Uso proibido:

- frontend;
- browser;
- componentes React;
- local storage;
- respostas da API;
- código compartilhado com cliente.

Toda operação com `service_role` deve:

- validar contexto;
- reduzir escopo;
- registrar auditoria;
- evitar bypass desnecessário de RLS;
- usar menor privilégio possível.

---

# 14. PAGAMENTOS

Pagamentos devem ser processados com autoridade no backend.

O frontend não pode definir como verdade:

- preço;
- produto;
- desconto;
- quantidade;
- moeda;
- tenant;
- assinatura;
- plano;
- liberação de módulo.

Fluxo obrigatório:

1. frontend solicita contratação;
2. backend valida sessão;
3. backend valida tenant;
4. backend consulta produto e preço oficiais;
5. backend cria Checkout;
6. Stripe processa pagamento;
7. webhook validado confirma evento;
8. backend registra pagamento;
9. backend libera acesso;
10. auditoria é registrada.

A página de sucesso nunca libera acesso.

---

# 15. WEBHOOKS

Todo webhook deve:

- rodar no backend;
- validar assinatura;
- validar origem;
- usar segredo seguro;
- ser idempotente;
- registrar `event_id`;
- impedir duplicação;
- rejeitar evento inválido;
- registrar auditoria;
- responder rapidamente;
- separar processamento pesado quando necessário.

Nunca confiar em payload sem validação.

---

# 16. DADOS FINANCEIROS

Regras:

- usar `numeric` ou `decimal`;
- nunca usar `float` para dinheiro;
- recalcular no servidor;
- registrar origem dos valores;
- registrar descontos;
- registrar alterações;
- preservar histórico;
- evitar sobrescrita silenciosa;
- validar moeda;
- validar arredondamento.

---

# 17. VALIDAÇÃO DE ENTRADA

Toda entrada deve ser validada no servidor.

Validar:

- tipo;
- formato;
- tamanho;
- faixa;
- enum;
- referência;
- tenant;
- permissões;
- integridade;
- campos obrigatórios.

Nunca confiar apenas em validação HTML ou Zod no cliente.

Validação no frontend melhora experiência.

Validação no backend garante segurança.

---

# 18. BANCO DE DADOS

Regras obrigatórias:

- migrations versionadas;
- constraints para integridade;
- chaves estrangeiras;
- índices adequados;
- UUID para entidades de negócio;
- `timestamptz` para datas;
- histórico quando necessário;
- soft delete quando aplicável;
- funções internas em schema privado;
- privilégios mínimos;
- migrations destrutivas exigem revisão.

Nunca editar migration já aplicada em produção.

---

# 19. AUDITORIA

Ações críticas devem gerar registro de auditoria.

Exemplos:

- login administrativo;
- alteração de papel;
- criação de owner;
- remoção de membro;
- alteração de plano;
- alteração de assinatura;
- pagamento;
- reembolso;
- liberação de módulo;
- acesso privilegiado;
- alteração de configuração;
- uso de função administrativa.

Registro mínimo:

- usuário;
- tenant;
- ação;
- entidade;
- identificador;
- data;
- origem;
- resultado;
- detalhes relevantes.

Logs não podem conter segredos.

---

# 20. LOGS E ERROS

Logs devem ser úteis sem expor dados sensíveis.

Nunca registrar:

- senha;
- token completo;
- chave secreta;
- sessão;
- cartão;
- segredo OAuth;
- PII desnecessária.

Mensagens ao usuário devem ser seguras.

Mensagens internas podem ser detalhadas, desde que protegidas.

---

# 21. HEADERS E TRANSPORTE

Em produção:

- HTTPS obrigatório;
- cookies seguros;
- `HttpOnly` quando aplicável;
- `SameSite` apropriado;
- proteção contra clickjacking;
- política de conteúdo;
- proteção contra MIME sniffing;
- redirects controlados;
- CORS restritivo;
- origens autorizadas explícitas.

---

# 22. DEPENDÊNCIAS

Dependências devem:

- ser necessárias;
- ter manutenção ativa;
- ter licença compatível;
- ser atualizadas;
- passar por revisão;
- não duplicar função existente.

Pacotes com vulnerabilidade crítica não devem entrar na `main`.

---

# 23. SEGURANÇA NO FRONTEND

Mesmo não sendo camada confiável, o frontend deve:

- evitar exposição desnecessária;
- esconder ações não autorizadas;
- não armazenar segredos;
- não armazenar dados sensíveis sem necessidade;
- usar mensagens seguras;
- evitar XSS;
- escapar conteúdo;
- evitar `dangerouslySetInnerHTML`;
- validar upload;
- limitar dados retornados.

Esconder botão é UX, não segurança.

---

# 24. UPLOADS

Uploads devem:

- validar extensão;
- validar MIME;
- validar tamanho;
- renomear arquivo;
- impedir path traversal;
- impedir execução;
- usar bucket apropriado;
- aplicar políticas;
- restringir acesso;
- gerar URL assinada quando necessário.

---

# 25. TESTES DE SEGURANÇA

Toda feature sensível deve testar:

- acesso permitido;
- acesso proibido;
- usuário externo;
- usuário inativo;
- tenant diferente;
- papel insuficiente;
- manipulação de ID;
- manipulação de tenant;
- escalada de privilégio;
- último owner;
- input inválido;
- duplicação;
- idempotência;
- segredo ausente;
- evento inválido.

Para multitenancy, usar no mínimo:

- usuário A;
- usuário B;
- tenant A;
- tenant B.

---

# 26. SECURITY GATE

Antes de mergear qualquer alteração sensível, executar:

```text
SECURITY GATE

[ ] Backend First respeitado
[ ] Sessão validada no servidor
[ ] Tenant validado
[ ] Papel validado
[ ] RLS revisada
[ ] Isolamento entre tenants testado
[ ] Service Role protegida
[ ] Segredos protegidos
[ ] Sem lógica crítica apenas no frontend
[ ] Owner protegido
[ ] Último owner protegido
[ ] Inputs validados
[ ] Auditoria considerada
[ ] Testes permitidos e proibidos
[ ] Sem migration destrutiva não autorizada
[ ] Sem vazamento em logs
[ ] Documentação atualizada

RESULTADO:

APROVADO
ou
REPROVADO
```

Nenhuma alteração sensível deve entrar na `main` com resultado REPROVADO.

---

# 27. QUANDO PARAR

Codex ou qualquer agente deve parar quando:

- houver dúvida sobre segurança;
- houver risco de perda de dados;
- houver risco de escalada de privilégio;
- houver risco de exposição de segredo;
- houver conflito entre schema e documentação;
- houver necessidade de aplicar migration remota;
- houver necessidade de acessar produção;
- houver necessidade de configurar OAuth;
- houver necessidade de configurar Stripe;
- houver necessidade de inserir segredo;
- houver decisão de produto não documentada.

---

# 28. DOCUMENTAÇÃO OBRIGATÓRIA

Para toda mudança sensível, atualizar quando aplicável:

- `PROJECT.md`;
- `SECURITY_POLICY.md`;
- ADR;
- SPEC;
- documentação do banco;
- changelog;
- testes;
- guia de IA;
- protocolo do Codex.

Nunca marcar como implementado algo apenas planejado.

---

# 29. REVISÃO DE SEGURANÇA

Toda revisão deve responder:

1. O frontend está decidindo algo sensível?
2. A sessão é validada no servidor?
3. O tenant é validado?
4. O papel é validado?
5. A RLS protege a tabela?
6. Existe risco de recursão?
7. Existe escalada de privilégio?
8. O último owner está protegido?
9. Existe segredo exposto?
10. Existe uso indevido de service role?
11. O pagamento depende de webhook?
12. Existe idempotência?
13. Os logs estão seguros?
14. Os testes cobrem acesso proibido?
15. A documentação corresponde ao estado real?

---

# 30. HIERARQUIA DOCUMENTAL

A ordem de leitura obrigatória é:

1. `PROJECT.md`
2. `SECURITY_POLICY.md`
3. `CODEX_EXECUTION_PROTOCOL.md`
4. SPEC atual
5. ADRs relacionados
6. estado do banco
7. código
8. testes

---

# 31. REGRA FINAL

Nenhuma funcionalidade é considerada concluída apenas porque funciona.

Ela só é considerada concluída quando:

- funciona;
- é segura;
- respeita tenant;
- respeita papéis;
- respeita RLS;
- não expõe segredos;
- possui testes;
- possui documentação;
- passa no Security Gate.

Segurança não é uma etapa final.

É uma condição permanente de desenvolvimento.
