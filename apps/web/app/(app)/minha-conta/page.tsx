import { Alert } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { Panel, StatusBadge } from "@/components/ui";
import { requireServerAccessContext } from "@/lib/access/session-context";

export default async function MinhaContaPage() {
  const access = await requireServerAccessContext();
  const displayName = access.user.fullName ?? "Nome ainda nao informado";
  const email = access.user.email ?? "E-mail indisponivel";

  return (
    <div className="app-page-grid">
      <PageHeader eyebrow="Minha Conta" title="Dados basicos da usuaria" actions={<StatusBadge tone="success">Visualizacao segura</StatusBadge>} />
      <Panel className="account-panel">
        <dl className="account-list">
          <div>
            <dt>Nome</dt>
            <dd>{displayName}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{email}</dd>
          </div>
          <div>
            <dt>Status do acesso</dt>
            <dd>Acesso validado no servidor</dd>
          </div>
        </dl>
        <Alert title="Edicao nao disponivel nesta entrega" tone="info">
          Alteracao de e-mail, avatar, tenant, role, vinculo ou exclusao de conta nao foram implementadas na Entrega D.
        </Alert>
      </Panel>
    </div>
  );
}