export type ModuleState = "COMING_SOON" | "AVAILABLE" | "LOCKED" | "DISABLED" | "MAINTENANCE";

export type NavigationItem = {
  id: "inicio" | "precificacao" | "estoque" | "fornecedores" | "minicursos" | "minha-assinatura" | "minha-conta";
  label: string;
  href: string;
  state: ModuleState;
};

export const navigationItems: NavigationItem[] = [
  { id: "inicio", label: "Inicio", href: "/", state: "AVAILABLE" },
  { id: "precificacao", label: "Precificacao", href: "/precificacao", state: "COMING_SOON" },
  { id: "estoque", label: "Estoque", href: "/estoque", state: "COMING_SOON" },
  { id: "fornecedores", label: "Fornecedores", href: "/fornecedores", state: "COMING_SOON" },
  { id: "minicursos", label: "Minicursos", href: "/minicursos", state: "COMING_SOON" },
  { id: "minha-assinatura", label: "Minha assinatura", href: "/minha-assinatura", state: "LOCKED" },
  { id: "minha-conta", label: "Minha conta", href: "/minha-conta", state: "LOCKED" }
];

export const featureFlags = {
  FEATURE_PRICING: false,
  FEATURE_STOCK: false,
  FEATURE_SUPPLIERS: false,
  FEATURE_COURSES: false,
  FEATURE_SUBSCRIPTION: false,
  FEATURE_ADMIN: false
} as const;
