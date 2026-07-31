import type { ReactNode } from "react";
import { Bell } from "lucide-react";

export function Toast({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-[var(--maried-radius-xl)] border border-[var(--maried-color-border-subtle)] bg-white/72 p-4 shadow-[var(--maried-shadow-raised)]" role="status">
      <div className="flex items-start gap-3">
        <Bell aria-hidden="true" className="mt-0.5 text-[var(--maried-color-brand-primary)]" size={18} />
        <div>
          <p className="m-0 text-sm font-semibold text-[var(--maried-color-text-primary)]">{title}</p>
          <div className="mt-1 text-sm leading-6 text-[var(--maried-color-text-secondary)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
