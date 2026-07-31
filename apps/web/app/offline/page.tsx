"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui";

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <section className="offline-panel" aria-labelledby="offline-title">
        <div className="offline-mark" aria-hidden="true">
          <WifiOff size={32} />
        </div>
        <div className="offline-copy">
          <p className="offline-kicker">Modo offline</p>
          <h1 id="offline-title">Voce esta sem conexao</h1>
          <p>Recursos que dependem do servidor nao estao disponiveis agora. Nenhum dado autenticado foi salvo para uso offline.</p>
        </div>
        <div className="offline-actions">
          <Button type="button" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
          <Link className="auth-link" href="/login">
            Voltar ao acesso
          </Link>
        </div>
      </section>
    </main>
  );
}