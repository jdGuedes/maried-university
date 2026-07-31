import Link from "next/link";
import { LayoutDashboard, PackageSearch, Store, Truck, GraduationCap, CreditCard, UserRound } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { StatusBadge } from "@/components/ui";
import { canNavigateToModule, isNavigationItemActive, moduleStateLabels, type NavigationItem, type NavigationItemId } from "@/lib/modules/navigation";

const iconById: Record<NavigationItemId, typeof LayoutDashboard> = {
  inicio: LayoutDashboard,
  precificacao: PackageSearch,
  estoque: Store,
  fornecedores: Truck,
  minicursos: GraduationCap,
  "minha-assinatura": CreditCard,
  "minha-conta": UserRound
};

export function Sidebar({ items, pathname }: { items: NavigationItem[]; pathname: string }) {
  return (
    <nav aria-label="Navegacao principal desktop" className="app-sidebar-nav">
      <LogoMark compact />
      <a className="skip-link" href="#conteudo-principal">
        Ir para conteudo
      </a>
      <div className="app-sidebar-list">
        {items.map((item) => {
          const Icon = iconById[item.id];
          const active = isNavigationItemActive(pathname, item);
          const enabled = canNavigateToModule(item);
          const className = `app-nav-link ${active ? "app-nav-link--active" : ""} ${enabled ? "" : "app-nav-link--disabled"}`;

          if (!enabled) {
            return (
              <span key={item.id} aria-disabled="true" className={className} title={item.description}>
                <Icon aria-hidden="true" size={18} />
                <span>{item.label}</span>
                <StatusBadge tone="warning">{moduleStateLabels[item.state]}</StatusBadge>
              </span>
            );
          }

          return (
            <Link key={item.id} aria-current={active ? "page" : undefined} className={className} href={item.href} title={item.description}>
              <Icon aria-hidden="true" size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}