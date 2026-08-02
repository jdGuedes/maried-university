"use client";

import { ArrowDown, Calculator, CheckCircle2, CircleAlert, Sparkles, Trophy } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Alert } from "@/components/feedback";
import { Button, Field, Input, StatusBadge } from "@/components/ui";
import { calculatePricingPreviewAction, type PricingPreviewActionResult } from "@/lib/pricing/actions";
import {
  derivePricingFormStatus,
  firstErrorField,
  formatBpsToPercent,
  formatCentsToBrl,
  initialPricingFormValues,
  parseBrlToCents,
  parsePercentToBps,
  validatePricingForm,
  type PricingFormField,
  type PricingFormStatus,
  type PricingFormValues
} from "@/lib/pricing/form";
import type { JsonSafe } from "@/lib/pricing/dto";
import type { PricingPreviewProfileResult, PricingPreviewResult } from "@/lib/pricing/service";

type SubmitState = Extract<PricingPreviewActionResult, { ok: false }> | null;

type PricingTextIssue = {
  code: string;
  message: string;
};

const fieldIds: Record<PricingFormField, string> = {
  pieceName: "pricing-piece-name",
  pieceCost: "pricing-piece-cost",
  packagingCost: "pricing-packaging-cost",
  tagCost: "pricing-tag-cost",
  otherDirectCosts: "pricing-other-costs",
  freightMode: "pricing-freight-mode",
  freightUnit: "pricing-freight-unit",
  freightTotal: "pricing-freight-total",
  freightQuantity: "pricing-freight-quantity",
  lossMode: "pricing-loss-mode",
  lossAmount: "pricing-loss-amount",
  lossPercent: "pricing-loss-percent",
  pricingMode: "pricing-mode",
  desiredProfit: "pricing-desired-profit",
  markupPercent: "pricing-markup-percent",
  desiredMargin: "pricing-desired-margin",
  roundingRule: "pricing-rounding-rule"
};

const statusLabel: Record<PricingFormStatus, string> = {
  IDLE: "Pronto para preencher",
  DIRTY: "Dados em edicao",
  INVALID: "Revise os campos",
  SUBMITTING: "Calculando",
  SUCCESS: "Comparacao oficial",
  ERROR: "Nao calculado"
};

const profileLabels: Record<PricingPreviewProfileResult["profileKey"], string> = {
  PIX: "Pix",
  CARD: "Cartao",
  RESELLER: "Revendedora",
  WHOLESALE: "Atacado",
  MARKETPLACE: "Marketplace",
  CUSTOM: "Personalizado"
};

const roundingLabels: Record<PricingFormValues["roundingRule"], string> = {
  NONE: "Valor exato",
  ENDING_90: "Final .90",
  ENDING_99: "Final .99",
  UP_TO_CENT: "Arredondar para cima"
};

export function PricingCalculatorForm() {
  const [values, setValues] = useState<PricingFormValues>(initialPricingFormValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<PricingFormField, string>>>({});
  const [submitError, setSubmitError] = useState<SubmitState>(null);
  const [result, setResult] = useState<PricingPreviewResult | null>(null);
  const [dirty, setDirty] = useState(false);
  const [resultStale, setResultStale] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<Partial<Record<PricingFormField, HTMLInputElement | null>>>({});

  const status = derivePricingFormStatus({
    dirty,
    hasErrors: Object.keys(fieldErrors).length > 0,
    isSubmitting: isPending,
    hasResult: Boolean(result) && !resultStale,
    hasSubmitError: Boolean(submitError)
  });

  function updateValue(field: PricingFormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setDirty(true);
    setSubmitError(null);
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    if (result) {
      setResultStale(true);
    }
  }

  function focusFirstError(errors: Partial<Record<PricingFormField, string>>) {
    const first = firstErrorField(errors);
    if (first) {
      inputRefs.current[first]?.focus();
    }
  }

  function handleSubmit() {
    const validation = validatePricingForm(values);
    if (!validation.ok) {
      setFieldErrors(validation.fieldErrors);
      setSubmitError(null);
      focusFirstError(validation.fieldErrors);
      return;
    }

    setFieldErrors({});
    setSubmitError(null);

    startTransition(async () => {
      const response = await calculatePricingPreviewAction(values);
      if (response.ok) {
        setResult(response.result);
        setResultStale(false);
        setDirty(false);
        return;
      }

      setResult(null);
      setResultStale(false);
      setSubmitError(response);
      if (response.fieldErrors) {
        setFieldErrors(response.fieldErrors);
        focusFirstError(response.fieldErrors);
      }
    });
  }

  return (
    <div className="pricing-workspace" data-form-status={status}>
      <form className="pricing-form" noValidate onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
        <div className="pricing-form__heading">
          <div>
            <h2>Dados para comparar</h2>
            <p>Preencha os custos uma vez. O servidor calcula todos os perfis comerciais ativos do tenant.</p>
          </div>
          <StatusBadge tone={status === "SUCCESS" ? "success" : status === "INVALID" || status === "ERROR" ? "warning" : "info"}>{statusLabel[status]}</StatusBadge>
        </div>

        <section className="pricing-section" aria-labelledby="pricing-identification-title">
          <div className="pricing-section__heading">
            <span>1</span>
            <div>
              <h3 id="pricing-identification-title">Identificacao</h3>
              <p>Nome da peca usado no calculo desta rodada.</p>
            </div>
          </div>
          <Field error={fieldErrors.pieceName} htmlFor={fieldIds.pieceName} label="Nome da peca">
            <Input
              id={fieldIds.pieceName}
              invalid={Boolean(fieldErrors.pieceName)}
              maxLength={120}
              placeholder="Ex.: Brinco argola dourada"
              ref={(node) => { inputRefs.current.pieceName = node; }}
              value={values.pieceName}
              onChange={(event) => updateValue("pieceName", event.target.value)}
            />
          </Field>
        </section>

        <section className="pricing-section" aria-labelledby="pricing-costs-title">
          <div className="pricing-section__heading">
            <span>2</span>
            <div>
              <h3 id="pricing-costs-title">Custos</h3>
              <p>Valores em BRL. Campos opcionais vazios entram como zero.</p>
            </div>
          </div>
          <div className="pricing-field-grid">
            <MoneyField field="pieceCost" label="Custo da peca" required values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} />
            <MoneyField field="packagingCost" label="Embalagem" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} />
            <MoneyField field="tagCost" label="Etiqueta ou tag" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} />
            <MoneyField field="otherDirectCosts" label="Outros custos" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} />
          </div>
        </section>

        <section className="pricing-section" aria-labelledby="pricing-freight-title">
          <div className="pricing-section__heading">
            <span>3</span>
            <div>
              <h3 id="pricing-freight-title">Frete</h3>
              <p>Escolha como o frete entra no custo da unidade.</p>
            </div>
          </div>
          <RadioGroup
            legend="Modo de frete"
            name="freightMode"
            options={[
              { value: "NONE", label: "Sem frete" },
              { value: "UNIT", label: "Por peca" },
              { value: "TOTAL_BY_QUANTITY", label: "Rateado" }
            ]}
            value={values.freightMode}
            onChange={(value) => updateValue("freightMode", value)}
          />
          {values.freightMode === "UNIT" ? <MoneyField field="freightUnit" label="Frete por peca" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} /> : null}
          {values.freightMode === "TOTAL_BY_QUANTITY" ? (
            <div className="pricing-field-grid">
              <MoneyField field="freightTotal" label="Frete total" required values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} />
              <Field error={fieldErrors.freightQuantity} htmlFor={fieldIds.freightQuantity} label="Quantidade para rateio">
                <Input
                  id={fieldIds.freightQuantity}
                  inputMode="numeric"
                  invalid={Boolean(fieldErrors.freightQuantity)}
                  placeholder="Ex.: 12"
                  ref={(node) => { inputRefs.current.freightQuantity = node; }}
                  value={values.freightQuantity}
                  onChange={(event) => updateValue("freightQuantity", event.target.value)}
                />
              </Field>
            </div>
          ) : null}
        </section>

        <section className="pricing-section" aria-labelledby="pricing-loss-title">
          <div className="pricing-section__heading">
            <span>4</span>
            <div>
              <h3 id="pricing-loss-title">Perdas</h3>
              <p>Reserva para perda fixa ou percentual quando existir.</p>
            </div>
          </div>
          <RadioGroup
            legend="Modo de perda"
            name="lossMode"
            options={[
              { value: "NONE", label: "Sem perda" },
              { value: "FIXED", label: "Fixa" },
              { value: "PERCENT", label: "Percentual" }
            ]}
            value={values.lossMode}
            onChange={(value) => updateValue("lossMode", value)}
          />
          {values.lossMode === "FIXED" ? <MoneyField field="lossAmount" label="Valor da perda" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} /> : null}
          {values.lossMode === "PERCENT" ? <PercentageField field="lossPercent" label="Percentual de perda" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} /> : null}
        </section>

        <section className="pricing-section" aria-labelledby="pricing-mode-title">
          <div className="pricing-section__heading">
            <span>5</span>
            <div>
              <h3 id="pricing-mode-title">Modo de precificacao</h3>
              <p>Defina a meta comercial desta rodada.</p>
            </div>
          </div>
          <RadioGroup
            legend="Modo de calculo"
            name="pricingMode"
            options={[
              { value: "FIXED_PROFIT", label: "Lucro fixo" },
              { value: "COST_MARKUP", label: "Acrescimo" },
              { value: "NET_MARGIN", label: "Margem liquida" }
            ]}
            value={values.pricingMode}
            onChange={(value) => updateValue("pricingMode", value)}
          />
          {values.pricingMode === "FIXED_PROFIT" ? <MoneyField field="desiredProfit" label="Lucro desejado" required values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} /> : null}
          {values.pricingMode === "COST_MARKUP" ? <PercentageField field="markupPercent" label="Acrescimo sobre custo" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} /> : null}
          {values.pricingMode === "NET_MARGIN" ? <PercentageField field="desiredMargin" label="Margem liquida desejada" values={values} errors={fieldErrors} refs={inputRefs} onChange={updateValue} /> : null}
        </section>

        <section className="pricing-section" aria-labelledby="pricing-rounding-title">
          <div className="pricing-section__heading">
            <span>6</span>
            <div>
              <h3 id="pricing-rounding-title">Arredondamento</h3>
              <p>A regra escolhida e validada no servidor e aplicada a todos os perfis nesta simulacao.</p>
            </div>
          </div>
          <RadioGroup
            columns="four"
            legend="Regra de arredondamento"
            name="roundingRule"
            options={[
              { value: "NONE", label: roundingLabels.NONE },
              { value: "ENDING_90", label: roundingLabels.ENDING_90 },
              { value: "ENDING_99", label: roundingLabels.ENDING_99 },
              { value: "UP_TO_CENT", label: roundingLabels.UP_TO_CENT }
            ]}
            value={values.roundingRule}
            onChange={(value) => updateValue("roundingRule", value)}
          />
          {fieldErrors.roundingRule ? <p className="pricing-inline-error">{fieldErrors.roundingRule}</p> : null}
        </section>

        {submitError ? (
          <Alert title="Calculo nao concluido" tone={submitError.code === "CONFIGURATION_REQUIRED" ? "warning" : submitError.code === "ACCESS_DENIED" ? "danger" : "warning"}>
            {submitError.message}
          </Alert>
        ) : null}

        <div className="pricing-actions">
          <Button disabled={isPending} size="lg" type="submit">
            {isPending ? "Calculando" : "Comparar perfis"}
            <Calculator aria-hidden="true" size={18} />
          </Button>
          {resultStale ? <span className="pricing-stale">Resultado anterior desatualizado pelos novos dados.</span> : null}
        </div>
      </form>

      <PricingComparison result={result} stale={resultStale} />
    </div>
  );
}

function MoneyField({ errors, field, label, onChange, refs, required = false, values }: {
  errors: Partial<Record<PricingFormField, string>>;
  field: PricingFormField;
  label: string;
  onChange: (field: PricingFormField, value: string) => void;
  refs: React.MutableRefObject<Partial<Record<PricingFormField, HTMLInputElement | null>>>;
  required?: boolean;
  values: PricingFormValues;
}) {
  return (
    <Field description={required ? "Obrigatorio." : "Opcional."} error={errors[field]} htmlFor={fieldIds[field]} label={label}>
      <Input
        id={fieldIds[field]}
        inputMode="decimal"
        invalid={Boolean(errors[field])}
        placeholder="R$ 0,00"
        ref={(node) => { refs.current[field] = node; }}
        value={values[field]}
        onBlur={(event) => {
          const parsed = parseBrlToCents(event.target.value);
          if (parsed !== null) {
            onChange(field, formatCentsToBrl(parsed));
          }
        }}
        onChange={(event) => onChange(field, event.target.value)}
      />
    </Field>
  );
}

function PercentageField({ errors, field, label, onChange, refs, values }: {
  errors: Partial<Record<PricingFormField, string>>;
  field: PricingFormField;
  label: string;
  onChange: (field: PricingFormField, value: string) => void;
  refs: React.MutableRefObject<Partial<Record<PricingFormField, HTMLInputElement | null>>>;
  values: PricingFormValues;
}) {
  return (
    <Field error={errors[field]} htmlFor={fieldIds[field]} label={label}>
      <Input
        id={fieldIds[field]}
        inputMode="decimal"
        invalid={Boolean(errors[field])}
        placeholder="0,00%"
        ref={(node) => { refs.current[field] = node; }}
        value={values[field]}
        onBlur={(event) => {
          const parsed = parsePercentToBps(event.target.value);
          if (parsed !== null) {
            onChange(field, formatBpsToPercent(parsed));
          }
        }}
        onChange={(event) => onChange(field, event.target.value)}
      />
    </Field>
  );
}

function RadioGroup({ columns = "three", legend, name, onChange, options, value }: {
  columns?: "three" | "four";
  legend: string;
  name: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  value: string;
}) {
  return (
    <fieldset className="pricing-options" data-columns={columns}>
      <legend>{legend}</legend>
      <div>
        {options.map((option) => (
          <label className="pricing-option" data-selected={value === option.value} key={option.value}>
            <input checked={value === option.value} name={name} type="radio" value={option.value} onChange={() => onChange(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PricingComparison({ result, stale }: { result: PricingPreviewResult | null; stale: boolean }) {
  if (!result) {
    return (
      <aside className="pricing-result" aria-labelledby="pricing-result-title">
        <div className="pricing-result__empty">
          <Sparkles aria-hidden="true" size={24} />
          <h2 id="pricing-result-title">Comparacao oficial</h2>
          <p>Os precos por Pix, Cartao, Revendedora, Atacado, Marketplace e Personalizado aparecem aqui depois que o servidor validar sessao, tenant, papel, perfis ativos e dados informados.</p>
        </div>
      </aside>
    );
  }

  const bestProfile = findBestProfile(result.profiles);
  const profilesWithIssues = result.profiles.filter((profile) => profileIssues(profile).length > 0).length;

  return (
    <aside className="pricing-result" aria-labelledby="pricing-result-title" aria-live="polite">
      <div className="pricing-result__topline">
        <div>
          <p>Perfil mais lucrativo</p>
          <h2 id="pricing-result-title">{bestProfile ? profileLabels[bestProfile.profileKey] : "Comparacao"}</h2>
        </div>
        <StatusBadge tone={stale ? "warning" : profilesWithIssues > 0 ? "warning" : "success"}>{stale ? "Desatualizado" : "Backend"}</StatusBadge>
      </div>

      {bestProfile ? (
        <div className="pricing-hero-summary">
          <Trophy aria-hidden="true" size={20} />
          <div>
            <span>Lucro liquido estimado</span>
            <strong>{formatCentsToBrl(bestProfile.netProfitCents)}</strong>
          </div>
          <div>
            <span>Preco aprovado nesta simulacao</span>
            <strong>{formatCentsToBrl(bestProfile.effectivePriceCents)}</strong>
          </div>
        </div>
      ) : null}

      <div className="pricing-result__metrics">
        <Metric label="Custo total" value={formatCentsToBrl(result.costs.costTotalCents)} />
        <Metric label="Perda" value={formatCentsToBrl(result.costs.lossAmountCents)} />
        <Metric label="Perfis ativos" value={result.profiles.length.toString()} />
        <Metric label="Arredondamento" value={roundingLabels[result.roundingRule]} />
      </div>

      <div className="pricing-comparison-grid" aria-label="Comparacao por perfil comercial">
        {result.profiles.map((profile) => (
          <CommercialProfileCard best={bestProfile?.profileId === profile.profileId} key={profile.profileId || profile.profileKey} profile={profile} />
        ))}
      </div>
    </aside>
  );
}

function CommercialProfileCard({ best, profile }: { best: boolean; profile: PricingPreviewProfileResult }) {
  const issues = profileIssues(profile);
  const approvedPrice = profile.approvedPriceCents ?? profile.effectivePriceCents;

  return (
    <article className="pricing-profile-card" data-best={best}>
      <div className="pricing-profile-card__header">
        <div>
          <p>{profileLabels[profile.profileKey]}</p>
          <h3>{formatCentsToBrl(approvedPrice)}</h3>
        </div>
        <StatusBadge tone={issues.length > 0 ? "warning" : best ? "success" : "info"}>{best ? "Maior lucro" : issues.length > 0 ? "Alerta" : "Ok"}</StatusBadge>
      </div>

      <div className="pricing-price-flow" aria-label={`Fluxo de preco para ${profileLabels[profile.profileKey]}`}>
        <PriceStep label="Tecnico" value={formatCentsToBrl(profile.technicalPriceCents)} />
        <ArrowDown aria-hidden="true" size={16} />
        <PriceStep label="Sugerido" value={formatCentsToBrl(profile.suggestedPriceCents)} />
        <ArrowDown aria-hidden="true" size={16} />
        <PriceStep label="Aprovado" value={formatCentsToBrl(approvedPrice)} />
      </div>

      <div className="pricing-profile-card__metrics">
        <Metric label="Lucro liquido" tone={BigInt(profile.netProfitCents) > 0n ? "success" : "warning"} value={formatCentsToBrl(profile.netProfitCents)} />
        <Metric label="Margem liquida" tone={BigInt(profile.netMarginBps) >= 1000n ? "success" : "warning"} value={formatBpsToPercent(profile.netMarginBps)} />
        <Metric label="Equilibrio" value={formatCentsToBrl(profile.breakEvenPriceCents)} />
        <Metric label="Minimo" value={formatCentsToBrl(profile.minimumRecommendedPriceCents)} />
      </div>

      <div className="pricing-profile-card__rounding">
        <span>Arredondamento</span>
        <strong>{roundingLabels[profile.roundingRule]}</strong>
      </div>

      <PricingAlertList issues={issues} />
    </article>
  );
}

function PriceStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="pricing-price-step">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PricingAlertList({ issues }: { issues: PricingTextIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="pricing-result__alerts pricing-result__alerts--ok">
        <CheckCircle2 aria-hidden="true" size={18} />
        <span>Sem alertas para este perfil.</span>
      </div>
    );
  }

  return (
    <div className="pricing-result__alerts">
      <CircleAlert aria-hidden="true" size={18} />
      <ul>
        {issues.map((issue) => (
          <li key={`${issue.code}-${issue.message}`}>{issue.message}</li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, tone, value }: { label: string; tone?: "success" | "warning"; value: string }) {
  return (
    <div className="pricing-metric" data-tone={tone ?? "neutral"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function findBestProfile(profiles: PricingPreviewProfileResult[]): PricingPreviewProfileResult | null {
  return profiles.reduce<PricingPreviewProfileResult | null>((best, current) => {
    if (!best) {
      return current;
    }

    const currentProfit = BigInt(current.netProfitCents);
    const bestProfit = BigInt(best.netProfitCents);
    if (currentProfit !== bestProfit) {
      return currentProfit > bestProfit ? current : best;
    }

    return BigInt(current.netMarginBps) > BigInt(best.netMarginBps) ? current : best;
  }, null);
}

function profileIssues(profile: PricingPreviewProfileResult): PricingTextIssue[] {
  const issues = [...jsonIssues(profile.errors), ...jsonIssues(profile.alerts)];

  if (BigInt(profile.suggestedPriceCents) < BigInt(profile.breakEvenPriceCents)) {
    issues.push({ code: "SUGGESTED_BELOW_BREAK_EVEN", message: "O preco sugerido nao cobre o custo total deste perfil." });
  }

  if (BigInt(profile.suggestedPriceCents) < BigInt(profile.minimumRecommendedPriceCents)) {
    issues.push({ code: "SUGGESTED_BELOW_TARGET", message: "O preco sugerido esta abaixo da meta definida para este perfil." });
  }

  if (BigInt(profile.netProfitCents) <= 0n) {
    issues.push({ code: "INSUFFICIENT_PROFIT", message: "Lucro insuficiente para este perfil." });
  }

  if (BigInt(profile.netMarginBps) < 1000n) {
    issues.push({ code: "LOW_MARGIN", message: "Margem muito baixa para este perfil." });
  }

  return deduplicateIssues(issues);
}

function jsonIssues(items: JsonSafe[]): PricingTextIssue[] {
  return items.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const maybeIssue = item as Record<string, JsonSafe>;
    const code = typeof maybeIssue.code === "string" ? maybeIssue.code : "ENGINE_ISSUE";
    const message = typeof maybeIssue.message === "string" ? maybeIssue.message : null;
    return message ? [{ code, message }] : [];
  });
}

function deduplicateIssues(issues: PricingTextIssue[]): PricingTextIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.code}:${issue.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
