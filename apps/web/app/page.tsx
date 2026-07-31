import { ArrowRight, Boxes, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { Alert, EmptyState, ErrorState, OfflineState, Skeleton, Spinner, SuccessState, Toast } from "@/components/feedback";
import { Button, Checkbox, Drawer, Field, FormMessage, IconButton, Input, Modal, ModuleCard, Panel, PasswordInput, StatusBadge } from "@/components/ui";
import { brandReferenceAssets, plannedProductionAssets } from "@/lib/design/brand-assets";
import { designTokenGroups, brandColorStatus } from "@/lib/design/tokens";
import { AppShellFrame, MobileNavigation, PageHeader, Sidebar, Topbar } from "@/components/layout";
import { PWAInstallPrompt, PWAUpdatePrompt } from "@/components/pwa";
import { featureFlags, navigationItems } from "@/lib/modules/navigation";

export default function Home() {
  return (
    <main className="maried-shell-preview">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 rounded-[var(--maried-radius-2xl)] border border-[var(--maried-color-border-subtle)] bg-white/42 p-5 shadow-[var(--maried-shadow-soft)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <LogoMark />
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone="info">SPEC-002</StatusBadge>
            <StatusBadge tone="warning">Entrega A</StatusBadge>
            <IconButton icon={ShieldCheck} label="Seguranca backend first considerada" />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <Panel className="flex min-h-[28rem] flex-col justify-between p-7 md:p-9">
            <div>
              <StatusBadge tone="success">Fundacao frontend autorizada</StatusBadge>
              <h1 className="mt-6 max-w-3xl font-[var(--maried-font-display)] text-4xl font-semibold leading-tight text-[var(--maried-color-text-primary)] md:text-5xl">
                Tokens, assets e estrutura global para a MARIED UNIVERSITY.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--maried-color-text-secondary)] md:text-lg">
                Esta entrega prepara a base visual e tecnica antes de autenticacao funcional, App Shell autenticado, PWA completa ou modulos de negocio.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button>
                Revisar fundacao <ArrowRight aria-hidden="true" size={18} />
              </Button>
              <Button variant="secondary">Ver tokens</Button>
            </div>
          </Panel>

          <Panel className="bg-[image:var(--maried-gradient-tech)] p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="m-0 text-sm font-semibold text-[var(--maried-color-text-secondary)]">Brand Kit</p>
                <h2 className="m-0 mt-1 text-2xl font-semibold">Assets oficiais</h2>
              </div>
              <Sparkles aria-hidden="true" className="text-[var(--maried-color-brand-primary)]" size={26} />
            </div>
            <div className="mt-6 grid gap-3">
              {brandReferenceAssets.map((asset) => (
                <div key={asset.fileName} className="flex items-center justify-between rounded-[var(--maried-radius-lg)] border border-[var(--maried-color-border-subtle)] bg-white/45 px-4 py-3">
                  <span className="text-sm font-medium">{asset.fileName}</span>
                  <StatusBadge>referencia</StatusBadge>
                </div>
              ))}
            </div>
            <Alert title="Status das cores" tone="warning">
              {brandColorStatus.status}. A medicao fina permanece pendente para as proximas telas visuais.
            </Alert>
            <div className="mt-4 grid gap-2">
              {plannedProductionAssets.slice(0, 3).map((asset) => (
                <div key={asset.id} className="flex items-center justify-between gap-3 rounded-[var(--maried-radius-lg)] bg-white/35 px-3 py-2">
                  <span className="text-xs font-semibold text-[var(--maried-color-text-primary)]">{asset.id}</span>
                  <StatusBadge tone="warning">pendente</StatusBadge>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel as="article">
            <Boxes aria-hidden="true" className="text-[var(--maried-color-brand-primary)]" />
            <h2 className="mt-4 text-xl font-semibold">Componentes-base</h2>
            <p className="text-sm leading-6 text-[var(--maried-color-text-secondary)]">
              Button, IconButton, Input, PasswordInput, Field, FormMessage, Checkbox, Panel, StatusBadge, ModuleCard, Modal, Drawer, Toast, Alert, Spinner, Skeleton, EmptyState, ErrorState, OfflineState, SuccessState, LogoMark, prompts PWA e contratos de AppShell preparados como base reutilizavel.
            </p>
          </Panel>
          <Panel as="article">
            <ShieldCheck aria-hidden="true" className="text-[var(--maried-color-info)]" />
            <h2 className="mt-4 text-xl font-semibold">Sem autoridade no browser</h2>
            <p className="text-sm leading-6 text-[var(--maried-color-text-secondary)]">
              Feature flags e estados de modulo existem apenas como contratos visuais. Autorizacao real fica para backend nas proximas entregas.
            </p>
          </Panel>
          <Panel as="article">
            <Clock3 aria-hidden="true" className="text-[var(--maried-color-warning)]" />
            <h2 className="mt-4 text-xl font-semibold">Modulos futuros</h2>
            <p className="text-sm leading-6 text-[var(--maried-color-text-secondary)]">
              Precificacao, Estoque, Fornecedores e Minicursos seguem em preparacao, sem regra funcional implementada nesta etapa.
            </p>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel>
            <h2 className="text-xl font-semibold">Tokens centralizados</h2>
            <div className="mt-5 grid gap-3">
              {Object.entries(designTokenGroups).map(([group, values]) => (
                <div key={group} className="rounded-[var(--maried-radius-lg)] border border-[var(--maried-color-border-subtle)] bg-white/40 p-4">
                  <p className="m-0 text-sm font-semibold capitalize">{group}</p>
                  <p className="m-0 mt-1 text-sm text-[var(--maried-color-text-secondary)]">{values.length} tokens documentados</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <h2 className="text-xl font-semibold">Navegacao estrutural</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {navigationItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-[var(--maried-radius-lg)] border border-[var(--maried-color-border-subtle)] bg-white/40 px-4 py-3">
                  <span className="text-sm font-medium">{item.label}</span>
                  <StatusBadge tone={item.state === "AVAILABLE" ? "success" : item.state === "LOCKED" ? "danger" : "warning"}>{item.state}</StatusBadge>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <Panel>
          <AppShellFrame sidebar={<Sidebar items={navigationItems} />} topbar={<Topbar />} mobileNavigation={<MobileNavigation items={navigationItems} />}>
            <div className="grid gap-5">
              <PageHeader eyebrow="Preview estrutural" title="Shell unico da usuaria final" actions={<StatusBadge tone="warning">sem auth funcional</StatusBadge>} />
              <div className="grid gap-4 lg:grid-cols-2">
                <ModuleCard description="Destino estrutural preparado sem regra de precificacao." state="COMING_SOON" title="Precificacao" />
                <ModuleCard description="Destino estrutural preparado sem dados de estoque." state="COMING_SOON" title="Estoque" />
              </div>
            </div>
          </AppShellFrame>
        </Panel>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Panel>
            <h2 className="text-xl font-semibold">Formulario estrutural</h2>
            <div className="mt-5 grid gap-4">
              <Field description="Exemplo visual sem envio, Supabase ou autenticacao funcional." htmlFor="foundation-email" label="E-mail">
                <Input id="foundation-email" placeholder="nome@empresa.com" type="email" />
              </Field>
              <Checkbox label="Manter sessao neste dispositivo" disabled />
              <FormMessage tone="neutral">Validacao final e envio seguro ficam para as Entregas B e C.</FormMessage>
            </div>
          </Panel>
          <Panel>
            <h2 className="text-xl font-semibold">Estados de entrada</h2>
            <div className="mt-5 grid gap-4">
              <Field error="Mensagem de erro segura e objetiva." htmlFor="foundation-error" label="Campo com erro">
                <PasswordInput id="foundation-error" invalid placeholder="Senha protegida" />
              </Field>
              <FormMessage tone="success">Mensagem de sucesso estrutural preparada.</FormMessage>
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <ErrorState title="Erro recuperavel">
            Falhas devem orientar a usuaria sem revelar detalhes internos.
          </ErrorState>
          <OfflineState title="Sem conexao">
            Estado estrutural preparado sem cache de dados sensiveis.
          </OfflineState>
          <SuccessState title="Acao concluida">
            Feedback positivo padronizado para fluxos futuros.
          </SuccessState>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Modal title="Modal estrutural">
            Camada visual unica para decisoes curtas. Nao ha abertura real de overlay nesta entrega.
          </Modal>
          <Drawer title="Drawer estrutural">
            Contrato visual para contexto complementar, sem drawer funcional ou sobreposicao ativa.
          </Drawer>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Toast title="Toast estrutural">Feedback global preparado sem fila ou provider nesta entrega.</Toast>
          <PWAInstallPrompt />
          <PWAUpdatePrompt />
        </section>

        <Panel>
          <div className="grid gap-5 md:grid-cols-3">
            <EmptyState title="Estado vazio">
              Mensagens estruturais existem sem simular dados reais ou acesso liberado.
            </EmptyState>
            <div className="rounded-[var(--maried-radius-xl)] border border-[var(--maried-color-border-subtle)] bg-white/35 p-6">
              <div className="flex items-center gap-3">
                <Spinner />
                <span className="text-sm font-semibold">Carregamento acessivel</span>
              </div>
              <div className="mt-5 grid gap-3">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            </div>
            <div className="rounded-[var(--maried-radius-xl)] border border-[var(--maried-color-border-subtle)] bg-white/35 p-6">
              <p className="m-0 text-sm font-semibold">Feature flags estruturais</p>
              <pre className="mt-3 overflow-auto rounded-[var(--maried-radius-md)] bg-white/55 p-3 text-xs text-[var(--maried-color-text-secondary)]">{JSON.stringify(featureFlags, null, 2)}</pre>
            </div>
          </div>
        </Panel>
      </div>
    </main>
  );
}
