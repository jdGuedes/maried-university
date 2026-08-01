import type { CommercialProfileInput } from "./contracts";

export const commercialProfileKeys = ["PIX", "CARD", "RESELLER", "WHOLESALE", "MARKETPLACE", "CUSTOM"] as const;

export const defaultCommercialProfiles: CommercialProfileInput[] = [
  createCommercialProfile("PIX", "Pix"),
  createCommercialProfile("CARD", "Cartao"),
  createCommercialProfile("RESELLER", "Revendedora"),
  createCommercialProfile("WHOLESALE", "Atacado"),
  createCommercialProfile("MARKETPLACE", "Marketplace"),
  createCommercialProfile("CUSTOM", "Personalizado")
];

export function createCommercialProfile(key: CommercialProfileInput["key"], name: string): CommercialProfileInput {
  return {
    key,
    name,
    isActive: true,
    fixedFee: 0n,
    taxPercent: 0n,
    commissionPercent: 0n,
    discountPercent: 0n,
    taxesPercent: 0n,
    marketplacePercent: 0n,
    roundingRule: "NONE"
  };
}
