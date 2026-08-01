import type {
  CommercialProfileInput,
  CostBreakdown,
  CostInput,
  FreightInput,
  LossInput,
  MoneyCents,
  PercentBps,
  PricingAlert,
  PricingCalculationResult,
  PricingError,
  PricingGoalInput,
  PricingInput,
  PricingProfileResult,
  ProfileSnapshot,
  RoundingRule
} from "./contracts";
import {
  ONE_HUNDRED_PERCENT_BPS,
  addMoney,
  applyPercent,
  calculateMarginBps,
  ceilDiv,
  priceFromDenominator
} from "./money";

const messages = {
  negativeMoney: "Valores monetarios nao podem ser negativos.",
  invalidPercent: "Percentuais devem estar entre 0 e 100%.",
  invalidFeePercent: "A soma das taxas percentuais deve ser menor que 100%.",
  invalidMargin: "A margem desejada nao e possivel com as taxas informadas.",
  invalidQuantity: "Quantidade deve ser maior que zero para ratear frete.",
  priceBelowBreakEven: "Preco aprovado abaixo do equilibrio e bloqueado.",
  priceNegative: "Preco nao pode ser negativo.",
  noActiveProfiles: "Informe ao menos um perfil comercial ativo."
} as const;

export function calculatePricing(input: PricingInput): PricingCalculationResult {
  const errors: PricingError[] = [];
  const alerts: PricingAlert[] = [];

  errors.push(...validateCosts(input.costs));
  errors.push(...validateFreight(input.freight));
  errors.push(...validateLoss(input.loss));
  errors.push(...validateGoal(input.goal));

  const activeProfiles = input.profiles.filter((profile) => profile.isActive);
  if (activeProfiles.length === 0) {
    errors.push(error("NO_ACTIVE_PROFILES", messages.noActiveProfiles, "profiles"));
  }

  const freightResult = canCalculateFreight(input.freight)
    ? calculateFreightUnit(input.freight)
    : { freightUnit: 0n, alerts: [] };
  alerts.push(...freightResult.alerts);

  const costs = calculateCosts(input.costs, freightResult.freightUnit, input.loss);
  const approvedPrices = new Map((input.approvedPrices ?? []).map((approved) => [approved.profileKey, approved.price]));

  const results = activeProfiles.map((profile) => {
    const result = calculateProfileResult(profile, input.goal, costs, approvedPrices.get(profile.key) ?? null);
    return result;
  });

  const nestedErrors = results.flatMap((result) => result.errors);
  const nestedAlerts = results.flatMap((result) => result.alerts);
  const allErrors = [...errors, ...nestedErrors];
  const allAlerts = [...alerts, ...nestedAlerts];

  return {
    ok: allErrors.length === 0,
    costs,
    results,
    alerts: allAlerts,
    errors: allErrors,
    snapshot: {
      costs,
      freight: input.freight,
      loss: input.loss,
      goal: input.goal,
      profiles: results.map((result) => result.profile)
    }
  };
}

export function calculateCosts(costs: CostInput, freightUnit: MoneyCents, loss: LossInput): CostBreakdown {
  const costBase = addMoney([costs.pieceCost, costs.packagingCost, costs.tagCost, freightUnit, costs.otherDirectCosts]);
  const lossAmount = calculateLossAmount(costBase, loss);

  return {
    pieceCost: costs.pieceCost,
    packagingCost: costs.packagingCost,
    tagCost: costs.tagCost,
    freightUnit,
    otherDirectCosts: costs.otherDirectCosts,
    costBase,
    lossAmount,
    costTotal: costBase + lossAmount
  };
}

export function calculateFreightUnit(freight: FreightInput): { freightUnit: MoneyCents; alerts: PricingAlert[] } {
  if (freight.mode === "NONE") {
    return { freightUnit: 0n, alerts: [] };
  }

  if (freight.mode === "UNIT") {
    return { freightUnit: freight.unitFreight, alerts: [] };
  }

  const freightUnit = ceilDiv(freight.totalFreight, freight.quantity);
  const alerts = freight.totalFreight % freight.quantity === 0n
    ? []
    : [alert("FREIGHT_ALLOCATED_WITH_CENT_ROUNDING", "Frete unitario foi arredondado para cima para nao subestimar custo.", "freight")];

  return { freightUnit, alerts };
}

function canCalculateFreight(freight: FreightInput): boolean {
  return freight.mode !== "TOTAL_BY_QUANTITY" || freight.quantity > 0n;
}

export function calculateLossAmount(costBase: MoneyCents, loss: LossInput): MoneyCents {
  if (loss.mode === "NONE") {
    return 0n;
  }

  if (loss.mode === "FIXED") {
    return loss.amount;
  }

  return applyPercent(costBase, loss.percent);
}

export function calculateProfileResult(
  profile: CommercialProfileInput,
  goal: PricingGoalInput,
  costs: CostBreakdown,
  approvedPrice: MoneyCents | null
): PricingProfileResult {
  const profileErrors = validateProfile(profile);
  const profileSnapshot = createProfileSnapshot(profile);
  const percentFeesTotal = profileSnapshot.percentFeesTotal;

  if (percentFeesTotal >= ONE_HUNDRED_PERCENT_BPS) {
    profileErrors.push(error("DENOMINATOR_NOT_POSITIVE", messages.invalidFeePercent, `profiles.${profile.key}`));
  }

  if (goal.mode === "NET_MARGIN" && percentFeesTotal + goal.desiredMargin >= ONE_HUNDRED_PERCENT_BPS) {
    profileErrors.push(error("DENOMINATOR_NOT_POSITIVE", messages.invalidMargin, `profiles.${profile.key}.desiredMargin`));
  }

  const breakEvenPrice = profileErrors.some((item) => item.code === "DENOMINATOR_NOT_POSITIVE")
    ? 0n
    : priceFromDenominator(costs.costTotal + profile.fixedFee, percentFeesTotal);
  const minimumRecommendedPrice = calculateMinimumRecommendedPrice(costs.costTotal, profile.fixedFee, percentFeesTotal, goal, profileErrors);
  const technicalPrice = calculateTechnicalPrice(costs.costTotal, profile.fixedFee, percentFeesTotal, goal, profileErrors);
  const suggestedPrice = applyRoundingRule(technicalPrice, profile.roundingRule);
  const effectivePrice = approvedPrice ?? suggestedPrice;
  const alerts: PricingAlert[] = [];
  const errors: PricingError[] = [...profileErrors];

  if (effectivePrice < 0n) {
    errors.push(error("PRICE_NEGATIVE", messages.priceNegative, `approvedPrices.${profile.key}`));
  }

  if (effectivePrice < breakEvenPrice) {
    errors.push(error("PRICE_BELOW_BREAK_EVEN", messages.priceBelowBreakEven, `approvedPrices.${profile.key}`));
  } else if (approvedPrice !== null && effectivePrice === breakEvenPrice) {
    alerts.push(alert("APPROVED_PRICE_EQUALS_BREAK_EVEN", "Preco aprovado cobre os custos, mas gera lucro zero.", `approvedPrices.${profile.key}`));
  } else if (approvedPrice !== null && effectivePrice < minimumRecommendedPrice) {
    alerts.push(alert("APPROVED_PRICE_BELOW_TARGET", "Preco aprovado esta acima do equilibrio, mas abaixo da meta definida.", `approvedPrices.${profile.key}`));
  } else if (approvedPrice === null && suggestedPrice < minimumRecommendedPrice) {
    alerts.push(alert("SUGGESTED_PRICE_BELOW_TARGET", "Preco sugerido esta abaixo da meta definida para o perfil.", `profiles.${profile.key}`));
  }

  const netProfit = calculateNetProfit(effectivePrice, costs.costTotal, profile.fixedFee, percentFeesTotal);

  return {
    profile: profileSnapshot,
    breakEvenPrice,
    minimumRecommendedPrice,
    technicalPrice,
    suggestedPrice,
    approvedPrice,
    effectivePrice,
    grossProfit: effectivePrice - costs.costTotal,
    netProfit,
    netMarginBps: calculateMarginBps(netProfit, effectivePrice),
    alerts,
    errors
  };
}

export function calculateNetProfit(
  price: MoneyCents,
  costTotal: MoneyCents,
  fixedFee: MoneyCents,
  percentFeesTotal: PercentBps
): MoneyCents {
  return price - costTotal - fixedFee - applyPercent(price, percentFeesTotal);
}

export function calculateBreakEvenPrice(costTotal: MoneyCents, fixedFee: MoneyCents, percentFeesTotal: PercentBps): MoneyCents {
  return priceFromDenominator(costTotal + fixedFee, percentFeesTotal);
}

export function applyRoundingRule(price: MoneyCents, rule: RoundingRule): MoneyCents {
  if (rule === "NONE") {
    return price;
  }

  if (rule === "UP_TO_CENT") {
    return price;
  }

  const reais = price / 100n;
  const centsPart = price % 100n;

  if (rule === "ENDING_90") {
    const target = reais * 100n + 90n;
    return centsPart <= 90n ? target : (reais + 1n) * 100n + 90n;
  }

  const target = reais * 100n + 99n;
  return centsPart <= 99n ? target : (reais + 1n) * 100n + 99n;
}

function calculateTechnicalPrice(
  costTotal: MoneyCents,
  fixedFee: MoneyCents,
  percentFeesTotal: PercentBps,
  goal: PricingGoalInput,
  errors: PricingError[]
): MoneyCents {
  if (hasDenominatorError(errors)) {
    return 0n;
  }

  if (goal.mode === "FIXED_PROFIT") {
    return priceFromDenominator(costTotal + fixedFee + goal.desiredProfit, percentFeesTotal);
  }

  if (goal.mode === "COST_MARKUP") {
    return costTotal + applyPercent(costTotal, goal.markupPercent);
  }

  return priceFromDenominator(costTotal + fixedFee, percentFeesTotal + goal.desiredMargin);
}

function calculateMinimumRecommendedPrice(
  costTotal: MoneyCents,
  fixedFee: MoneyCents,
  percentFeesTotal: PercentBps,
  goal: PricingGoalInput,
  errors: PricingError[]
): MoneyCents {
  if (hasDenominatorError(errors)) {
    return 0n;
  }

  if (goal.mode === "FIXED_PROFIT") {
    return priceFromDenominator(costTotal + fixedFee + goal.desiredProfit, percentFeesTotal);
  }

  if (goal.mode === "NET_MARGIN") {
    return priceFromDenominator(costTotal + fixedFee, percentFeesTotal + goal.desiredMargin);
  }

  return costTotal + applyPercent(costTotal, goal.markupPercent);
}

function createProfileSnapshot(profile: CommercialProfileInput): ProfileSnapshot {
  return {
    key: profile.key,
    name: profile.name,
    fixedFee: profile.fixedFee,
    percentFeesTotal: addPercents([
      profile.taxPercent,
      profile.commissionPercent,
      profile.discountPercent,
      profile.taxesPercent,
      profile.marketplacePercent
    ]),
    taxPercent: profile.taxPercent,
    commissionPercent: profile.commissionPercent,
    discountPercent: profile.discountPercent,
    taxesPercent: profile.taxesPercent,
    marketplacePercent: profile.marketplacePercent,
    roundingRule: profile.roundingRule
  };
}

function validateCosts(costs: CostInput): PricingError[] {
  return validateMoney(
    [
      ["costs.pieceCost", costs.pieceCost],
      ["costs.packagingCost", costs.packagingCost],
      ["costs.tagCost", costs.tagCost],
      ["costs.otherDirectCosts", costs.otherDirectCosts]
    ]
  );
}

function validateFreight(freight: FreightInput): PricingError[] {
  if (freight.mode === "NONE") {
    return [];
  }

  if (freight.mode === "UNIT") {
    return validateMoney([["freight.unitFreight", freight.unitFreight]]);
  }

  return [
    ...validateMoney([["freight.totalFreight", freight.totalFreight]]),
    ...(freight.quantity <= 0n ? [error("INVALID_FREIGHT_QUANTITY", messages.invalidQuantity, "freight.quantity")] : [])
  ];
}

function validateLoss(loss: LossInput): PricingError[] {
  if (loss.mode === "NONE") {
    return [];
  }

  if (loss.mode === "FIXED") {
    return validateMoney([["loss.amount", loss.amount]]);
  }

  return validatePercent("loss.percent", loss.percent, true);
}

function validateGoal(goal: PricingGoalInput): PricingError[] {
  if (goal.mode === "FIXED_PROFIT") {
    return validateMoney([["goal.desiredProfit", goal.desiredProfit]]);
  }

  if (goal.mode === "COST_MARKUP") {
    return validatePercent("goal.markupPercent", goal.markupPercent, true);
  }

  return validatePercent("goal.desiredMargin", goal.desiredMargin, false);
}

function validateProfile(profile: CommercialProfileInput): PricingError[] {
  return [
    ...validateMoney([["profile.fixedFee", profile.fixedFee]]),
    ...validatePercent("profile.taxPercent", profile.taxPercent, true),
    ...validatePercent("profile.commissionPercent", profile.commissionPercent, true),
    ...validatePercent("profile.discountPercent", profile.discountPercent, true),
    ...validatePercent("profile.taxesPercent", profile.taxesPercent, true),
    ...validatePercent("profile.marketplacePercent", profile.marketplacePercent, true)
  ];
}

function validateMoney(entries: Array<[string, MoneyCents]>): PricingError[] {
  return entries.flatMap(([path, value]) => (value < 0n ? [error("NEGATIVE_MONEY", messages.negativeMoney, path)] : []));
}

function validatePercent(path: string, value: PercentBps, allowOneHundred: boolean): PricingError[] {
  const upperBoundIsInvalid = allowOneHundred ? value > ONE_HUNDRED_PERCENT_BPS : value >= ONE_HUNDRED_PERCENT_BPS;
  return value < 0n || upperBoundIsInvalid ? [error("INVALID_PERCENT", messages.invalidPercent, path)] : [];
}

function addPercents(values: PercentBps[]): PercentBps {
  return values.reduce((total, value) => total + value, 0n);
}

function hasDenominatorError(errors: PricingError[]): boolean {
  return errors.some((item) => item.code === "DENOMINATOR_NOT_POSITIVE");
}

function error(code: PricingError["code"], message: string, path?: string): PricingError {
  return { code, message, path };
}

function alert(code: PricingAlert["code"], message: string, path?: string): PricingAlert {
  return { code, message, path };
}
