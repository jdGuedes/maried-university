import { ShieldCheck } from "lucide-react";
import { Alert } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Panel, StatusBadge } from "@/components/ui";
import { requireServerAccessContext } from "@/lib/access/session-context";

export default async function InicioPage() {
  const access = await requireServerAccessContext();
  const displayName = access.user.fullName ?? access.user.email ?? "Usuaria MARIED";
  const tenantName = access.tenant.tradeName ?? access.tenant.name;

  return (
    <main className="maried-shell-preview">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <PageHeader
          eyebrow="Acesso validado no servidor"
          title="Contexto seguro carregado"
          actions={<StatusBadge tone="success">Entrega B</StatusBadge>}
        />
        <Panel className="grid gap-5 p-7">
          <div className="flex flex-wrap items-center gap-3">
            <ShieldCheck aria-hidden="true" className="text-[var(--maried-color-success)]" size={24} />
            <StatusBadge tone="info">Sessao server-side</StatusBadge>
            <StatusBadge tone="success">Tenant ativo</StatusBadge>
          </div>
          <div className="grid gap-3 text-sm text-[var(--maried-color-text-secondary)]">
            <p className="m-0">
              Usuario: <strong className="text-[var(--maried-color-text-primary)]">{displayName}</strong>
            </p>
            <p className="m-0">
              Empresa: <strong className="text-[var(--maried-color-text-primary)]">{tenantName}</strong>
            </p>
            <p className="m-0">
              Papel: <strong className="text-[var(--maried-color-text-primary)]">{access.role}</strong>
            </p>
          </div>
          <Alert title="Sem autoridade no navegador" tone="info">
            Esta rota existe para validar a Entrega B. Login visual, logout e dashboard funcional ficam para as proximas entregas.
          </Alert>
        </Panel>
      </div>
    </main>
  );
}
