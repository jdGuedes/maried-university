# Documentacao oficial

Esta pasta contem a fonte documental versionada da MARIED UNIVERSITY.

A documentacao deve sempre diferenciar:

- implementado;
- aprovado;
- pendente;
- futuro;
- fora do escopo.

Nenhuma alteracao estrutural relevante deve ser implementada sem documentacao ou ADR quando aplicavel.

## Estado e governanca

- `PROJECT_STATE.md`: retrato curto e factual do estado real do projeto para continuidade entre Goals.
- `GOAL_FRAMEWORK.md`: estrutura reutilizavel para preparar proximas metas de implementacao.
- `IMPLEMENTATION_RULES.md`: regras permanentes de execucao, validacao, commit e push de entregas.

Esses arquivos reduzem repeticao nos proximos Goals. Eles nao substituem `PROJECT.md`, SPECs, ADRs, `SECURITY_POLICY.md`, `CODEX_EXECUTION_PROTOCOL.md`, `FRONTEND_DESIGN_SYSTEM.md`, `CHANGELOG.md` ou os logs de implementacao.

## Implementation Log

A pasta `docs/implementation-log/` registra como cada entrega foi executada, validada, revisada e encerrada.

Toda alteracao relevante deve manter um registro de implementacao atualizado antes de ser considerada concluida. Codigo sem documentacao e evidencia de validacao deve ser tratado como implementacao incompleta.