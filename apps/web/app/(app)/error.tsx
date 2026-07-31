"use client";

import { Alert } from "@/components/feedback";
import { Panel } from "@/components/ui";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="app-page-grid">
      <Panel className="module-status-panel">
        <h1>Nao foi possivel carregar esta area</h1>
        <p>O ambiente autenticado preservou o contexto seguro. Tente novamente.</p>
        <Alert title="Falha controlada" tone="danger">
          Nenhum dado sensivel e exibido neste estado de erro.
        </Alert>
        <button className="module-card-action" onClick={reset} type="button">
          Tentar novamente
        </button>
      </Panel>
    </div>
  );
}