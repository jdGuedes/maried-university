import { calculatePricing, type RoundingRule } from "@maried-university/pricing-engine";
import type { AccessContext } from "../access/session-context";
import {
  buildPricingPersistencePayload,
  toJsonSafe,
  toPricingInput,
  type CommercialProfileRow,
  type CreatePricingCalculationDto,
  type JsonSafe,
  type PricingPersistencePayload
} from "./dto";

const PRICING_MANAGER_ROLES = new Set(["owner", "admin"]);
const PROFILE_PRIORITY = new Map([
  ["PIX", 1],
  ["CARD", 2],
  ["RESELLER", 3],
  ["WHOLESALE", 4],
  ["MARKETPLACE", 5],
  ["CUSTOM", 6]
]);

type QueryResult<T> = { data: T | null; error: { message: string } | null };

type PricingQueryBuilder = {
  select(columns: string): PricingQueryBuilder;
  eq(column: string, value: unknown): PricingQueryBuilder;
  is(column: string, value: null): PricingQueryBuilder;
  in(column: string, value: string[]): PricingQueryBuilder;
  order(column: string, options: { ascending: boolean }): Promise<QueryResult<CommercialProfileRow[]>>;
};

export type PricingSupabaseClient = {
  from(table: "commercial_profiles"): PricingQueryBuilder;
  rpc(functionName: "create_pricing_calculation_tx", args: PricingPersistencePayload): Promise<QueryResult<string>>;
};

export type CreatePricingCalculationResult = {
  pricingCalculationId: string;
  payload: PricingPersistencePayload;
};

export type PricingPreviewProfileResult = {
  profileId: string;
  profileKey: NonNullable<CommercialProfileRow["profile_key"]>;
  profileName: string;
  roundingRule: RoundingRule;
  breakEvenPriceCents: string;
  minimumRecommendedPriceCents: string;
  technicalPriceCents: string;
  suggestedPriceCents: string;
  approvedPriceCents: string | null;
  effectivePriceCents: string;
  grossProfitCents: string;
  netProfitCents: string;
  netMarginBps: string;
  alerts: JsonSafe[];
  errors: JsonSafe[];
};

export type PricingPreviewResult = {
  pricingMode: CreatePricingCalculationDto["goal"]["mode"];
  roundingRule: RoundingRule;
  costs: {
    pieceCostCents: string;
    packagingCostCents: string;
    tagCostCents: string;
    freightUnitCents: string;
    otherDirectCostsCents: string;
    costBaseCents: string;
    lossAmountCents: string;
    costTotalCents: string;
  };
  profiles: PricingPreviewProfileResult[];
};

type PricingServiceDependencies = {
  accessContext?: AccessContext;
  supabase?: PricingSupabaseClient;
};

type PricingPreviewDependencies = PricingServiceDependencies & {
  roundingRuleOverride?: RoundingRule;
};

export async function createOfficialPricingCalculation(
  dto: CreatePricingCalculationDto,
  dependencies?: PricingServiceDependencies
): Promise<CreatePricingCalculationResult> {
  const accessContext = dependencies?.accessContext ?? await loadServerAccessContext();

  assertPricingManager(accessContext);

  const supabase = dependencies?.supabase ?? await loadServerSupabaseClient();
  const profileRows = await loadCommercialProfiles(supabase, accessContext.tenant.id, dto.commercialProfileIds);
  const pricingInput = toPricingInput(dto, profileRows);
  const result = calculatePricing(pricingInput);

  if (!result.ok) {
    throw new PricingServiceError("Official pricing calculation failed validation.");
  }

  const payload = buildPricingPersistencePayload({
    dto,
    tenantId: accessContext.tenant.id,
    userId: accessContext.user.id,
    pricingInput,
    profileRows,
    result
  });

  const persisted = await supabase.rpc("create_pricing_calculation_tx", payload);

  if (persisted.error || !persisted.data) {
    throw new PricingServiceError("Could not persist pricing calculation.");
  }

  return {
    pricingCalculationId: persisted.data,
    payload
  };
}

export async function calculateOfficialPricingPreview(
  dto: CreatePricingCalculationDto,
  dependencies?: PricingPreviewDependencies
): Promise<PricingPreviewResult> {
  const accessContext = dependencies?.accessContext ?? await loadServerAccessContext();

  assertPricingManager(accessContext);

  const supabase = dependencies?.supabase ?? await loadServerSupabaseClient();
  const profileRows = await loadCommercialProfiles(supabase, accessContext.tenant.id, undefined);
  const previewProfileRows = dependencies?.roundingRuleOverride
    ? applyRoundingRuleOverride(profileRows, dependencies.roundingRuleOverride)
    : profileRows;
  const pricingInput = toPricingInput(dto, previewProfileRows);
  const result = calculatePricing(pricingInput);

  if (!result.ok || result.results.length === 0) {
    throw new PricingServiceError("Official pricing calculation failed validation.");
  }

  return {
    pricingMode: dto.goal.mode,
    roundingRule: dependencies?.roundingRuleOverride ?? "NONE",
    costs: {
      pieceCostCents: result.costs.pieceCost.toString(),
      packagingCostCents: result.costs.packagingCost.toString(),
      tagCostCents: result.costs.tagCost.toString(),
      freightUnitCents: result.costs.freightUnit.toString(),
      otherDirectCostsCents: result.costs.otherDirectCosts.toString(),
      costBaseCents: result.costs.costBase.toString(),
      lossAmountCents: result.costs.lossAmount.toString(),
      costTotalCents: result.costs.costTotal.toString()
    },
    profiles: result.results.map((profileResult, index) => {
      const profileRow = previewProfileRows[index];
      return {
        profileId: profileRow?.id ?? "",
        profileKey: profileResult.profile.key,
        profileName: profileResult.profile.name,
        roundingRule: profileResult.profile.roundingRule,
        breakEvenPriceCents: profileResult.breakEvenPrice.toString(),
        minimumRecommendedPriceCents: profileResult.minimumRecommendedPrice.toString(),
        technicalPriceCents: profileResult.technicalPrice.toString(),
        suggestedPriceCents: profileResult.suggestedPrice.toString(),
        approvedPriceCents: profileResult.approvedPrice?.toString() ?? null,
        effectivePriceCents: profileResult.effectivePrice.toString(),
        grossProfitCents: profileResult.grossProfit.toString(),
        netProfitCents: profileResult.netProfit.toString(),
        netMarginBps: profileResult.netMarginBps.toString(),
        alerts: profileResult.alerts.map((alert) => toJsonSafe(alert)) as JsonSafe[],
        errors: profileResult.errors.map((error) => toJsonSafe(error)) as JsonSafe[]
      };
    })
  };
}

async function loadServerAccessContext(): Promise<AccessContext> {
  const { requireServerAccessContext } = await import("../access/session-context");
  return requireServerAccessContext();
}

async function loadServerSupabaseClient(): Promise<PricingSupabaseClient> {
  const { createSupabaseServerClient } = await import("../supabase/server");
  return await createSupabaseServerClient() as unknown as PricingSupabaseClient;
}
export class PricingServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PricingServiceError";
  }
}

async function loadCommercialProfiles(
  supabase: PricingSupabaseClient,
  tenantId: string,
  commercialProfileIds: string[] | undefined
): Promise<CommercialProfileRow[]> {
  let query = supabase
    .from("commercial_profiles")
    .select("id, tenant_id, profile_key, name, fixed_fee_cents, tax_bps, commission_bps, discount_bps, taxes_bps, marketplace_bps, default_rounding_rule, is_active, display_order")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .is("deleted_at", null);

  if (commercialProfileIds?.length) {
    query = query.in("id", commercialProfileIds);
  }

  const profiles = await query.order("display_order", { ascending: true });

  if (profiles.error) {
    throw new PricingServiceError("Could not load commercial profiles.");
  }

  if (!profiles.data?.length) {
    throw new PricingServiceError("No active commercial profile is available.");
  }

  return sortCommercialProfiles(profiles.data);
}

function sortCommercialProfiles(rows: CommercialProfileRow[]): CommercialProfileRow[] {
  return [...rows].sort((left, right) => {
    const leftPriority = PROFILE_PRIORITY.get(left.profile_key ?? "CUSTOM") ?? 99;
    const rightPriority = PROFILE_PRIORITY.get(right.profile_key ?? "CUSTOM") ?? 99;
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    const leftOrder = left.display_order === undefined || left.display_order === null ? 0n : BigInt(left.display_order);
    const rightOrder = right.display_order === undefined || right.display_order === null ? 0n : BigInt(right.display_order);
    if (leftOrder === rightOrder) {
      return left.name.localeCompare(right.name, "pt-BR");
    }

    return leftOrder < rightOrder ? -1 : 1;
  });
}

function applyRoundingRuleOverride(rows: CommercialProfileRow[], roundingRule: RoundingRule): CommercialProfileRow[] {
  return rows.map((row) => ({
    ...row,
    default_rounding_rule: roundingRule
  }));
}

function assertPricingManager(accessContext: AccessContext): void {
  if (!PRICING_MANAGER_ROLES.has(accessContext.role)) {
    throw new PricingServiceError("Owner or admin role is required for pricing operations.");
  }
}
