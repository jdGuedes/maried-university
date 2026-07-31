"use client";

import { Download, X } from "lucide-react";
import { Button } from "@/components/ui";

type PWAInstallPromptProps = {
  onInstall: () => void;
  onDismiss: () => void;
};

export function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  return (
    <section aria-label="Instalar aplicativo" className="pwa-card">
      <div className="pwa-card__icon" aria-hidden="true">
        <Download size={18} />
      </div>
      <div className="pwa-card__content">
        <h2>Instalar MARIED</h2>
        <p>Abra a plataforma em modo aplicativo quando este dispositivo oferecer suporte.</p>
        <div className="pwa-card__actions">
          <Button size="sm" onClick={onInstall} type="button">
            <Download aria-hidden="true" size={16} />
            Instalar
          </Button>
          <Button aria-label="Fechar aviso de instalacao" size="sm" variant="ghost" onClick={onDismiss} type="button">
            <X aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}