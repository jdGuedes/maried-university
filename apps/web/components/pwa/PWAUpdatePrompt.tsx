import { RefreshCw } from "lucide-react";
import { Button, Panel } from "@/components/ui";

export function PWAUpdatePrompt() {
  return (
    <Panel as="article" className="p-5">
      <div className="flex items-start gap-3">
        <RefreshCw aria-hidden="true" className="mt-1 text-[var(--maried-color-info)]" size={20} />
        <div className="grid gap-3">
          <div>
            <h3 className="m-0 text-base font-semibold text-[var(--maried-color-text-primary)]">Atualizacao disponivel</h3>
            <p className="m-0 mt-1 text-sm leading-6 text-[var(--maried-color-text-secondary)]">Contrato visual para atualizacao futura sem service worker funcional nesta entrega.</p>
          </div>
          <Button disabled size="sm" variant="secondary">Atualizar depois</Button>
        </div>
      </div>
    </Panel>
  );
}
