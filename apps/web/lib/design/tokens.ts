export const designTokenGroups = {
  colors: [
    "brand.primary",
    "brand.primaryStrong",
    "brand.secondary",
    "brand.copper",
    "brand.tech",
    "surface.base",
    "surface.raised",
    "text.primary",
    "text.secondary",
    "state.success",
    "state.info",
    "state.warning",
    "state.danger"
  ],
  radii: ["sm", "md", "lg", "xl", "2xl", "full"],
  spacing: ["1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20"],
  motion: ["fast", "base", "panel"]
} as const;

export const brandColorStatus = {
  source: "references/v1/15_brand_kit.jpeg",
  status: "APPROXIMATED_FROM_OFFICIAL_REFERENCE",
  pending: "Fine extraction and visual measurement must be validated in browser screenshots before later visual deliveries."
} as const;
