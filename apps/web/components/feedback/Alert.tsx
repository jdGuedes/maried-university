import type { ReactNode } from "react";

type AlertTone = "info" | "success" | "warning" | "danger";

type AlertProps = {
  title: string;
  children: ReactNode;
  tone?: AlertTone;
};

const toneClassName: Record<AlertTone, string> = {
  info: "border-[rgba(49,95,119,0.22)] text-[var(--maried-color-info)]",
  success: "border-[rgba(47,125,87,0.22)] text-[var(--maried-color-success)]",
  warning: "border-[rgba(173,107,31,0.24)] text-[var(--maried-color-warning)]",
  danger: "border-[rgba(170,63,58,0.24)] text-[var(--maried-color-danger)]"
};

export function Alert({ title, children, tone = "info" }: AlertProps) {
  return (
    <div className={`rounded-[var(--maried-radius-lg)] border bg-white/50 p-4 ${toneClassName[tone]}`} role={tone === "danger" ? "alert" : "status"}>
      <p className="m-0 text-sm font-semibold">{title}</p>
      <div className="mt-1 text-sm text-[var(--maried-color-text-secondary)]">{children}</div>
    </div>
  );
}
