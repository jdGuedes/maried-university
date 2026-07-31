import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";

export function Topbar({ actions, pageLabel, tenantLabel }: { actions?: ReactNode; pageLabel: string; tenantLabel: string }) {
  return (
    <div className="app-topbar-inner">
      <div>
        <p className="app-topbar-context">{tenantLabel}</p>
        <p className="app-topbar-title">{pageLabel}</p>
      </div>
      <div className="app-topbar-actions">
        <StatusBadge tone="success">Acesso validado</StatusBadge>
        {actions}
      </div>
    </div>
  );
}