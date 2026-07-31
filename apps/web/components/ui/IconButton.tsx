import type { ButtonHTMLAttributes, ElementType } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ElementType;
  label: string;
};

export function IconButton({ icon: Icon, label, className = "", ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex size-11 items-center justify-center rounded-[var(--maried-radius-full)] border border-[var(--maried-color-border-subtle)] bg-[var(--maried-color-surface-raised)] text-[var(--maried-color-text-primary)] shadow-[var(--maried-shadow-soft)] transition duration-[var(--maried-duration-fast)] ease-[var(--maried-ease-standard)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
      {...props}
    >
      <Icon aria-hidden="true" size={19} strokeWidth={2} />
    </button>
  );
}
