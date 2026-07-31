import type { ReactNode } from "react";

type FieldProps = {
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  label: string;
};

export function Field({ children, description, error, htmlFor, label }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-[var(--maried-color-text-primary)]" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {description ? <p className="m-0 text-xs leading-5 text-[var(--maried-color-text-secondary)]">{description}</p> : null}
      {error ? <p className="m-0 text-xs font-medium leading-5 text-[var(--maried-color-danger)]">{error}</p> : null}
    </div>
  );
}
