# Implementation Log

Esta pasta registra como cada etapa de implementacao da MARIED UNIVERSITY foi executada, validada, revisada e encerrada.

Codigo sem documentacao deve ser tratado como implementacao incompleta. Uma tarefa, entrega, hotfix ou revisao relevante so pode ser considerada concluida quando o respectivo registro estiver atualizado e coerente com o estado real do repositorio.

## Finalidade

O Implementation Log preserva a memoria operacional de cada entrega. Ele deve permitir que qualquer agente, desenvolvedor ou revisor entenda:

- qual escopo foi executado;
- quais arquivos foram alterados;
- quais testes e validacoes foram realizados;
- quais gates foram avaliados;
- quais documentos foram atualizados;
- quais riscos, pendencias ou decisoes ficaram registrados;
- quando a entrega iniciou e quando foi concluida.

## Diferenca Entre Documentos

| Documento | Pergunta que responde | Uso principal |
|---|---|---|
| CHANGELOG | O que mudou para o projeto? | Resumo versionado das alteracoes relevantes. |
| SPEC | O que deve ser construido? | Contrato de escopo, regras, aceite e limites antes da implementacao. |
| ADR | Por que uma decisao arquitetural foi tomada? | Registro de decisoes estruturais, alternativas e consequencias. |
| Implementation Log | Como a etapa foi executada, validada e concluida? | Diario tecnico e evidencial de cada entrega. |

O Implementation Log nao substitui SPEC, ADR, CHANGELOG, testes ou documentacao tecnica. Ele conecta esses documentos ao trabalho realmente executado.

## Regra de Criacao

Criar um arquivo por entrega, modulo, hotfix relevante, migration relevante, decisao tecnica executada separadamente, correcao pos-producao ou revisao de seguranca com alteracoes.

Nao criar um novo log para pequenas correcoes dentro da mesma entrega. Quando uma entrega durar varios dias, manter o mesmo arquivo com a data inicial e registrar a data de conclusao.

O primeiro log real da SPEC-002 deve ser criado somente quando a Entrega A iniciar de fato, usando a data real de inicio.

## Nomenclatura

Usar o formato:

```text
AAAA-MM-DD-spec-NNN-entrega-identificador.md
```

Exemplo:

```text
2026-07-31-spec-002-entrega-a.md
```

Regras:

- `AAAA-MM-DD` e a data real de inicio da execucao;
- `spec-NNN` deve apontar para a SPEC relacionada quando houver;
- `entrega-identificador` deve ser curto, em kebab-case e sem acentos;
- nao inventar datas futuras;
- nao alterar a data do arquivo se a entrega atravessar varios dias.

## Estados Permitidos

```text
PLANEJADA
EM_IMPLEMENTACAO
BLOQUEADA
EM_REVISAO
CONCLUIDA
CANCELADA
SUBSTITUIDA
```

Nao usar estados alternativos para representar o mesmo significado.

## Quando Atualizar

Atualizar o registro:

- ao iniciar a etapa;
- quando o escopo executado mudar;
- quando arquivos relevantes forem criados, alterados ou removidos;
- quando testes forem adicionados, alterados, executados ou impossibilitados;
- quando houver decisao tecnica, risco, bloqueio ou pendencia;
- antes de mover para `EM_REVISAO`;
- antes de mover para `CONCLUIDA`;
- sempre que CHANGELOG, SPEC, ADR ou documentacao relacionada forem atualizados por causa da entrega.

## Responsabilidade

Quem executa a entrega e responsavel por manter o log atualizado. Isso inclui Codex, outros agentes, desenvolvedores humanos e revisores que facam alteracoes durante a etapa.

Se mais de uma pessoa ou agente atuar na mesma entrega, todos devem registrar suas contribuicoes no mesmo arquivo enquanto o escopo permanecer o mesmo.

## Documentos Relacionados

Antes de encerrar um registro, revisar quando aplicavel:

- `PROJECT.md`;
- `SECURITY_POLICY.md`;
- `CODEX_EXECUTION_PROTOCOL.md`;
- `FRONTEND_DESIGN_SYSTEM.md`;
- `MVP_INITIAL_SCOPE_UPDATED.md`;
- SPEC relacionada;
- ADR relacionado;
- `ARCHITECTURE_DECISIONS.md`;
- `CHANGELOG.md`;
- documentacao tecnica em `docs/`;
- testes e evidencias da entrega.

## Criterios Para Encerrar

Um registro so pode ser marcado como `CONCLUIDA` quando:

- a implementacao ou alteracao documental prevista foi concluida;
- testes e validacoes aplicaveis foram executados ou a impossibilidade foi registrada;
- revisao do diff foi realizada;
- CHANGELOG foi atualizado;
- SPEC foi atualizada quando o contrato mudou ou precisou de evidencia;
- ADR foi criado ou atualizado quando houve decisao arquitetural;
- `ARCHITECTURE_DECISIONS.md` foi atualizado quando houve decisao relevante;
- Security Gate foi avaliado;
- Frontend Gate foi avaliado quando houver frontend;
- riscos e pendencias foram registrados;
- a lista de arquivos alterados esta precisa;
- nenhuma acao fora do escopo foi executada sem autorizacao.

Sem esses itens, a etapa permanece incompleta, mesmo que o codigo funcione.
