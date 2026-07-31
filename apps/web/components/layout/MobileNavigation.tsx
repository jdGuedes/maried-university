"use client";

import Link from "next/link";
import { LayoutDashboard, PackageSearch, Store, Menu, UserRound } from "lucide-react";
import { canNavigateToModule, isNavigationItemActive, type NavigationItem } from "@/lib/modules/navigation";

const primaryMobileIds = new Set(["inicio", "precificacao", "estoque", "minha-conta"]);

export function MobileNavigation({ items, pathname }: { items: NavigationItem[]; pathname: string }) {
  const primaryItems = items.filter((item) => primaryMobileIds.has(item.id));

  return (
    <nav aria-label="Navegacao principal mobile" className="app-mobile-tabs">
      {primaryItems.map((item) => {
        const active = isNavigationItemActive(pathname, item);
        const enabled = canNavigateToModule(item);
        const Icon = item.id === "inicio" ? LayoutDashboard : item.id === "precificacao" ? PackageSearch : item.id === "estoque" ? Store : UserRound;
        const label = item.shortLabel ?? item.label;
        const className = `app-mobile-tab ${active ? "app-mobile-tab--active" : ""} ${enabled ? "" : "app-mobile-tab--disabled"}`;

        if (!enabled) {
          return (
            <span key={item.id} aria-disabled="true" className={className}>
              <Icon aria-hidden="true" size={18} />
              <span>{label}</span>
            </span>
          );
        }

        return (
          <Link key={item.id} aria-current={active ? "page" : undefined} className={className} href={item.href}>
            <Icon aria-hidden="true" size={18} />
            <span>{label}</span>
          </Link>
        );
      })}
      <Link className="app-mobile-tab" href="/minha-assinatura">
        <Menu aria-hidden="true" size={18} />
        <span>Mais</span>
      </Link>
    </nav>
  );
}