import type { ReactNode } from "react";

export function AppShellFrame({ children, sidebar, topbar, mobileNavigation }: { children: ReactNode; sidebar: ReactNode; topbar: ReactNode; mobileNavigation: ReactNode }) {
  return (
    <div className="grid min-h-[34rem] overflow-hidden rounded-[var(--maried-radius-2xl)] border border-[var(--maried-color-border-subtle)] bg-white/35 shadow-[var(--maried-shadow-soft)] md:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-[var(--maried-color-border-subtle)] bg-white/35 p-4 md:block">{sidebar}</aside>
      <div className="flex min-w-0 flex-col">
        <div className="border-b border-[var(--maried-color-border-subtle)] bg-white/35 p-4">{topbar}</div>
        <div className="min-h-0 flex-1 p-4 md:p-6">{children}</div>
        <div className="border-t border-[var(--maried-color-border-subtle)] bg-white/45 p-3 md:hidden">{mobileNavigation}</div>
      </div>
    </div>
  );
}
