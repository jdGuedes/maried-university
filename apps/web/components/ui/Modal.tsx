import type { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export function Modal({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section aria-label={title} className="rounded-[var(--maried-radius-2xl)] border border-[var(--maried-color-border-subtle)] bg-white/72 p-5 shadow-[var(--maried-shadow-raised)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="m-0 text-lg font-semibold text-[var(--maried-color-text-primary)]">{title}</h3>
        <IconButton disabled icon={X} label="Fechar exemplo de modal" />
      </div>
      <div className="mt-4 text-sm leading-6 text-[var(--maried-color-text-secondary)]">{children}</div>
    </section>
  );
}
