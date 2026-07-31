import { Alert } from "@/components/feedback";
import { Panel, StatusBadge } from "@/components/ui";

export default function AcessoNegadoPage() {
  return (
    <main className="maried-shell-preview">
      <div className="mx-auto grid min-h-[70vh] w-full max-w-xl place-items-center">
        <Panel className="grid gap-4 p-7">
          <StatusBadge tone="danger">Acesso bloqueado</StatusBadge>
          <h1 className="m-0 text-3xl font-semibold text-[var(--maried-color-text-primary)]">Nao foi possivel validar seu acesso</h1>
          <Alert title="Mensagem segura" tone="warning">
            Seu acesso esta inativo ou indisponivel. Entre em contato com o suporte.
          </Alert>
        </Panel>
      </div>
    </main>
  );
}
