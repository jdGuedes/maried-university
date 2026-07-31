import { Download } from "lucide-react";
import { Button, Panel } from "@/components/ui";

export function PWAInstallPrompt() {
  return (
    <Panel as="article" className="p-5">
      <div className="flex items-start gap-3">
        <Download aria-hidden="true" className="mt-1 text-[var(--maried-color-brand-primary)]" size={20} />
        <div className="grid gap-3">
          <div>
            <h3 className="m-0 text-base font-semibold text-[var(--maried-color-text-primary)]">Instalacao PWA</h3>
            <p className="m-0 mt-1 text-sm leading-6 text-[var(--maried-color-text-secondary)]">Contrato visual para prompt futuro, sem acionar instalacao nesta entrega.</p>
          </div>
          <Button disabled size="sm" variant="secondary">Instalar depois</Button>
        </div>
      </div>
    </Panel>
  );
}
