import type { ReactNode } from "react";

type FormMessageTone = "neutral" | "success" | "error";

type FormMessageProps = {
  children: ReactNode;
  tone?: FormMessageTone;
};

const toneClassName: Record<FormMessageTone, string> = {
  neutral: "text-[var(--maried-color-text-secondary)]",
  success: "text-[var(--maried-color-success)]",
  error: "text-[var(--maried-color-danger)]"
};

export function FormMessage({ children, tone = "neutral" }: FormMessageProps) {
  return <p className={`m-0 text-sm leading-6 ${toneClassName[tone]}`}>{children}</p>;
}
