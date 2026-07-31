import type { NavigationItem } from "@/lib/modules/navigation";

export function MobileNavigation({ items }: { items: NavigationItem[] }) {
  return (
    <nav aria-label="Navegacao estrutural mobile" className="grid grid-cols-4 gap-2">
      {items.slice(0, 4).map((item) => (
        <a key={item.id} aria-disabled={item.state !== "AVAILABLE"} className="min-h-11 rounded-[var(--maried-radius-lg)] px-2 py-2 text-center text-xs font-semibold text-[var(--maried-color-text-primary)] hover:bg-white/45" href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
