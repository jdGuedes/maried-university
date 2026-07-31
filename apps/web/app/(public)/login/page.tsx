import { ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { Alert } from "@/components/feedback";
import { Panel, StatusBadge } from "@/components/ui";

export default function LoginPlaceholderPage() {
  return (
    <main className="maried-shell-preview">
      <div className="mx-auto grid min-h-[70vh] w-full max-w-xl place-items-center">
        <Panel className="grid gap-6 p-7 text-center">
          <LogoMark />
          <div>
            <StatusBadge tone="warning">Entrega C</StatusBadge>
            <h1 className="mt-4 text-3xl font-semibold text-[var(--maried-color-text-primary)]">Login ainda nao implementado</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--maried-color-text-secondary)]">
              A Entrega B prepara a sessao server-side e a protecao de rotas. O formulario oficial de login fica na Entrega C.
            </p>
          </div>
          <Alert title="Protecao ativa" tone="info">
            Rotas autenticadas sem sessao validada no servidor redirecionam para esta entrada segura.
          </Alert>
          <ShieldCheck aria-hidden="true" className="mx-auto text-[var(--maried-color-info)]" size={28} />
        </Panel>
      </div>
    </main>
  );
}
