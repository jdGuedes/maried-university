"use server";

import { calculateOfficialPricingPreview, PricingServiceError, type PricingPreviewResult } from "./service";
import { validatePricingForm, type PricingFormValues } from "./form";

export type PricingPreviewActionResult =
  | { ok: true; message: string; result: PricingPreviewResult }
  | { ok: false; message: string; fieldErrors?: Partial<Record<keyof PricingFormValues, string>>; code: "INVALID_INPUT" | "CONFIGURATION_REQUIRED" | "ACCESS_DENIED" | "CALCULATION_FAILED" };

export async function calculatePricingPreviewAction(values: PricingFormValues): Promise<PricingPreviewActionResult> {
  const validation = validatePricingForm(values);

  if (!validation.ok) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Nao foi possivel calcular. Revise os dados e tente novamente.",
      fieldErrors: validation.fieldErrors
    };
  }

  try {
    const result = await calculateOfficialPricingPreview(validation.dto, { roundingRuleOverride: values.roundingRule });
    return {
      ok: true,
      message: "Calculo concluido.",
      result
    };
  } catch (error) {
    if (error instanceof PricingServiceError && error.message === "No active commercial profile is available.") {
      return {
        ok: false,
        code: "CONFIGURATION_REQUIRED",
        message: "Ainda nao ha perfil comercial ativo para calcular este preco. Configure um perfil antes de gerar o resultado oficial."
      };
    }

    if (error instanceof PricingServiceError && error.message === "Owner or admin role is required for pricing operations.") {
      return {
        ok: false,
        code: "ACCESS_DENIED",
        message: "Seu perfil atual nao tem permissao para calcular precificacoes oficiais."
      };
    }

    return {
      ok: false,
      code: "CALCULATION_FAILED",
      message: "Nao foi possivel calcular. Revise os dados e tente novamente."
    };
  }
}
