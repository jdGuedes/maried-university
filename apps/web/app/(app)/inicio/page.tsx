import { Alert, EmptyState } from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import { ModuleCard, Panel, StatusBadge } from "@/components/ui";
import { requireServerAccessContext } from "@/lib/access/session-context";
import { moduleStateShowcase, navigationItems } from "@/lib/modules/navigation";

export default async function InicioPage() {
  const access = await requireServerAccessContext();
  const displayName = access.user.fullName ?? access.user.email ?? "Usuaria MARIED";
  const tenantName = access.tenant.tradeName ?? access.tenant.name;
  const moduleCards = navigationItems.filter((item) => item.id !== "inicio" && item.id !== "minha-conta" && item.id !== "minha-assinatura");

  return (
    <div className="app-page-grid">
      <PageHeader eyebrow="Dashboard estrutural" title={`Bem-vinda, ${displayName}`} actions={<StatusBadge tone="success">Tenant ativo</StatusBadge>} />

      <Panel className="dashboard-hero">
        <div>
          <h1>Casa principal da MARIED UNIVERSITY</h1>
          <p>
            Este ambiente confirma seu acesso a {tenantName} e organiza as portas dos modulos futuros sem criar dados, metricas ou funcionalidades ainda nao aprovadas.
          </p>
        </div>
        <Alert title="Estrutura autenticada" tone="info">
          A autorizacao continua no servidor. Os estados visuais abaixo nao substituem RLS, sessao ou validacao de vinculo.
        </Alert>
      </Panel>

      <section className="dashboard-section" aria-labelledby="modulos-title">
        <div className="dashboard-section-heading">
          <h2 id="modulos-title">Modulos previstos</h2>
          <p>Portas estruturais para as proximas entregas, sem regra interna implementada.</p>
        </div>
        <div className="module-grid">
          {moduleCards.map((item) => (
            <ModuleCard key={item.id} description={item.description} href={item.href} state={item.state} title={item.label} />
          ))}
        </div>
      </section>

      <section className="dashboard-section" aria-labelledby="estados-title">
        <div className="dashboard-section-heading">
          <h2 id="estados-title">Estados oficiais</h2>
          <p>Vocabulario unico para representar disponibilidade sem prometer upgrade, compra ou acesso indevido.</p>
        </div>
        <div className="state-grid">
          {moduleStateShowcase.map((state) => (
            <Panel as="article" className="state-card" key={state.id}>
              <StatusBadge tone={state.id === "AVAILABLE" ? "success" : state.id === "LOCKED" ? "danger" : state.id === "MAINTENANCE" ? "info" : state.id === "DISABLED" ? "neutral" : "warning"}>{state.title}</StatusBadge>
              <p>{state.description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <EmptyState title="Sem metricas simuladas">
        Quando nao houver dados reais, a area autenticada apresenta orientacao, estados e links seguros em vez de graficos, vendas ou contadores inventados.
      </EmptyState>
    </div>
  );
}