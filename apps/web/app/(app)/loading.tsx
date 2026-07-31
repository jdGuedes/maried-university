import { Spinner } from "@/components/feedback";
import { Panel } from "@/components/ui";

export default function AppLoading() {
  return (
    <div className="app-page-grid">
      <Panel className="module-status-panel" role="status" aria-live="polite">
        <Spinner />
        <h1>Carregando ambiente</h1>
        <p>A MARIED UNIVERSITY esta validando a estrutura da area autenticada.</p>
      </Panel>
    </div>
  );
}