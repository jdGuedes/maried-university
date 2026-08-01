import type {
  ApprovedPriceInput,
  CommercialProfileInput,
  FreightInput,
  LossInput,
  MoneyCents,
  PercentBps,
  PricingCalculationResult,
  PricingGoalInput,
  PricingInput
} from "@maried-university/pricing-engine";

export type JsonSafe = string | boolean | null | JsonSafe[] | { [key: string]: JsonSafe };

export type PricingFreightDto =
  | { mode: "NONE" }
  | { mode: "UNIT"; unitFreightCents: string }
  | { mode: "TOTAL_BY_QUANTITY"; totalFreightCents: string; quantity: string };

export type PricingLossDto =
  | { mode: "NONE" }
  | { mode: "FIXED"; amountCents: string }
  | { mode: "PERCENT"; percentBps: string };

export type PricingGoalDto =
  | { mode: "FIXED_PROFIT"; desiredProfitCents: string }
  | { mode: "COST_MARKUP"; markupBps: string }
  | { mode: "NET_MARGIN"; desiredMarginBps: string };

export type CreatePricingCalculationDto = {
  pieceName: string;
  notes?: string | null;
  productId?: string | null;
  commercialProfileIds?: string[];
  costs: {
    pieceCostCents: string;
    packagingCostCents: string;
    tagCostCents: string;
    otherDirectCostsCents: string;
  };
  freight: PricingFreightDto;
  loss: PricingLossDto;
  goal: PricingGoalDto;
  approvedPrices?: Array<{
    commercialProfileId: string;
    priceCents: string;
  }>;
};

export type CommercialProfileRow = {
  id: string;
  tenant_id: string;
  profile_key: CommercialProfileInput["key"] | null;
  name: string;
  fixed_fee_cents: string | number | bigint;
  tax_bps: string | number | bigint;
  commission_bps: string | number | bigint;
  discount_bps: string | number | bigint;
  taxes_bps: string | number | bigint;
  marketplace_bps: string | number | bigint;
  default_rounding_rule: CommercialProfileInput["roundingRule"];
  is_active: boolean;
};

export type PricingPersistencePayload = {
  target_tenant_id: string;
  piece_name: string;
  notes: string | null;
  product_id: string | null;
  input_snapshot: JsonSafe;
  result_snapshot: JsonSafe;
  profile_results: JsonSafe[];
  engine_version: string;
};

export const PRICING_ENGINE_VERSION = "pricing-engine@0.1.0";

export function toPricingInput(dto: CreatePricingCalculationDto, profiles: CommercialProfileRow[]): PricingInput {
  const activeProfiles = profiles.filter((profile) => profile.is_active).map(toCommercialProfileInput);
  const approvedPrices = toApprovedPrices(dto, activeProfiles, profiles);

  return {
    costs: {
      pieceCost: parseMoneyCents(dto.costs.pieceCostCents, "costs.pieceCostCents"),
      packagingCost: parseMoneyCents(dto.costs.packagingCostCents, "costs.packagingCostCents"),
      tagCost: parseMoneyCents(dto.costs.tagCostCents, "costs.tagCostCents"),
      otherDirectCosts: parseMoneyCents(dto.costs.otherDirectCostsCents, "costs.otherDirectCostsCents")
    },
    freight: toFreightInput(dto.freight),
    loss: toLossInput(dto.loss),
    goal: toGoalInput(dto.goal),
    profiles: activeProfiles,
    approvedPrices
  };
}

export function toCommercialProfileInput(profile: CommercialProfileRow): CommercialProfileInput {
  return {
    key: profile.profile_key ?? "CUSTOM",
    name: profile.name,
    isActive: profile.is_active,
    fixedFee: parseMoneyCents(profile.fixed_fee_cents, "commercialProfile.fixedFeeCents"),
    taxPercent: parsePercentBps(profile.tax_bps, "commercialProfile.taxBps"),
    commissionPercent: parsePercentBps(profile.commission_bps, "commercialProfile.commissionBps"),
    discountPercent: parsePercentBps(profile.discount_bps, "commercialProfile.discountBps"),
    taxesPercent: parsePercentBps(profile.taxes_bps, "commercialProfile.taxesBps"),
    marketplacePercent: parsePercentBps(profile.marketplace_bps, "commercialProfile.marketplaceBps"),
    roundingRule: profile.default_rounding_rule
  };
}

export function buildPricingPersistencePayload(params: {
  dto: CreatePricingCalculationDto;
  tenantId: string;
  userId: string;
  pricingInput: PricingInput;
  profileRows: CommercialProfileRow[];
  result: PricingCalculationResult;

}): PricingPersistencePayload {
  const { dto, tenantId, userId, pricingInput, profileRows, result } = params;
  const createdAt = new Date().toISOString();

  const inputSnapshot = toJsonSafe({
    tenantId,
    userId,
    createdAt,
    costs: pricingInput.costs,
    freight: pricingInput.freight,
    loss: pricingInput.loss,
    goal: pricingInput.goal,
    commercialProfileIds: profileRows.map((profile) => profile.id)
  });

  const resultSnapshot = toJsonSafe({
    tenantId,
    userId,
    createdAt,
    pricingMode: pricingInput.goal.mode,
    costBaseCents: result.costs.costBase,
    lossAmountCents: result.costs.lossAmount,
    costTotalCents: result.costs.costTotal,
    engineSnapshot: result.snapshot,
    alerts: result.results.flatMap((item) => item.alerts),
    errors: result.results.flatMap((item) => item.errors)
  });

  return {
    target_tenant_id: tenantId,
    piece_name: normalizePieceName(dto.pieceName),
    notes: normalizeOptionalText(dto.notes),
    product_id: normalizeOptionalText(dto.productId),
    input_snapshot: inputSnapshot,
    result_snapshot: resultSnapshot,
    profile_results: result.results.map((profileResult) => {
      const row = findProfileRow(profileResult.profile.key, profileRows);
      return toJsonSafe({
        commercialProfileId: row?.id ?? "",
        profileSnapshot: profileResult.profile,
        breakEvenPriceCents: profileResult.breakEvenPrice,
        minimumRecommendedPriceCents: profileResult.minimumRecommendedPrice,
        technicalPriceCents: profileResult.technicalPrice,
        suggestedPriceCents: profileResult.suggestedPrice,
        approvedPriceCents: profileResult.approvedPrice ?? "",
        effectivePriceCents: profileResult.effectivePrice,
        grossProfitCents: profileResult.grossProfit,
        netProfitCents: profileResult.netProfit,
        netMarginBps: profileResult.netMarginBps,
        alerts: profileResult.alerts,
        errors: profileResult.errors
      }) as JsonSafe;
    }) as JsonSafe[],
    engine_version: PRICING_ENGINE_VERSION
  };
}

export function parseMoneyCents(value: string | number | bigint, path: string): MoneyCents {
  return parseIntegerString(value, path);
}

export function parsePercentBps(value: string | number | bigint, path: string): PercentBps {
  return parseIntegerString(value, path);
}

export function toJsonSafe(value: unknown): JsonSafe {
  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "string" || typeof value === "boolean" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonSafe(item));
  }

  if (typeof value === "object") {
    const output: { [key: string]: JsonSafe } = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (item !== undefined) {
        output[key] = toJsonSafe(item);
      }
    }
    return output;
  }

  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw new PricingDtoError("Unsafe numeric DTO value.");
    }

    return value.toString();
  }

  throw new PricingDtoError("Unsupported DTO value.");
}

export class PricingDtoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PricingDtoError";
  }
}

function toFreightInput(freight: PricingFreightDto): FreightInput {
  if (freight.mode === "NONE") {
    return { mode: "NONE" };
  }

  if (freight.mode === "UNIT") {
    return { mode: "UNIT", unitFreight: parseMoneyCents(freight.unitFreightCents, "freight.unitFreightCents") };
  }

  return {
    mode: "TOTAL_BY_QUANTITY",
    totalFreight: parseMoneyCents(freight.totalFreightCents, "freight.totalFreightCents"),
    quantity: parseIntegerString(freight.quantity, "freight.quantity")
  };
}

function toLossInput(loss: PricingLossDto): LossInput {
  if (loss.mode === "NONE") {
    return { mode: "NONE" };
  }

  if (loss.mode === "FIXED") {
    return { mode: "FIXED", amount: parseMoneyCents(loss.amountCents, "loss.amountCents") };
  }

  return { mode: "PERCENT", percent: parsePercentBps(loss.percentBps, "loss.percentBps") };
}

function toGoalInput(goal: PricingGoalDto): PricingGoalInput {
  if (goal.mode === "FIXED_PROFIT") {
    return { mode: "FIXED_PROFIT", desiredProfit: parseMoneyCents(goal.desiredProfitCents, "goal.desiredProfitCents") };
  }

  if (goal.mode === "COST_MARKUP") {
    return { mode: "COST_MARKUP", markupPercent: parsePercentBps(goal.markupBps, "goal.markupBps") };
  }

  return { mode: "NET_MARGIN", desiredMargin: parsePercentBps(goal.desiredMarginBps, "goal.desiredMarginBps") };
}

function toApprovedPrices(
  dto: CreatePricingCalculationDto,
  activeProfiles: CommercialProfileInput[],
  rows: CommercialProfileRow[]
): ApprovedPriceInput[] | undefined {
  if (!dto.approvedPrices?.length) {
    return undefined;
  }

  return dto.approvedPrices.map((approved) => {
    const row = rows.find((profile) => profile.id === approved.commercialProfileId);
    const key = row?.profile_key ?? "CUSTOM";
    const profileExists = activeProfiles.some((profile) => profile.key === key);

    if (!row || !profileExists) {
      throw new PricingDtoError("Approved price references an unavailable commercial profile.");
    }

    return {
      profileKey: key,
      price: parseMoneyCents(approved.priceCents, "approvedPrices.priceCents")
    };
  });
}

function parseIntegerString(value: string | number | bigint, path: string): bigint {
  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw new PricingDtoError(`${path} must be an integer string.`);
    }

    return BigInt(value);
  }

  if (!/^-?\d+$/.test(value)) {
    throw new PricingDtoError(`${path} must be an integer string.`);
  }

  return BigInt(value);
}

function normalizePieceName(value: string): string {
  const normalized = value.trim();
  if (normalized.length < 2 || normalized.length > 120) {
    throw new PricingDtoError("Piece name must have between 2 and 120 characters.");
  }
  return normalized;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length === 0 ? null : normalized;
}

function findProfileRow(key: CommercialProfileInput["key"], rows: CommercialProfileRow[]): CommercialProfileRow | undefined {
  return rows.find((row) => (row.profile_key ?? "CUSTOM") === key);
}