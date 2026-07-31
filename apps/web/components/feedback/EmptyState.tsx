import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--maried-radius-xl)] border border-dashed border-[var(--maried-color-border-strong)] bg-white/35 p-6 text-center">
      <p className="m-0 font-semibold text-[var(--maried-color-text-primary)]">{title}</p>
      <div className="mx-auto mt-2 max-w-md text-sm text-[var(--maried-color-text-secondary)]">{children}</div>
    </div>
  );
}
