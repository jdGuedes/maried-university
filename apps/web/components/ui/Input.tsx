import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className = "", invalid = false, ...props }, ref) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`min-h-11 w-full rounded-[var(--maried-radius-lg)] border bg-white/65 px-4 text-sm text-[var(--maried-color-text-primary)] shadow-[inset_0_1px_2px_rgba(80,56,32,0.08)] transition duration-[var(--maried-duration-fast)] placeholder:text-[rgba(109,95,80,0.62)] disabled:cursor-not-allowed disabled:opacity-55 ${invalid ? "border-[var(--maried-color-danger)]" : "border-[var(--maried-color-border-subtle)]"} ${className}`}
      ref={ref}
      {...props}
    />
  );
});