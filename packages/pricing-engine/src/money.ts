import type { MoneyCents, PercentBps } from "./contracts";

export const ZERO_CENTS = 0n;
export const ZERO_BPS = 0n;
export const ONE_HUNDRED_PERCENT_BPS = 10000n;

export function cents(value: bigint | string): MoneyCents {
  if (typeof value === "bigint") {
    return value;
  }

  if (!/^-?\d+$/.test(value)) {
    throw new Error("Money input must be integer cents.");
  }

  return BigInt(value);
}

export function bps(value: bigint | string): PercentBps {
  if (typeof value === "bigint") {
    return value;
  }

  if (!/^-?\d+$/.test(value)) {
    throw new Error("Percent input must be integer basis points.");
  }

  return BigInt(value);
}

export function addMoney(values: MoneyCents[]): MoneyCents {
  return values.reduce((total, value) => total + value, ZERO_CENTS);
}

export function ceilDiv(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) {
    throw new Error("Denominator must be positive.");
  }

  if (numerator >= 0n) {
    return (numerator + denominator - 1n) / denominator;
  }

  return numerator / denominator;
}

export function roundHalfUpDiv(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) {
    throw new Error("Denominator must be positive.");
  }

  if (numerator >= 0n) {
    return (numerator + denominator / 2n) / denominator;
  }

  return (numerator - denominator / 2n) / denominator;
}

export function applyPercent(amount: MoneyCents, percent: PercentBps): MoneyCents {
  return roundHalfUpDiv(amount * percent, ONE_HUNDRED_PERCENT_BPS);
}

export function priceFromDenominator(numerator: MoneyCents, percentTotal: PercentBps): MoneyCents {
  return ceilDiv(numerator * ONE_HUNDRED_PERCENT_BPS, ONE_HUNDRED_PERCENT_BPS - percentTotal);
}

export function calculateMarginBps(netProfit: MoneyCents, price: MoneyCents): PercentBps {
  if (price <= 0n) {
    return ZERO_BPS;
  }

  return roundHalfUpDiv(netProfit * ONE_HUNDRED_PERCENT_BPS, price);
}

export function formatCents(value: MoneyCents): string {
  const sign = value < 0n ? "-" : "";
  const absolute = value < 0n ? -value : value;
  const reais = absolute / 100n;
  const centavos = absolute % 100n;

  return `${sign}${reais.toString()}.${centavos.toString().padStart(2, "0")}`;
}
