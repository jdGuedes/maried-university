import { Wifi } from "lucide-react";
import { StatusBadge } from "@/components/ui";

export function Topbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="m-0 text-xs font-semibold text-[var(--maried-color-text-secondary)]">Tenant e sessao</p>
        <p className="m-0 text-sm font-semibold text-[var(--maried-color-text-primary)]">Resolucao server-side futura</p>
      </div>
      <div className="flex items-center gap-2">
        <Wifi aria-hidden="true" className="text-[var(--maried-color-success)]" size={18} />
        <StatusBadge tone="success">online</StatusBadge>
      </div>
    </div>
  );
}
