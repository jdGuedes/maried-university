import { Eye } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { Input } from "./Input";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  invalid?: boolean;
};

export function PasswordInput({ invalid = false, ...props }: PasswordInputProps) {
  return (
    <div className="relative">
      <Input invalid={invalid} type="password" {...props} className="pr-12" />
      <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-[var(--maried-color-text-secondary)]">
        <Eye aria-hidden="true" size={18} />
      </span>
    </div>
  );
}
