export type MoneyCents = bigint;
export type PercentBps = bigint;

export type PricingMode = "FIXED_PROFIT" | "COST_MARKUP" | "NET_MARGIN";

export type FreightMode = "NONE" | "UNIT" | "TOTAL_BY_QUANTITY";
export type LossMode = "NONE" | "FIXED" | "PERCENT";
export type RoundingRule = "NONE" | "UP_TO_CENT" | "ENDING_90" | "ENDING_99";

export type CommercialProfileKey = "PIX" | "CARD" | "RESELLER" | "WHOLESALE" | "MARKETPLACE" | "CUSTOM";

export type PricingAlertCode =
  | "FREIGHT_ALLOCATED_WITH_CENT_ROUNDING"
  | "APPROVED_PRICE_EQUALS_BREAK_EVEN"
  | "APPROVED_PRICE_BELOW_TARGET"
  | "SUGGESTED_PRICE_BELOW_TARGET";

export type PricingErrorCode =
  | "NEGATIVE_MONEY"
  | "INVALID_PERCENT"
  | "INVALID_FREIGHT_QUANTITY"
  | "DENOMINATOR_NOT_POSITIVE"
  | "PRICE_BELOW_BREAK_EVEN"
  | "PRICE_NEGATIVE"
  | "NO_ACTIVE_PROFILES";

export interface PricingIssue {
  code: PricingAlertCode | PricingErrorCode;
  message: string;
  path?: string;
}

export type PricingAlert = PricingIssue & {
  code: PricingAlertCode;
};

export type PricingError = PricingIssue & {
  code: PricingErrorCode;
};

export interface CostInput {
  pieceCost: MoneyCents;
  packagingCost: MoneyCents;
  tagCost: MoneyCents;
  otherDirectCosts: MoneyCents;
}

export type FreightInput =
  | { mode: "NONE" }
  | { mode: "UNIT"; unitFreight: MoneyCents }
  | { mode: "TOTAL_BY_QUANTITY"; totalFreight: MoneyCents; quantity: bigint };

export type LossInput =
  | { mode: "NONE" }
  | { mode: "FIXED"; amount: MoneyCents }
  | { mode: "PERCENT"; percent: PercentBps };

export type PricingGoalInput =
  | { mode: "FIXED_PROFIT"; desiredProfit: MoneyCents }
  | { mode: "COST_MARKUP"; markupPercent: PercentBps }
  | { mode: "NET_MARGIN"; desiredMargin: PercentBps };

export interface CommercialProfileInput {
  key: CommercialProfileKey;
  name: string;
  isActive: boolean;
  fixedFee: MoneyCents;
  taxPercent: PercentBps;
  commissionPercent: PercentBps;
  discountPercent: PercentBps;
  taxesPercent: PercentBps;
  marketplacePercent: PercentBps;
  roundingRule: RoundingRule;
}

export interface ApprovedPriceInput {
  profileKey: CommercialProfileKey;
  price: MoneyCents;
}

export interface PricingInput {
  costs: CostInput;
  freight: FreightInput;
  loss: LossInput;
  goal: PricingGoalInput;
  profiles: CommercialProfileInput[];
  approvedPrices?: ApprovedPriceInput[];
}

export interface CostBreakdown {
  pieceCost: MoneyCents;
  packagingCost: MoneyCents;
  tagCost: MoneyCents;
  freightUnit: MoneyCents;
  otherDirectCosts: MoneyCents;
  costBase: MoneyCents;
  lossAmount: MoneyCents;
  costTotal: MoneyCents;
}

export interface ProfileSnapshot {
  key: CommercialProfileKey;
  name: string;
  fixedFee: MoneyCents;
  percentFeesTotal: PercentBps;
  taxPercent: PercentBps;
  commissionPercent: PercentBps;
  discountPercent: PercentBps;
  taxesPercent: PercentBps;
  marketplacePercent: PercentBps;
  roundingRule: RoundingRule;
}

export interface PricingProfileResult {
  profile: ProfileSnapshot;
  breakEvenPrice: MoneyCents;
  minimumRecommendedPrice: MoneyCents;
  technicalPrice: MoneyCents;
  suggestedPrice: MoneyCents;
  approvedPrice: MoneyCents | null;
  effectivePrice: MoneyCents;
  grossProfit: MoneyCents;
  netProfit: MoneyCents;
  netMarginBps: PercentBps;
  alerts: PricingAlert[];
  errors: PricingError[];
}

export interface PricingSnapshot {
  costs: CostBreakdown;
  freight: FreightInput;
  loss: LossInput;
  goal: PricingGoalInput;
  profiles: ProfileSnapshot[];
}

export interface PricingCalculationResult {
  ok: boolean;
  costs: CostBreakdown;
  results: PricingProfileResult[];
  alerts: PricingAlert[];
  errors: PricingError[];
  snapshot: PricingSnapshot;
}
