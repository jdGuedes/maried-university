import { Alert } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { PricingCalculatorForm } from "@/components/pricing";
import { Panel, StatusBadge } from "@/components/ui";

export default function Page() {
  return (
    <div className="app-page-grid">
      <PageHeader eyebrow="Precificador Inteligente" title="Gerar preco inicial" actions={<StatusBadge tone="info">Calculo server-side</StatusBadge>} />

      <Panel className="module-status-panel">
        <div>
          <h1>Calculadora guiada de preco</h1>
          <p>
            Informe os custos da peca, escolha o modo de precificacao e gere um resultado oficial validado no servidor. Historico, edicao e comparacao completa ficam para as proximas entregas da SPEC-003.
          </p>
        </div>
        <Alert title="Backend First preservado" tone="info">
          A tela nao envia tenant, papel, lucro calculado ou margem calculada como autoridade. O servidor valida sessao, tenant, papel, perfil comercial ativo e executa o motor oficial.
        </Alert>
      </Panel>

      <PricingCalculatorForm />
    </div>
  );
}
