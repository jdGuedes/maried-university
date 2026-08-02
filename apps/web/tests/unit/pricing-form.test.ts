import { describe, expect, it } from "vitest";
import {
  derivePricingFormStatus,
  firstErrorField,
  formatBpsToPercent,
  formatCentsToBrl,
  initialPricingFormValues,
  parseBrlToCents,
  parsePercentToBps,
  validatePricingForm
} from "../../lib/pricing/form";

describe("pricing form money and percent helpers", () => {
  it("converts friendly BRL values to integer cents without floating point", () => {
    expect(parseBrlToCents("R$ 1.234,56")).toBe("123456");
    expect(parseBrlToCents("12,3")).toBe("1230");
    expect(parseBrlToCents("12")).toBe("1200");
    expect(parseBrlToCents("10,555")).toBeNull();
    expect(parseBrlToCents("1e3")).toBeNull();
  });

  it("formats cents as pt-BR currency strings using bigint-safe formatting", () => {
    expect(formatCentsToBrl("123456")).toBe("R$ 1.234,56");
    expect(formatCentsToBrl(5n)).toBe("R$ 0,05");
  });

  it("converts percent input to basis points and back", () => {
    expect(parsePercentToBps("12,34%")).toBe("1234");
    expect(parsePercentToBps("100")).toBe("10000");
    expect(parsePercentToBps("100,01")).toBeNull();
    expect(formatBpsToPercent("1234")).toBe("12,34%");
  });
});

describe("pricing form validation", () => {
  it("builds the DTO for a valid direct freight and fixed loss calculation", () => {
    const validation = validatePricingForm({
      ...initialPricingFormValues,
      pieceName: "Anel Solitario",
      pieceCost: "R$ 10,00",
      packagingCost: "R$ 2,00",
      tagCost: "R$ 0,50",
      otherDirectCosts: "R$ 2,50",
      freightMode: "UNIT",
      freightUnit: "R$ 5,00",
      lossMode: "FIXED",
      lossAmount: "R$ 1,00",
      desiredProfit: "R$ 10,00"
    });

    expect(validation.ok).toBe(true);
    if (validation.ok) {
      expect(validation.dto.costs.pieceCostCents).toBe("1000");
      expect(validation.dto.freight).toEqual({ mode: "UNIT", unitFreightCents: "500" });
      expect(validation.dto.loss).toEqual({ mode: "FIXED", amountCents: "100" });
      expect(validation.dto.goal).toEqual({ mode: "FIXED_PROFIT", desiredProfitCents: "1000" });
      expect(validation.dto).not.toHaveProperty("tenantId");
      expect(validation.dto).not.toHaveProperty("technicalPriceCents");
    }
  });

  it("validates rated freight quantity and net margin denominator", () => {
    const validation = validatePricingForm({
      ...initialPricingFormValues,
      pieceName: "Brinco",
      pieceCost: "R$ 10,00",
      freightMode: "TOTAL_BY_QUANTITY",
      freightTotal: "R$ 12,00",
      freightQuantity: "0",
      pricingMode: "NET_MARGIN",
      desiredMargin: "100"
    });

    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.fieldErrors.freightQuantity).toBe("A quantidade deve ser maior que zero.");
      expect(validation.fieldErrors.desiredMargin).toBe("O percentual informado torna o calculo impossivel.");
      expect(firstErrorField(validation.fieldErrors)).toBe("freightQuantity");
    }
  });


  it("rejects unsupported rounding rules before calling the server action", () => {
    const validation = validatePricingForm({
      ...initialPricingFormValues,
      pieceName: "Brinco",
      pieceCost: "R$ 10,00",
      desiredProfit: "R$ 5,00",
      roundingRule: "CUSTOM" as typeof initialPricingFormValues.roundingRule
    });

    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.fieldErrors.roundingRule).toBe("Escolha uma regra de arredondamento valida.");
    }
  });
  it("derives the visible form state", () => {
    expect(derivePricingFormStatus({ dirty: false, hasErrors: false, hasResult: false, hasSubmitError: false, isSubmitting: false })).toBe("IDLE");
    expect(derivePricingFormStatus({ dirty: true, hasErrors: false, hasResult: false, hasSubmitError: false, isSubmitting: false })).toBe("DIRTY");
    expect(derivePricingFormStatus({ dirty: true, hasErrors: true, hasResult: false, hasSubmitError: false, isSubmitting: false })).toBe("INVALID");
    expect(derivePricingFormStatus({ dirty: true, hasErrors: false, hasResult: false, hasSubmitError: false, isSubmitting: true })).toBe("SUBMITTING");
    expect(derivePricingFormStatus({ dirty: false, hasErrors: false, hasResult: true, hasSubmitError: false, isSubmitting: false })).toBe("SUCCESS");
    expect(derivePricingFormStatus({ dirty: true, hasErrors: false, hasResult: false, hasSubmitError: true, isSubmitting: false })).toBe("ERROR");
  });
});
