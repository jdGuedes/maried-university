import { calculatePricing } from "@maried-university/pricing-engine";
import type { AccessContext } from "../access/session-context";
import { createSupabaseServerClient } from "../supabase/server";
import {
  buildPricingPersistencePayload,
  toPricingInput,
  type CommercialProfileRow,
  type CreatePricingCalculationDto,
  type PricingPersistencePayload
} from "./dto";

const PRICING_MANAGER_ROLES = new Set(["owner", "admin"]);

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

export async function createOfficialPricingCalculation(
  dto: CreatePricingCalculationDto,
  dependencies?: {
    accessContext?: AccessContext;
    supabase?: PricingSupabaseClient;
  }
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
    .select("id, tenant_id, profile_key, name, fixed_fee_cents, tax_bps, commission_bps, discount_bps, taxes_bps, marketplace_bps, default_rounding_rule, is_active")
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

  return profiles.data;
}

function assertPricingManager(accessContext: AccessContext): void {
  if (!PRICING_MANAGER_ROLES.has(accessContext.role)) {
    throw new PricingServiceError("Owner or admin role is required for pricing operations.");
  }
}