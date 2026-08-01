import { describe, expect, it } from "vitest";
import {
  applyRoundingRule,
  bps,
  calculateBreakEvenPrice,
  calculateCosts,
  calculateFreightUnit,
  calculateLossAmount,
  calculateNetProfit,
  calculatePricing,
  cents,
  commercialProfileKeys,
  createCommercialProfile,
  defaultCommercialProfiles,
  formatCents,
  type CommercialProfileInput,
  type PricingInput,
  type RoundingRule
} from "../src";

function baseProfile(overrides: Partial<CommercialProfileInput> = {}): CommercialProfileInput {
  return {
    ...createCommercialProfile("PIX", "Pix"),
    ...overrides
  };
}

function baseInput(overrides: Partial<PricingInput> = {}): PricingInput {
  return {
    costs: {
      pieceCost: cents("1000"),
      packagingCost: cents("200"),
      tagCost: cents("50"),
      otherDirectCosts: cents("250")
    },
    freight: { mode: "UNIT", unitFreight: cents("500") },
    loss: { mode: "NONE" },
    goal: { mode: "FIXED_PROFIT", desiredProfit: cents("1000") },
    profiles: [baseProfile({ taxPercent: bps("1000") })],
    ...overrides
  };
}

function codes(result: { errors: Array<{ code: string }>; alerts?: Array<{ code: string }> }): string[] {
  return result.errors.map((item) => item.code);
}

describe("pricing-engine contracts and official profiles", () => {
  it("exposes the six official commercial profiles", () => {
    expect(commercialProfileKeys).toEqual(["PIX", "CARD", "RESELLER", "WHOLESALE", "MARKETPLACE", "CUSTOM"]);
    expect(defaultCommercialProfiles.map((profile) => profile.name)).toEqual([
      "Pix",
      "Cartao",
      "Revendedora",
      "Atacado",
      "Marketplace",
      "Personalizado"
    ]);

    const result = calculatePricing(baseInput({ profiles: defaultCommercialProfiles }));
    expect(result.ok).toBe(true);
    expect(result.results).toHaveLength(6);
  });

  it("keeps money and percentages as integer bigint units", () => {
    expect(cents("1")).toBe(1n);
    expect(cents("10")).toBe(10n);
    expect(cents("99")).toBe(99n);
    expect(cents("100")).toBe(100n);
    expect(bps("2500")).toBe(2500n);
    expect(formatCents(cents("99"))).toBe("0.99");
    expect(() => cents("1.5")).toThrow("integer cents");
    expect(() => bps("1.5")).toThrow("basis points");
  });
});

describe("cost base, freight and losses", () => {
  it("calculates cost base with direct unit freight", () => {
    const costs = calculateCosts(
      { pieceCost: 1000n, packagingCost: 200n, tagCost: 50n, otherDirectCosts: 250n },
      500n,
      { mode: "NONE" }
    );

    expect(costs.costBase).toBe(2000n);
    expect(costs.lossAmount).toBe(0n);
    expect(costs.costTotal).toBe(2000n);
  });

  it("supports no freight, unit freight and total freight allocation", () => {
    expect(calculateFreightUnit({ mode: "NONE" }).freightUnit).toBe(0n);
    expect(calculateFreightUnit({ mode: "UNIT", unitFreight: 123n }).freightUnit).toBe(123n);

    const allocated = calculateFreightUnit({ mode: "TOTAL_BY_QUANTITY", totalFreight: 1000n, quantity: 3n });
    expect(allocated.freightUnit).toBe(334n);
    expect(allocated.alerts.map((item) => item.code)).toContain("FREIGHT_ALLOCATED_WITH_CENT_ROUNDING");
  });

  it("returns a typed error instead of dividing by zero for invalid freight quantity", () => {
    const result = calculatePricing(baseInput({ freight: { mode: "TOTAL_BY_QUANTITY", totalFreight: 1000n, quantity: 0n } }));
    expect(result.ok).toBe(false);
    expect(codes(result)).toContain("INVALID_FREIGHT_QUANTITY");
  });

  it("calculates fixed and percentage losses over the direct cost base", () => {
    expect(calculateLossAmount(2000n, { mode: "FIXED", amount: 300n })).toBe(300n);
    expect(calculateLossAmount(2000n, { mode: "PERCENT", percent: 1250n })).toBe(250n);

    const costs = calculateCosts(
      { pieceCost: 1n, packagingCost: 10n, tagCost: 99n, otherDirectCosts: 100n },
      0n,
      { mode: "PERCENT", percent: 1000n }
    );
    expect(costs.costBase).toBe(210n);
    expect(costs.lossAmount).toBe(21n);
    expect(costs.costTotal).toBe(231n);
  });
});

describe("pricing modes and formulas", () => {
  it("calculates fixed profit with percentage fees using ceiling protection", () => {
    const result = calculatePricing(baseInput());
    const profile = result.results[0];

    expect(result.ok).toBe(true);
    expect(profile.breakEvenPrice).toBe(2223n);
    expect(profile.technicalPrice).toBe(3334n);
    expect(profile.suggestedPrice).toBe(3334n);
    expect(profile.netProfit).toBe(1001n);
    expect(profile.grossProfit).toBe(1334n);
    expect(profile.netMarginBps).toBe(3002n);
  });

  it("calculates cost markup independently from external services", () => {
    const result = calculatePricing(baseInput({ goal: { mode: "COST_MARKUP", markupPercent: 10000n } }));
    const profile = result.results[0];

    expect(result.ok).toBe(true);
    expect(profile.technicalPrice).toBe(4000n);
    expect(profile.netProfit).toBe(1600n);
    expect(profile.netMarginBps).toBe(4000n);
  });

  it("blocks markup prices below break-even when fees make the denominator unsafe", () => {
    const result = calculatePricing(baseInput({
      goal: { mode: "COST_MARKUP", markupPercent: 0n },
      profiles: [baseProfile({ taxPercent: 1000n })]
    }));

    expect(result.ok).toBe(false);
    expect(codes(result)).toContain("PRICE_BELOW_BREAK_EVEN");
  });

  it("calculates net margin targets and validates impossible denominators", () => {
    const result = calculatePricing(baseInput({ goal: { mode: "NET_MARGIN", desiredMargin: 3000n } }));
    const profile = result.results[0];

    expect(result.ok).toBe(true);
    expect(profile.technicalPrice).toBe(3334n);
    expect(profile.netProfit).toBe(1001n);
    expect(profile.netMarginBps).toBe(3002n);

    const invalid = calculatePricing(baseInput({
      goal: { mode: "NET_MARGIN", desiredMargin: 5000n },
      profiles: [baseProfile({ taxPercent: 5000n })]
    }));
    expect(invalid.ok).toBe(false);
    expect(codes(invalid)).toContain("DENOMINATOR_NOT_POSITIVE");
  });

  it("supports zero profit and very high values without floating point arithmetic", () => {
    const zeroProfit = calculatePricing(baseInput({ goal: { mode: "FIXED_PROFIT", desiredProfit: 0n } }));
    expect(zeroProfit.ok).toBe(true);
    expect(zeroProfit.results[0].effectivePrice).toBe(zeroProfit.results[0].breakEvenPrice);

    const high = calculatePricing(baseInput({
      costs: { pieceCost: 9000000000000000n, packagingCost: 1n, tagCost: 1n, otherDirectCosts: 1n },
      freight: { mode: "NONE" },
      profiles: [baseProfile({ taxPercent: 3333n })]
    }));
    expect(high.ok).toBe(true);
    expect(high.costs.costTotal).toBe(9000000000000003n);
    expect(high.results[0].technicalPrice).toBeGreaterThan(high.costs.costTotal);
  });
});

describe("approved prices, break-even and alerts", () => {
  it("calculates break-even price directly", () => {
    expect(calculateBreakEvenPrice(2000n, 100n, 1000n)).toBe(2334n);
  });

  it("blocks approved prices below break-even", () => {
    const result = calculatePricing(baseInput({ approvedPrices: [{ profileKey: "PIX", price: 2000n }] }));

    expect(result.ok).toBe(false);
    expect(codes(result)).toContain("PRICE_BELOW_BREAK_EVEN");
  });

  it("alerts when approved price equals break-even or stays below the target", () => {
    const equal = calculatePricing(baseInput({ approvedPrices: [{ profileKey: "PIX", price: 2223n }] }));
    expect(equal.ok).toBe(true);
    expect(equal.results[0].alerts.map((item) => item.code)).toContain("APPROVED_PRICE_EQUALS_BREAK_EVEN");

    const belowTarget = calculatePricing(baseInput({ approvedPrices: [{ profileKey: "PIX", price: 2500n }] }));
    expect(belowTarget.ok).toBe(true);
    expect(belowTarget.results[0].alerts.map((item) => item.code)).toContain("APPROVED_PRICE_BELOW_TARGET");
  });

  it.each<[RoundingRule, bigint, bigint]>([
    ["NONE", 3211n, 3211n],
    ["UP_TO_CENT", 3211n, 3211n],
    ["ENDING_90", 3211n, 3290n],
    ["ENDING_99", 3211n, 3299n],
    ["ENDING_90", 3291n, 3390n]
  ])("applies rounding rule %s", (rule, input, expected) => {
    expect(applyRoundingRule(input, rule)).toBe(expected);
  });
});

describe("validation errors and security boundary", () => {
  it("validates negative money, invalid percentages and negative approved prices", () => {
    const result = calculatePricing(baseInput({
      costs: { pieceCost: -1n, packagingCost: 0n, tagCost: 0n, otherDirectCosts: 0n },
      loss: { mode: "PERCENT", percent: 10001n },
      profiles: [baseProfile({ taxPercent: 10000n })],
      approvedPrices: [{ profileKey: "PIX", price: -1n }]
    }));

    expect(result.ok).toBe(false);
    expect(codes(result)).toContain("NEGATIVE_MONEY");
    expect(codes(result)).toContain("INVALID_PERCENT");
    expect(codes(result)).toContain("DENOMINATOR_NOT_POSITIVE");
    expect(codes(result)).toContain("PRICE_NEGATIVE");
  });

  it("rejects no active profiles", () => {
    const result = calculatePricing(baseInput({ profiles: [baseProfile({ isActive: false })] }));

    expect(result.ok).toBe(false);
    expect(codes(result)).toContain("NO_ACTIVE_PROFILES");
    expect(result.results).toHaveLength(0);
  });

  it("does not decide tenant, user, permissions, sessions or persistence", () => {
    const result = calculatePricing(baseInput());
    const serialized = JSON.stringify(result.snapshot, (_key, value: unknown) => (
      typeof value === "bigint" ? value.toString() : value
    ));

    expect(serialized).not.toContain("tenant");
    expect(serialized).not.toContain("user");
    expect(serialized).not.toContain("session");
    expect(serialized).not.toContain("permission");
  });

  it("keeps net profit formula explicit", () => {
    expect(calculateNetProfit(3334n, 2000n, 0n, 1000n)).toBe(1001n);
  });
});