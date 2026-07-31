"use client";

import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui";

type PWAUpdatePromptProps = {
  activating?: boolean;
  version?: string;
  onUpdate: () => void;
  onDismiss: () => void;
};

export function PWAUpdatePrompt({ activating = false, version, onUpdate, onDismiss }: PWAUpdatePromptProps) {
  return (
    <section aria-label="Atualizacao disponivel" className="pwa-card pwa-card--update">
      <div className="pwa-card__icon" aria-hidden="true">
        <RefreshCw size={18} />
      </div>
      <div className="pwa-card__content">
        <h2>Atualizacao disponivel</h2>
        <p>{version ? `Nova versao pronta: ${version}.` : "Uma nova versao esta pronta."} Atualize quando estiver seguro recarregar a tela.</p>
        <div className="pwa-card__actions">
          <Button disabled={activating} size="sm" onClick={onUpdate} type="button">
            <RefreshCw aria-hidden="true" size={16} />
            {activating ? "Atualizando" : "Atualizar"}
          </Button>
          <Button aria-label="Adiar atualizacao" disabled={activating} size="sm" variant="ghost" onClick={onDismiss} type="button">
            <X aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}