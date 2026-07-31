import type { ModuleState } from "@/lib/modules/navigation";
import { StatusBadge } from "@/components/ui";

const toneByState: Record<ModuleState, "success" | "warning" | "danger" | "neutral" | "info"> = {
  AVAILABLE: "success",
  COMING_SOON: "warning",
  LOCKED: "danger",
  DISABLED: "neutral",
  MAINTENANCE: "info"
};

export function ModuleCard({ description, state, title }: { description: string; state: ModuleState; title: string }) {
  return (
    <article className="rounded-[var(--maried-radius-xl)] border border-[var(--maried-color-border-subtle)] bg-white/42 p-4 shadow-[var(--maried-shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="m-0 text-base font-semibold text-[var(--maried-color-text-primary)]">{title}</h3>
        <StatusBadge tone={toneByState[state]}>{state}</StatusBadge>
      </div>
      <p className="m-0 mt-3 text-sm leading-6 text-[var(--maried-color-text-secondary)]">{description}</p>
    </article>
  );
}
