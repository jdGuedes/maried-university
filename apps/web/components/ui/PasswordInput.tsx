import { Eye, EyeOff } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "./Input";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  invalid?: boolean;
  onToggleVisibility?: () => void;
  revealLabel?: string;
  visible?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { invalid = false, onToggleVisibility, revealLabel = "Mostrar senha", visible = false, ...props },
  ref
) {
  const VisibilityIcon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input invalid={invalid} type={visible ? "text" : "password"} {...props} className="pr-12" ref={ref} />
      {onToggleVisibility ? (
        <button
          aria-label={revealLabel}
          className="absolute inset-y-1 right-1 grid min-h-9 min-w-9 place-items-center rounded-[var(--maried-radius-md)] text-[var(--maried-color-text-secondary)] transition hover:bg-[rgba(168,121,53,0.10)]"
          onClick={onToggleVisibility}
          type="button"
        >
          <VisibilityIcon aria-hidden="true" size={18} />
        </button>
      ) : (
        <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-[var(--maried-color-text-secondary)]">
          <VisibilityIcon aria-hidden="true" size={18} />
        </span>
      )}
    </div>
  );
});