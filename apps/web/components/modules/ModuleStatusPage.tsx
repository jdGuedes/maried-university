import { Alert, EmptyState } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Panel, StatusBadge } from "@/components/ui";
import { moduleStateLabels, type ModuleState } from "@/lib/modules/navigation";

export function ModuleStatusPage({ description, state, title }: { description: string; state: ModuleState; title: string }) {
  const tone = state === "AVAILABLE" ? "success" : state === "LOCKED" ? "danger" : state === "MAINTENANCE" ? "info" : state === "DISABLED" ? "neutral" : "warning";

  return (
    <div className="app-page-grid">
      <PageHeader eyebrow="Modulo estrutural" title={title} actions={<StatusBadge tone={tone}>{moduleStateLabels[state]}</StatusBadge>} />
      <Panel className="module-status-panel">
        <h1>{title}</h1>
        <p>{description}</p>
        <Alert title="Funcionalidade futura" tone="warning">
          Esta porta existe para navegacao e planejamento. Nenhuma regra interna do modulo foi implementada nesta entrega.
        </Alert>
      </Panel>
      <EmptyState title="Sem dados simulados">
        Dados, graficos, calculos e cadastros reais serao adicionados somente em entregas futuras aprovadas.
      </EmptyState>
    </div>
  );
}