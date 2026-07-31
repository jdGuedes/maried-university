import type { ReactNode } from "react";

export function Drawer({ children, title }: { children: ReactNode; title: string }) {
  return (
    <aside aria-label={title} className="rounded-[var(--maried-radius-2xl)] border border-[var(--maried-color-border-subtle)] bg-white/62 p-5 shadow-[var(--maried-shadow-soft)]">
      <div className="h-1.5 w-12 rounded-[var(--maried-radius-full)] bg-[var(--maried-color-border-strong)] md:hidden" />
      <h3 className="m-0 mt-4 text-lg font-semibold text-[var(--maried-color-text-primary)] md:mt-0">{title}</h3>
      <div className="mt-4 text-sm leading-6 text-[var(--maried-color-text-secondary)]">{children}</div>
    </aside>
  );
}
