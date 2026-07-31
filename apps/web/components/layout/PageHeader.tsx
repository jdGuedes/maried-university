import type { ReactNode } from "react";

export function PageHeader({ actions, eyebrow, title }: { actions?: ReactNode; eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="m-0 text-sm font-semibold text-[var(--maried-color-text-secondary)]">{eyebrow}</p>
        <h2 className="m-0 mt-1 text-2xl font-semibold text-[var(--maried-color-text-primary)]">{title}</h2>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
