import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-[image:var(--maried-gradient-primary)] text-[var(--maried-color-text-inverse)] shadow-[var(--maried-shadow-soft)]",
  secondary: "border border-[var(--maried-color-border-subtle)] bg-[var(--maried-color-surface-raised)] text-[var(--maried-color-text-primary)] shadow-[var(--maried-shadow-soft)]",
  ghost: "bg-transparent text-[var(--maried-color-text-primary)]"
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-13 px-6 text-base"
};

export function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--maried-radius-full)] font-semibold transition duration-[var(--maried-duration-fast)] ease-[var(--maried-ease-standard)] disabled:cursor-not-allowed disabled:opacity-55 ${variantClassName[variant]} ${sizeClassName[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
