# Goal Framework - MARIED UNIVERSITY

Use este modelo para preparar proximas metas de implementacao sem repetir todo o historico do projeto.

## 1. Identificacao

- Projeto: MARIED UNIVERSITY.
- SPEC: `[SPEC]`.
- Entrega: `[ENTREGA]`.
- Branch esperada: `[BRANCH]`.
- Commit inicial esperado: `[COMMIT_INICIAL]`.
- Objetivo: `[OBJETIVO]`.

## 2. Estado Herdado

Ler `docs/PROJECT_STATE.md` e registrar:

- entregas concluidas;
- ultimo commit;
- working tree inicial;
- riscos conhecidos;
- itens nao validados;
- componentes e contratos que nao devem ser reconstruidos.

## 3. Fontes Obrigatorias

Ler, no minimo:

- `PROJECT.md`;
- `docs/PROJECT_STATE.md`;
- `SECURITY_POLICY.md`;
- `CODEX_EXECUTION_PROTOCOL.md`;
- `FRONTEND_DESIGN_SYSTEM.md` quando houver frontend;
- SPEC vigente;
- ADRs relacionados;
- logs de implementacao anteriores;
- `CHANGELOG.md`;
- codigo e testes impactados.

## 4. Auditoria Inicial

Antes de alterar arquivos:

- confirmar branch;
- confirmar HEAD;
- executar `git status --short --untracked-files=all`;
- mapear arquivos existentes relevantes;
- identificar mudancas locais inesperadas;
- localizar testes e scripts reais;
- localizar riscos herdados;
- registrar Definition of Ready no implementation log.

## 5. Implementation Log

Criar ou atualizar `docs/implementation-log/[DATA]-[SPEC]-[ENTREGA].md` antes da primeira alteracao funcional.

Registrar durante a execucao:

- objetivo;
- escopo e fora do escopo;
- comportamento anterior e novo;
- arquivos criados/alterados/removidos;
- decisoes tecnicas;
- comandos e resultados reais;
- riscos, pendencias e itens nao validados;
- gates;
- commit e push ao final.

## 6. Escopo

Definir:

- `[ESCOPO]`;
- `[FORA_DO_ESCOPO]`;
- `[REFERENCIAS]`;
- `[CRITERIOS_ESPECIFICOS]`.

Nao implementar modulo, integracao, migration ou regra de negocio fora da SPEC aprovada.

## 7. Seguranca

Aplicar `SECURITY_POLICY.md`:

- autorizacao no servidor;
- RLS e Backend First quando houver dados;
- nenhum segredo no frontend ou diff;
- nenhuma credencial real em teste;
- nenhuma alteracao remota sem autorizacao explicita;
- menor privilegio;
- registrar Security Gate com evidencias.

## 8. Frontend

Quando houver frontend:

- reutilizar Design Tokens e componentes-base;
- respeitar referencias visuais oficiais;
- validar responsividade;
- validar foco, teclado, contraste e reduced motion;
- nao criar dados ficticios;
- registrar Frontend Gate com evidencias.

## 9. Validacoes

Executar conforme scripts reais:

- lint, se existir;
- typecheck;
- unitarios;
- integracao;
- E2E;
- build;
- `git diff --check`;
- `npm audit --audit-level=high` quando houver Node;
- varredura de segredos;
- revisao de diff completo.

Quando algo nao puder ser validado, registrar `NAO VALIDADO` com motivo, impacto e proxima acao.

## 10. Documentacao

Atualizar somente documentos impactados:

- `CHANGELOG.md`;
- `README.md`;
- docs relacionados;
- SPEC quando o status contratual mudar;
- implementation log;
- `docs/PROJECT_STATE.md` ao final.

Criar ADR apenas para decisao arquitetural nova, relevante e duradoura.

## 11. Controle de Versao

Antes do commit:

- revisar `git status --short --untracked-files=all`;
- revisar `git diff --check`;
- revisar `git diff --stat`;
- revisar `git diff --name-only`;
- confirmar ausencia de segredos e arquivos fora do escopo.

Commit e push so sao permitidos quando autorizados pelo Goal. Nunca fazer merge, deploy, tag, release ou push force sem autorizacao explicita.

## 12. Relatorio Final

Entregar:

- meta executada;
- estado inicial/final;
- implementacoes;
- arquivos;
- testes e resultados;
- gates;
- riscos e pendencias;
- acoes nao executadas;
- commit;
- push;
- working tree final;
- bloco `CONTEXTO PARA O PROXIMO GOAL`.