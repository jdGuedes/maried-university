import type { CreatePricingCalculationDto, PricingFreightDto, PricingGoalDto, PricingLossDto } from "./dto";

export type PricingFormStatus = "IDLE" | "DIRTY" | "INVALID" | "SUBMITTING" | "SUCCESS" | "ERROR";
export type PricingFormField = keyof PricingFormValues;

export type PricingFormValues = {
  pieceName: string;
  pieceCost: string;
  packagingCost: string;
  tagCost: string;
  otherDirectCosts: string;
  freightMode: "NONE" | "UNIT" | "TOTAL_BY_QUANTITY";
  freightUnit: string;
  freightTotal: string;
  freightQuantity: string;
  lossMode: "NONE" | "FIXED" | "PERCENT";
  lossAmount: string;
  lossPercent: string;
  pricingMode: "FIXED_PROFIT" | "COST_MARKUP" | "NET_MARGIN";
  desiredProfit: string;
  markupPercent: string;
  desiredMargin: string;
};

export type PricingFormValidation =
  | { ok: true; dto: CreatePricingCalculationDto; fieldErrors: Partial<Record<PricingFormField, string>> }
  | { ok: false; fieldErrors: Partial<Record<PricingFormField, string>> };

const REQUIRED_NAME_MESSAGE = "Informe o nome da peca.";
const INVALID_VALUE_MESSAGE = "Informe um valor valido.";
const INVALID_PERCENT_MESSAGE = "Informe um percentual valido.";
const INVALID_QUANTITY_MESSAGE = "A quantidade deve ser maior que zero.";
const IMPOSSIBLE_PERCENT_MESSAGE = "O percentual informado torna o calculo impossivel.";
const MAX_MONEY_CENTS = 999999999999n;

export const initialPricingFormValues: PricingFormValues = {
  pieceName: "",
  pieceCost: "",
  packagingCost: "",
  tagCost: "",
  otherDirectCosts: "",
  freightMode: "NONE",
  freightUnit: "",
  freightTotal: "",
  freightQuantity: "",
  lossMode: "NONE",
  lossAmount: "",
  lossPercent: "",
  pricingMode: "FIXED_PROFIT",
  desiredProfit: "",
  markupPercent: "",
  desiredMargin: ""
};

export function validatePricingForm(values: PricingFormValues): PricingFormValidation {
  const fieldErrors: Partial<Record<PricingFormField, string>> = {};
  const pieceName = normalizePieceName(values.pieceName);

  if (!pieceName) {
    fieldErrors.pieceName = REQUIRED_NAME_MESSAGE;
  } else if (pieceName.length > 120) {
    fieldErrors.pieceName = "Use ate 120 caracteres.";
  }

  const pieceCost = parseRequiredMoney(values.pieceCost, "pieceCost", fieldErrors);
  const packagingCost = parseOptionalMoney(values.packagingCost, "packagingCost", fieldErrors);
  const tagCost = parseOptionalMoney(values.tagCost, "tagCost", fieldErrors);
  const otherDirectCosts = parseOptionalMoney(values.otherDirectCosts, "otherDirectCosts", fieldErrors);
  const freight = parseFreight(values, fieldErrors);
  const loss = parseLoss(values, fieldErrors);
  const goal = parseGoal(values, fieldErrors);

  if (Object.keys(fieldErrors).length > 0 || !pieceName || pieceCost === null || packagingCost === null || tagCost === null || otherDirectCosts === null || !freight || !loss || !goal) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    fieldErrors,
    dto: {
      pieceName,
      notes: null,
      productId: null,
      costs: {
        pieceCostCents: pieceCost,
        packagingCostCents: packagingCost,
        tagCostCents: tagCost,
        otherDirectCostsCents: otherDirectCosts
      },
      freight,
      loss,
      goal
    }
  };
}

export function derivePricingFormStatus(params: {
  dirty: boolean;
  hasErrors: boolean;
  isSubmitting: boolean;
  hasResult: boolean;
  hasSubmitError: boolean;
}): PricingFormStatus {
  if (params.isSubmitting) {
    return "SUBMITTING";
  }

  if (params.hasSubmitError) {
    return "ERROR";
  }

  if (params.hasErrors) {
    return "INVALID";
  }

  if (params.hasResult) {
    return "SUCCESS";
  }

  return params.dirty ? "DIRTY" : "IDLE";
}

export function parseBrlToCents(rawValue: string): string | null {
  const normalized = normalizeMoneyText(rawValue);
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("-")) {
    return null;
  }

  const parts = normalized.split(",");
  if (parts.length > 2) {
    return null;
  }

  const reais = parts[0].replace(/\./g, "");
  const cents = parts[1] ?? "";

  if (!/^\d+$/.test(reais) || !/^\d{0,2}$/.test(cents)) {
    return null;
  }

  const centavos = `${reais}${cents.padEnd(2, "0")}`.replace(/^0+(?=\d)/, "");
  const value = BigInt(centavos || "0");

  if (value > MAX_MONEY_CENTS) {
    return null;
  }

  return value.toString();
}

export function formatCentsToBrl(value: string | bigint): string {
  const cents = typeof value === "bigint" ? value : BigInt(value || "0");
  const sign = cents < 0n ? "-" : "";
  const absolute = cents < 0n ? -cents : cents;
  const reais = absolute / 100n;
  const centavos = (absolute % 100n).toString().padStart(2, "0");
  return `${sign}R$ ${groupThousands(reais.toString())},${centavos}`;
}

export function parsePercentToBps(rawValue: string): string | null {
  const normalized = rawValue.trim().replace(/%/g, "").replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (!normalized || normalized.startsWith("-")) {
    return null;
  }

  const parts = normalized.split(".");
  if (parts.length > 2) {
    return null;
  }

  const integer = parts[0];
  const decimals = parts[1] ?? "";
  if (!/^\d+$/.test(integer) || !/^\d{0,2}$/.test(decimals)) {
    return null;
  }

  const bps = BigInt(integer) * 100n + BigInt(decimals.padEnd(2, "0") || "0");
  if (bps > 10000n) {
    return null;
  }

  return bps.toString();
}

export function formatBpsToPercent(value: string | bigint): string {
  const bps = typeof value === "bigint" ? value : BigInt(value || "0");
  const sign = bps < 0n ? "-" : "";
  const absolute = bps < 0n ? -bps : bps;
  const integer = absolute / 100n;
  const decimals = (absolute % 100n).toString().padStart(2, "0");
  return `${sign}${integer.toString()},${decimals}%`;
}

export function firstErrorField(fieldErrors: Partial<Record<PricingFormField, string>>): PricingFormField | null {
  const order: PricingFormField[] = [
    "pieceName",
    "pieceCost",
    "packagingCost",
    "tagCost",
    "otherDirectCosts",
    "freightUnit",
    "freightTotal",
    "freightQuantity",
    "lossAmount",
    "lossPercent",
    "desiredProfit",
    "markupPercent",
    "desiredMargin"
  ];

  return order.find((field) => fieldErrors[field]) ?? null;
}

function parseFreight(values: PricingFormValues, fieldErrors: Partial<Record<PricingFormField, string>>): PricingFreightDto | null {
  if (values.freightMode === "NONE") {
    return { mode: "NONE" };
  }

  if (values.freightMode === "UNIT") {
    const unitFreightCents = parseOptionalMoney(values.freightUnit, "freightUnit", fieldErrors);
    return unitFreightCents === null ? null : { mode: "UNIT", unitFreightCents };
  }

  const totalFreightCents = parseRequiredMoney(values.freightTotal, "freightTotal", fieldErrors);
  const quantity = parsePositiveInteger(values.freightQuantity);
  if (quantity === null) {
    fieldErrors.freightQuantity = INVALID_QUANTITY_MESSAGE;
  }

  return totalFreightCents === null || quantity === null ? null : { mode: "TOTAL_BY_QUANTITY", totalFreightCents, quantity };
}

function parseLoss(values: PricingFormValues, fieldErrors: Partial<Record<PricingFormField, string>>): PricingLossDto | null {
  if (values.lossMode === "NONE") {
    return { mode: "NONE" };
  }

  if (values.lossMode === "FIXED") {
    const amountCents = parseOptionalMoney(values.lossAmount, "lossAmount", fieldErrors);
    return amountCents === null ? null : { mode: "FIXED", amountCents };
  }

  const percentBps = parseRequiredPercent(values.lossPercent, "lossPercent", fieldErrors, true);
  return percentBps === null ? null : { mode: "PERCENT", percentBps };
}

function parseGoal(values: PricingFormValues, fieldErrors: Partial<Record<PricingFormField, string>>): PricingGoalDto | null {
  if (values.pricingMode === "FIXED_PROFIT") {
    const desiredProfitCents = parseRequiredMoney(values.desiredProfit, "desiredProfit", fieldErrors);
    return desiredProfitCents === null ? null : { mode: "FIXED_PROFIT", desiredProfitCents };
  }

  if (values.pricingMode === "COST_MARKUP") {
    const markupBps = parseRequiredPercent(values.markupPercent, "markupPercent", fieldErrors, true);
    return markupBps === null ? null : { mode: "COST_MARKUP", markupBps };
  }

  const desiredMarginBps = parseRequiredPercent(values.desiredMargin, "desiredMargin", fieldErrors, false);
  return desiredMarginBps === null ? null : { mode: "NET_MARGIN", desiredMarginBps };
}

function parseRequiredMoney(rawValue: string, field: PricingFormField, fieldErrors: Partial<Record<PricingFormField, string>>): string | null {
  const parsed = parseBrlToCents(rawValue);
  if (parsed === null) {
    fieldErrors[field] = INVALID_VALUE_MESSAGE;
  }
  return parsed;
}

function parseOptionalMoney(rawValue: string, field: PricingFormField, fieldErrors: Partial<Record<PricingFormField, string>>): string | null {
  if (!rawValue.trim()) {
    return "0";
  }
  return parseRequiredMoney(rawValue, field, fieldErrors);
}

function parseRequiredPercent(
  rawValue: string,
  field: PricingFormField,
  fieldErrors: Partial<Record<PricingFormField, string>>,
  allowOneHundred: boolean
): string | null {
  const parsed = parsePercentToBps(rawValue);
  if (parsed === null) {
    fieldErrors[field] = INVALID_PERCENT_MESSAGE;
    return null;
  }

  if (!allowOneHundred && BigInt(parsed) >= 10000n) {
    fieldErrors[field] = IMPOSSIBLE_PERCENT_MESSAGE;
    return null;
  }

  return parsed;
}

function parsePositiveInteger(rawValue: string): string | null {
  const normalized = rawValue.trim();
  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const value = BigInt(normalized);
  return value > 0n ? value.toString() : null;
}

function normalizePieceName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeMoneyText(value: string): string {
  return value.trim().replace(/R\$/gi, "").replace(/\s/g, "");
}

function groupThousands(value: string): string {
  let output = "";
  let count = 0;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    output = `${value[index]}${output}`;
    count += 1;
    if (count === 3 && index > 0) {
      output = `.${output}`;
      count = 0;
    }
  }

  return output;
}
