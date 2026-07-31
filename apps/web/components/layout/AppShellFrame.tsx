import type { ReactNode } from "react";

export function AppShellFrame({ children, sidebar, topbar, mobileNavigation }: { children: ReactNode; sidebar: ReactNode; topbar: ReactNode; mobileNavigation: ReactNode }) {
  return (
    <div className="app-shell-frame">
      <aside className="app-shell-sidebar">{sidebar}</aside>
      <div className="app-shell-main-region">
        <header className="app-shell-topbar">{topbar}</header>
        <main className="app-shell-content" id="conteudo-principal" tabIndex={-1}>
          {children}
        </main>
        <div className="app-shell-mobile-nav">{mobileNavigation}</div>
      </div>
    </div>
  );
}