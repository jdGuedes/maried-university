export type ModuleState = "AVAILABLE" | "LOCKED" | "COMING_SOON" | "DISABLED" | "MAINTENANCE";

export type NavigationItemId =
  | "inicio"
  | "precificacao"
  | "estoque"
  | "fornecedores"
  | "minicursos"
  | "minha-assinatura"
  | "minha-conta";

export type NavigationItem = {
  id: NavigationItemId;
  label: string;
  href: string;
  state: ModuleState;
  description: string;
  shortLabel?: string;
};

export const moduleStateLabels: Record<ModuleState, string> = {
  AVAILABLE: "Disponivel",
  LOCKED: "Bloqueado",
  COMING_SOON: "Em breve",
  DISABLED: "Desativado",
  MAINTENANCE: "Manutencao"
};

export const moduleStateDescriptions: Record<ModuleState, string> = {
  AVAILABLE: "Acesso estrutural permitido para a area autenticada.",
  LOCKED: "Recurso indisponivel para o acesso atual, sem prometer compra ou upgrade.",
  COMING_SOON: "Modulo previsto oficialmente, ainda sem funcionalidade interna.",
  DISABLED: "Recurso desativado de forma controlada e sem parecer erro tecnico.",
  MAINTENANCE: "Recurso temporariamente indisponivel, preservando contexto seguro."
};

export const navigationItems: NavigationItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    shortLabel: "Inicio",
    href: "/inicio",
    state: "AVAILABLE",
    description: "Dashboard estrutural da area autenticada."
  },
  {
    id: "precificacao",
    label: "Precificador Inteligente",
    shortLabel: "Preco",
    href: "/precificacao",
    state: "COMING_SOON",
    description: "Porta estrutural para precificacao futura, sem calculos implementados."
  },
  {
    id: "estoque",
    label: "Estoque",
    shortLabel: "Estoque",
    href: "/estoque",
    state: "COMING_SOON",
    description: "Porta estrutural para controle de estoque futuro, sem dados funcionais."
  },
  {
    id: "fornecedores",
    label: "Fornecedores",
    shortLabel: "Fornec.",
    href: "/fornecedores",
    state: "COMING_SOON",
    description: "Porta estrutural para fornecedores futuros, sem cadastro funcional."
  },
  {
    id: "minicursos",
    label: "Minicursos",
    shortLabel: "Cursos",
    href: "/minicursos",
    state: "COMING_SOON",
    description: "Porta estrutural para minicursos futuros, sem conteudo publicado."
  },
  {
    id: "minha-assinatura",
    label: "Minha Assinatura",
    shortLabel: "Plano",
    href: "/minha-assinatura",
    state: "AVAILABLE",
    description: "Estrutura informativa da assinatura, sem Stripe ou checkout."
  },
  {
    id: "minha-conta",
    label: "Minha Conta",
    shortLabel: "Conta",
    href: "/minha-conta",
    state: "AVAILABLE",
    description: "Estrutura segura dos dados basicos da conta."
  }
];

export const moduleStateShowcase: Array<{ id: ModuleState; title: string; description: string }> = [
  { id: "AVAILABLE", title: moduleStateLabels.AVAILABLE, description: moduleStateDescriptions.AVAILABLE },
  { id: "LOCKED", title: moduleStateLabels.LOCKED, description: moduleStateDescriptions.LOCKED },
  { id: "COMING_SOON", title: moduleStateLabels.COMING_SOON, description: moduleStateDescriptions.COMING_SOON },
  { id: "DISABLED", title: moduleStateLabels.DISABLED, description: moduleStateDescriptions.DISABLED },
  { id: "MAINTENANCE", title: moduleStateLabels.MAINTENANCE, description: moduleStateDescriptions.MAINTENANCE }
];

export const featureFlags = {
  FEATURE_PRICING: false,
  FEATURE_STOCK: false,
  FEATURE_SUPPLIERS: false,
  FEATURE_COURSES: false,
  FEATURE_SUBSCRIPTION_BILLING: false,
  FEATURE_ADMIN: false
} as const;

export function getNavigationItemByHref(pathname: string) {
  return navigationItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

export function isNavigationItemActive(pathname: string, item: NavigationItem) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function canNavigateToModule(item: NavigationItem) {
  return item.state === "AVAILABLE";
}