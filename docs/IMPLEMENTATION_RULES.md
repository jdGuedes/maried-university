# Implementation Rules - MARIED UNIVERSITY

Este documento centraliza regras permanentes para executar entregas do projeto. Ele complementa, sem substituir, `CODEX_EXECUTION_PROTOCOL.md`, `SECURITY_POLICY.md`, SPECs, ADRs e logs de implementacao.

## 1. Leitura Obrigatoria

Antes de implementar, ler:

- `PROJECT.md`;
- `docs/PROJECT_STATE.md` quando existir;
- SPEC vigente;
- ADRs aplicaveis;
- `SECURITY_POLICY.md`;
- `CODEX_EXECUTION_PROTOCOL.md`;
- `FRONTEND_DESIGN_SYSTEM.md` quando houver frontend;
- logs de entregas anteriores;
- codigo e testes impactados.

## 2. Auditoria

Toda entrega deve comecar com auditoria do estado real:

- branch;
- HEAD;
- working tree;
- diff atual;
- arquivos e contratos reutilizaveis;
- riscos herdados;
- scripts reais.

Nao iniciar implementacao funcional com `NOT READY`.

## 3. Documentacao Continua

Criar ou atualizar implementation log antes da primeira alteracao funcional. Atualizar durante a execucao, nao apenas no final.

O log nao deve conter senhas, tokens, cookies, chaves, credenciais, dados pessoais reais ou cadeia de pensamento privada.

## 4. Evidencia

Resultado so pode ser declarado quando houver evidencia real:

- arquivo lido ou alterado;
- comando executado;
- teste aprovado/reprovado;
- diff revisado;
- screenshot/artefato quando aplicavel;
- risco registrado quando nao validado.

Nao inventar resultados, hashes, metricas, testes ou commits.

## 5. Testes e Gates

Executar os scripts reais disponiveis. Quando um script esperado nao existir, registrar `NAO DISPONIVEL` e nao inventar script.

Preencher:

- Security Gate para qualquer mudanca relevante;
- Frontend Gate para qualquer mudanca visual ou UX;
- Definition of Done ao final.

## 6. Seguranca

Regras permanentes:

- autorizacao sensivel no servidor;
- frontend nunca substitui RLS ou validacao de acesso;
- service role, secret keys e credenciais nunca entram no cliente;
- nao usar credenciais reais em testes sem autorizacao explicita;
- nao aplicar migrations remotas sem autorizacao explicita;
- nao executar operacoes remotas de escrita fora do escopo autorizado.

## 7. Controle de Versao

Antes do commit:

- `git status --short --untracked-files=all`;
- `git diff --check`;
- `git diff --stat`;
- `git diff --name-only`;
- revisao do diff completo;
- varredura de segredos;
- confirmacao de arquivos no escopo.

Commit e push devem respeitar autorizacao expressa do Goal. Nunca executar push force, merge, tag, release ou deploy sem autorizacao expressa.

## 8. Paradas Obrigatorias

Parar e reportar bloqueio real quando houver:

- conflito documental insolvel;
- risco de perda de dados;
- necessidade de segredo ou credencial nao disponivel;
- necessidade de alteracao remota nao autorizada;
- necessidade de migration fora do escopo;
- necessidade de Stripe, OAuth, deploy ou regra de produto nao aprovada;
- impossibilidade de validar seguranca essencial;
- vulnerabilidade critica introduzida pela entrega.

## 9. Encerramento

Ao final:

- atualizar `CHANGELOG.md`;
- atualizar `docs/PROJECT_STATE.md`;
- concluir implementation log;
- registrar gates e validacoes;
- revisar diff;
- criar commit autorizado;
- fazer push autorizado;
- confirmar working tree final;
- entregar bloco `CONTEXTO PARA O PROXIMO GOAL`.