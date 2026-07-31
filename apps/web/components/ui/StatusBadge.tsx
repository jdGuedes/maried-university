import type { ReactNode } from "react";

type StatusBadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusBadgeTone;
};

const toneClassName: Record<StatusBadgeTone, string> = {
  neutral: "border-[var(--maried-color-border-subtle)] text-[var(--maried-color-text-secondary)]",
  success: "border-[rgba(47,125,87,0.22)] text-[var(--maried-color-success)]",
  warning: "border-[rgba(173,107,31,0.24)] text-[var(--maried-color-warning)]",
  danger: "border-[rgba(170,63,58,0.24)] text-[var(--maried-color-danger)]",
  info: "border-[rgba(49,95,119,0.22)] text-[var(--maried-color-info)]"
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-[var(--maried-radius-full)] border bg-white/45 px-3 text-xs font-semibold ${toneClassName[tone]}`}>
      {children}
    </span>
  );
}
