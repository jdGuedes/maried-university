import { describe, expect, it } from "vitest";
import type { AccessContext } from "../../lib/access/session-context";
import { PricingDtoError, parseMoneyCents, toJsonSafe, toPricingInput, type CommercialProfileRow, type CreatePricingCalculationDto } from "../../lib/pricing/dto";
import { PricingServiceError, calculateOfficialPricingPreview, createOfficialPricingCalculation, type PricingSupabaseClient } from "../../lib/pricing/service";

const ownerAccess: AccessContext = {
  user: {
    id: "00000000-0000-0000-0000-0000000030a1",
    email: "owner@example.test",
    fullName: "Owner",
    avatarUrl: null,
    isPlatformAdmin: false
  },
  tenant: {
    id: "30000000-0000-0000-0000-0000000000a1",
    name: "Tenant A",
    tradeName: null,
    status: "active",
    timezone: "America/Fortaleza",
    locale: "pt-BR"
  },
  role: "owner",
  membershipId: "membership-owner"
};

const operatorAccess: AccessContext = {
  ...ownerAccess,
  role: "operator",
  membershipId: "membership-operator"
};

const profileRows: CommercialProfileRow[] = [
  {
    id: "31000000-0000-0000-0000-0000000000a1",
    tenant_id: ownerAccess.tenant.id,
    profile_key: "PIX",
    name: "Pix",
    fixed_fee_cents: "0",
    tax_bps: "1000",
    commission_bps: "0",
    discount_bps: "0",
    taxes_bps: "0",
    marketplace_bps: "0",
    default_rounding_rule: "NONE",
    is_active: true
  }
];

const validDto: CreatePricingCalculationDto = {
  pieceName: "Anel Solitario",
  notes: "Calculo oficial",
  productId: null,
  commercialProfileIds: [profileRows[0].id],
  costs: {
    pieceCostCents: "1000",
    packagingCostCents: "200",
    tagCostCents: "50",
    otherDirectCostsCents: "250"
  },
  freight: { mode: "UNIT", unitFreightCents: "500" },
  loss: { mode: "NONE" },
  goal: { mode: "FIXED_PROFIT", desiredProfitCents: "1000" }
};

describe("pricing server DTO", () => {
  it("converts DTO strings into pricing-engine bigint contracts", () => {
    const input = toPricingInput(validDto, profileRows);

    expect(input.costs.pieceCost).toBe(1000n);
    expect(input.freight).toEqual({ mode: "UNIT", unitFreight: 500n });
    expect(input.goal).toEqual({ mode: "FIXED_PROFIT", desiredProfit: 1000n });
    expect(input.profiles[0].taxPercent).toBe(1000n);
  });

  it("rejects invalid bigint strings without using floating point conversion", () => {
    expect(() => parseMoneyCents("10.5", "costs.pieceCostCents")).toThrow(PricingDtoError);
    expect(() => parseMoneyCents("1e3", "costs.pieceCostCents")).toThrow(PricingDtoError);
  });

  it("serializes BigInt snapshots as canonical strings", () => {
    expect(toJsonSafe({ value: 123n, nested: [1n, "2"] })).toEqual({ value: "123", nested: ["1", "2"] });
  });
});

describe("pricing server service", () => {
  it("loads tenant profiles, recalculates officially and persists through the transaction RPC", async () => {
    const supabase = createSupabaseMock(profileRows, "pricing-created-id");
    const result = await createOfficialPricingCalculation(validDto, { accessContext: ownerAccess, supabase });

    expect(result.pricingCalculationId).toBe("pricing-created-id");
    expect(supabase.calls.fromTenantId).toBe(ownerAccess.tenant.id);
    expect(supabase.calls.rpcName).toBe("create_pricing_calculation_tx");
    expect(result.payload.target_tenant_id).toBe(ownerAccess.tenant.id);
    expect(result.payload.result_snapshot).toMatchObject({
      pricingMode: "FIXED_PROFIT",
      costBaseCents: "2000",
      costTotalCents: "2000"
    });
    expect(result.payload.profile_results[0]).toMatchObject({
      commercialProfileId: profileRows[0].id,
      technicalPriceCents: "3334",
      effectivePriceCents: "3334",
      netProfitCents: "1001"
    });
  });

  it("ignores manipulated tenant and derived values sent by a future client", async () => {
    const supabase = createSupabaseMock(profileRows, "pricing-created-id");
    const manipulatedDto = {
      ...validDto,
      tenantId: "evil-tenant",
      technicalPriceCents: "1",
      netProfitCents: "999999999"
    } as CreatePricingCalculationDto & Record<string, unknown>;

    const result = await createOfficialPricingCalculation(manipulatedDto, { accessContext: ownerAccess, supabase });

    expect(result.payload.target_tenant_id).toBe(ownerAccess.tenant.id);
    expect(result.payload.result_snapshot).not.toHaveProperty("technicalPriceCents");
    expect(result.payload.profile_results[0]).toMatchObject({ technicalPriceCents: "3334", netProfitCents: "1001" });
  });

  it("blocks roles not approved for MVP pricing persistence", async () => {
    await expect(createOfficialPricingCalculation(validDto, {
      accessContext: operatorAccess,
      supabase: createSupabaseMock(profileRows, "never")
    })).rejects.toThrow(PricingServiceError);
  });

  it("rejects missing or inactive commercial profiles", async () => {
    await expect(createOfficialPricingCalculation(validDto, {
      accessContext: ownerAccess,
      supabase: createSupabaseMock([], "never")
    })).rejects.toThrow(PricingServiceError);

    await expect(createOfficialPricingCalculation(validDto, {
      accessContext: ownerAccess,
      supabase: createSupabaseMock([{ ...profileRows[0], is_active: false }], "never")
    })).rejects.toThrow(PricingServiceError);
  });

  it("fails safely when official engine validation fails", async () => {
    const invalidDto: CreatePricingCalculationDto = {
      ...validDto,
      freight: { mode: "TOTAL_BY_QUANTITY", totalFreightCents: "100", quantity: "0" }
    };

    await expect(createOfficialPricingCalculation(invalidDto, {
      accessContext: ownerAccess,
      supabase: createSupabaseMock(profileRows, "never")
    })).rejects.toThrow(PricingServiceError);
  });
});


describe("pricing server preview", () => {
  it("calculates an official preview with the first active profile without persisting", async () => {
    const rows: CommercialProfileRow[] = [
      profileRows[0],
      {
        ...profileRows[0],
        id: "31000000-0000-0000-0000-0000000000b2",
        profile_key: "CARD",
        name: "Cartao",
        tax_bps: "2000"
      }
    ];
    const supabase = createSupabaseMock(rows, "should-not-persist");
    const result = await calculateOfficialPricingPreview(validDto, { accessContext: ownerAccess, supabase });

    expect(result.profileId).toBe(profileRows[0].id);
    expect(result.profileName).toBe("Pix");
    expect(result.costs.costBaseCents).toBe("2000");
    expect(result.costs.costTotalCents).toBe("2000");
    expect(result.result.technicalPriceCents).toBe("3334");
    expect(result.result.netProfitCents).toBe("1001");
    expect(supabase.calls.rpcName).toBeNull();
  });

  it("keeps preview access restricted to pricing managers", async () => {
    await expect(calculateOfficialPricingPreview(validDto, {
      accessContext: operatorAccess,
      supabase: createSupabaseMock(profileRows, "never")
    })).rejects.toThrow(PricingServiceError);
  });

  it("fails safely when no active profile is available for preview", async () => {
    await expect(calculateOfficialPricingPreview(validDto, {
      accessContext: ownerAccess,
      supabase: createSupabaseMock([], "never")
    })).rejects.toThrow(PricingServiceError);
  });
});
function createSupabaseMock(rows: CommercialProfileRow[], rpcResult: string): PricingSupabaseClient & {
  calls: { fromTenantId: unknown; profileIds: string[] | null; rpcName: string | null };
} {
  const calls = { fromTenantId: null as unknown, profileIds: null as string[] | null, rpcName: null as string | null };

  const builder = {
    select: () => builder,
    eq: (column: string, value: unknown) => {
      if (column === "tenant_id") {
        calls.fromTenantId = value;
      }
      return builder;
    },
    is: () => builder,
    in: (_column: string, value: string[]) => {
      calls.profileIds = value;
      return builder;
    },
    order: async () => ({ data: rows.filter((row) => row.is_active), error: null })
  };

  return {
    calls,
    from: () => builder,
    rpc: async (functionName) => {
      calls.rpcName = functionName;
      return { data: rpcResult, error: null };
    }
  };
}
