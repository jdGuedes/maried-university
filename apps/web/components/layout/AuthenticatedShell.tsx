"use client";

import { usePathname } from "next/navigation";
import { AppShellFrame, MobileNavigation, Sidebar, Topbar } from "@/components/layout";
import { navigationItems, getNavigationItemByHref } from "@/lib/modules/navigation";
import type { AccessContext } from "@/lib/access/session-context";
import { UserMenu } from "./UserMenu";

export function AuthenticatedShell({ access, children }: { access: AccessContext; children: React.ReactNode }) {
  const pathname = usePathname();
  const activeItem = getNavigationItemByHref(pathname);
  const displayName = access.user.fullName ?? access.user.email ?? "Usuaria MARIED";
  const tenantLabel = access.tenant.tradeName ?? access.tenant.name;

  return (
    <AppShellFrame
      sidebar={<Sidebar items={navigationItems} pathname={pathname} />}
      topbar={<Topbar actions={<UserMenu displayName={displayName} email={access.user.email} />} pageLabel={activeItem?.label ?? "Area autenticada"} tenantLabel={tenantLabel} />}
      mobileNavigation={<MobileNavigation items={navigationItems} pathname={pathname} />}
    >
      {children}
    </AppShellFrame>
  );
}