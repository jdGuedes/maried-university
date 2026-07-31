export type BrandAssetRole = "brand-kit" | "splash-reference" | "login-reference";
export type ProductionAssetStatus = "REFERENCE_ONLY" | "PENDING_EXTRACTION" | "READY";

export type BrandReferenceAsset = {
  fileName: string;
  path: string;
  role: BrandAssetRole;
  status: ProductionAssetStatus;
};

export type PlannedProductionAsset = {
  id: "logo-primary" | "logo-horizontal" | "mark-m" | "favicon" | "pwa-icon-maskable" | "pwa-icon-512";
  source: string;
  status: ProductionAssetStatus;
  notes: string;
};

export const brandReferenceAssets: BrandReferenceAsset[] = [
  {
    fileName: "15_brand_kit.jpeg",
    path: "references/v1/15_brand_kit.jpeg",
    role: "brand-kit",
    status: "REFERENCE_ONLY"
  },
  {
    fileName: "16_splash.jpeg",
    path: "references/v1/16_splash.jpeg",
    role: "splash-reference",
    status: "REFERENCE_ONLY"
  },
  {
    fileName: "17_login.jpeg",
    path: "references/v1/17_login.jpeg",
    role: "login-reference",
    status: "REFERENCE_ONLY"
  }
];

export const plannedProductionAssets: PlannedProductionAsset[] = [
  {
    id: "logo-primary",
    source: "references/v1/15_brand_kit.jpeg",
    status: "PENDING_EXTRACTION",
    notes: "Logo principal para telas de autenticacao; nao extraido na Entrega A para evitar edicao visual nao validada."
  },
  {
    id: "logo-horizontal",
    source: "references/v1/15_brand_kit.jpeg",
    status: "PENDING_EXTRACTION",
    notes: "Logo horizontal para shell; depende de extracao e revisao visual."
  },
  {
    id: "mark-m",
    source: "references/v1/15_brand_kit.jpeg",
    status: "PENDING_EXTRACTION",
    notes: "Marca compacta M para splash, favicon e PWA."
  },
  {
    id: "favicon",
    source: "mark-m",
    status: "PENDING_EXTRACTION",
    notes: "Gerar somente apos validar a marca compacta."
  },
  {
    id: "pwa-icon-maskable",
    source: "mark-m",
    status: "PENDING_EXTRACTION",
    notes: "Icone maskable para manifest; nao usar placeholder."
  },
  {
    id: "pwa-icon-512",
    source: "mark-m",
    status: "PENDING_EXTRACTION",
    notes: "Icone 512px para PWA; nao usar placeholder."
  }
];
