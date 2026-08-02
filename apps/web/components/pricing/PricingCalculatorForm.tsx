"use client";

import { Calculator, CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
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
import type { PricingPreviewResult } from "@/lib/pricing/service";

type SubmitState = Extract<PricingPreviewActionResult, { ok: false }> | null;

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
  desiredMargin: "pricing-desired-margin"
};

const statusLabel: Record<PricingFormStatus, string> = {
  IDLE: "Pronto para preencher",
  DIRTY: "Dados em edicao",
  INVALID: "Revise os campos",
  SUBMITTING: "Calculando",
  SUCCESS: "Resultado oficial",
  ERROR: "Nao calculado"
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
            <h2>Dados para calcular</h2>
            <p>Preencha os custos conhecidos. O resultado oficial e calculado no servidor com o primeiro perfil comercial ativo.</p>
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

        {submitError ? (
          <Alert title="Calculo nao concluido" tone={submitError.code === "CONFIGURATION_REQUIRED" ? "warning" : submitError.code === "ACCESS_DENIED" ? "danger" : "warning"}>
            {submitError.message}
          </Alert>
        ) : null}

        <div className="pricing-actions">
          <Button disabled={isPending} size="lg" type="submit">
            {isPending ? "Calculando" : "Gerar preco"}
            <Calculator aria-hidden="true" size={18} />
          </Button>
          {resultStale ? <span className="pricing-stale">Resultado anterior desatualizado pelos novos dados.</span> : null}
        </div>
      </form>

      <PricingResultPanel result={result} stale={resultStale} />
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

function RadioGroup({ legend, name, onChange, options, value }: {
  legend: string;
  name: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  value: string;
}) {
  return (
    <fieldset className="pricing-options">
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

function PricingResultPanel({ result, stale }: { result: PricingPreviewResult | null; stale: boolean }) {
  if (!result) {
    return (
      <aside className="pricing-result" aria-labelledby="pricing-result-title">
        <div className="pricing-result__empty">
          <Sparkles aria-hidden="true" size={24} />
          <h2 id="pricing-result-title">Resultado oficial</h2>
          <p>O preco sugerido aparecera aqui depois que o servidor validar a sessao, o tenant, o papel, o perfil comercial e os dados informados.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="pricing-result" aria-labelledby="pricing-result-title" aria-live="polite">
      <div className="pricing-result__topline">
        <div>
          <p>{result.profileName}</p>
          <h2 id="pricing-result-title">{formatCentsToBrl(result.result.suggestedPriceCents)}</h2>
        </div>
        <StatusBadge tone={stale ? "warning" : "success"}>{stale ? "Desatualizado" : "Oficial"}</StatusBadge>
      </div>

      <div className="pricing-result__metrics">
        <Metric label="Lucro liquido" value={formatCentsToBrl(result.result.netProfitCents)} tone="success" />
        <Metric label="Margem liquida" value={formatBpsToPercent(result.result.netMarginBps)} />
        <Metric label="Custo total" value={formatCentsToBrl(result.costs.costTotalCents)} />
        <Metric label="Equilibrio" value={formatCentsToBrl(result.result.breakEvenPriceCents)} />
      </div>

      <div className="pricing-breakdown">
        <h3>Detalhes do calculo</h3>
        <dl>
          <BreakdownRow label="Custo da peca" value={formatCentsToBrl(result.costs.pieceCostCents)} />
          <BreakdownRow label="Embalagem" value={formatCentsToBrl(result.costs.packagingCostCents)} />
          <BreakdownRow label="Etiqueta ou tag" value={formatCentsToBrl(result.costs.tagCostCents)} />
          <BreakdownRow label="Frete unitario" value={formatCentsToBrl(result.costs.freightUnitCents)} />
          <BreakdownRow label="Outros custos" value={formatCentsToBrl(result.costs.otherDirectCostsCents)} />
          <BreakdownRow label="Custo base" value={formatCentsToBrl(result.costs.costBaseCents)} />
          <BreakdownRow label="Perda" value={formatCentsToBrl(result.costs.lossAmountCents)} />
          <BreakdownRow label="Preco tecnico" value={formatCentsToBrl(result.result.technicalPriceCents)} />
          <BreakdownRow label="Preco sugerido" value={formatCentsToBrl(result.result.suggestedPriceCents)} />
        </dl>
      </div>

      {result.result.alerts.length > 0 ? (
        <div className="pricing-result__alerts">
          <CircleAlert aria-hidden="true" size={18} />
          <span>O calculo retornou alertas. Revise os detalhes antes de usar este preco.</span>
        </div>
      ) : (
        <div className="pricing-result__alerts pricing-result__alerts--ok">
          <CheckCircle2 aria-hidden="true" size={18} />
          <span>Calculo concluido sem alertas do motor.</span>
        </div>
      )}
    </aside>
  );
}

function Metric({ label, tone, value }: { label: string; tone?: "success"; value: string }) {
  return (
    <div className="pricing-metric" data-tone={tone ?? "neutral"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
