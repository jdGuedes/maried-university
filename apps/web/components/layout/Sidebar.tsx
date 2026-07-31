import { LogoMark } from "@/components/brand";
import type { NavigationItem } from "@/lib/modules/navigation";
import { StatusBadge } from "@/components/ui";

export function Sidebar({ items }: { items: NavigationItem[] }) {
  return (
    <nav aria-label="Navegacao estrutural desktop" className="flex h-full flex-col gap-5">
      <LogoMark compact />
      <div className="grid gap-2">
        {items.map((item) => (
          <a key={item.id} aria-disabled={item.state !== "AVAILABLE"} className="flex min-h-11 items-center justify-between gap-3 rounded-[var(--maried-radius-lg)] px-3 text-sm font-medium text-[var(--maried-color-text-primary)] hover:bg-white/45" href={item.href}>
            <span>{item.label}</span>
            {item.state !== "AVAILABLE" ? <StatusBadge tone="warning">em breve</StatusBadge> : null}
          </a>
        ))}
      </div>
    </nav>
  );
}
