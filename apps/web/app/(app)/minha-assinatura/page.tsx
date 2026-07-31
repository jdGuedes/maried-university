import { Alert } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Panel, StatusBadge } from "@/components/ui";
import { requireServerAccessContext } from "@/lib/access/session-context";

export default async function MinhaAssinaturaPage() {
  const access = await requireServerAccessContext();
  const tenantName = access.tenant.tradeName ?? access.tenant.name;

  return (
    <div className="app-page-grid">
      <PageHeader eyebrow="Minha Assinatura" title="Estrutura de acesso e plano" actions={<StatusBadge tone="warning">Sem cobranca</StatusBadge>} />
      <Panel className="subscription-panel">
        <h1>{tenantName}</h1>
        <p>
          Esta area prepara a futura apresentacao de plano e modulos contratados. Nenhuma cobranca, checkout, upgrade ou integracao Stripe foi implementada.
        </p>
        <div className="state-grid">
          <Panel as="article" className="state-card">
            <StatusBadge tone="success">Conta ativa</StatusBadge>
            <p>O acesso atual foi validado pelo servidor antes de renderizar esta pagina.</p>
          </Panel>
          <Panel as="article" className="state-card">
            <StatusBadge tone="danger">Upgrade bloqueado</StatusBadge>
            <p>Compra, alteracao de plano e billing dependem de entrega futura especifica.</p>
          </Panel>
        </div>
        <Alert title="Stripe fora do escopo" tone="warning">
          Esta pagina nao consulta, cria ou altera clientes, assinaturas, pagamentos ou portal de cobranca.
        </Alert>
      </Panel>
    </div>
  );
}