import { Check } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Checkbox({ className = "", label, ...props }: CheckboxProps) {
  return (
    <label className={`inline-flex min-h-11 items-center gap-3 text-sm font-medium text-[var(--maried-color-text-primary)] ${className}`}>
      <span className="relative inline-grid size-5 place-items-center rounded-[var(--maried-radius-sm)] border border-[var(--maried-color-border-strong)] bg-white/65 text-[var(--maried-color-text-inverse)] shadow-[inset_0_1px_2px_rgba(80,56,32,0.08)]">
        <input className="peer absolute inset-0 m-0 cursor-pointer opacity-0" type="checkbox" {...props} />
        <span className="absolute inset-0 rounded-[var(--maried-radius-sm)] bg-[image:var(--maried-gradient-primary)] opacity-0 transition peer-checked:opacity-100" />
        <Check aria-hidden="true" className="relative opacity-0 transition peer-checked:opacity-100" size={14} strokeWidth={3} />
      </span>
      <span>{label}</span>
    </label>
  );
}
