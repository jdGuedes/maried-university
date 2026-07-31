import Link from "next/link";
import type { ModuleState } from "@/lib/modules/navigation";
import { moduleStateLabels } from "@/lib/modules/navigation";
import { StatusBadge } from "./StatusBadge";

const toneByState: Record<ModuleState, "success" | "warning" | "danger" | "neutral" | "info"> = {
  AVAILABLE: "success",
  COMING_SOON: "warning",
  LOCKED: "danger",
  DISABLED: "neutral",
  MAINTENANCE: "info"
};

export function ModuleCard({ description, href, state, title }: { description: string; href?: string; state: ModuleState; title: string }) {
  const enabled = Boolean(href && state === "AVAILABLE");

  return (
    <article className="module-card">
      <div className="module-card-header">
        <h3>{title}</h3>
        <StatusBadge tone={toneByState[state]}>{moduleStateLabels[state]}</StatusBadge>
      </div>
      <p>{description}</p>
      {enabled && href ? (
        <Link className="module-card-action" href={href}>
          Abrir estrutura
        </Link>
      ) : (
        <span className="module-card-action module-card-action--disabled" aria-disabled="true">
          Indisponivel agora
        </span>
      )}
    </article>
  );
}