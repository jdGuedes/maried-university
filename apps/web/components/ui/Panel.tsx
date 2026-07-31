import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "section" | "article" | "div";
};

export function Panel({ children, as: Component = "section", className = "", ...props }: PanelProps) {
  return (
    <Component
      className={`min-w-0 overflow-hidden rounded-[var(--maried-radius-2xl)] border border-[var(--maried-color-border-subtle)] bg-[var(--maried-color-surface-raised)] p-6 shadow-[var(--maried-shadow-soft)] backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
