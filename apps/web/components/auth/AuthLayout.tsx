import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand";

export function AuthLayout({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "splash" }) {
  return (
    <main className={`auth-screen auth-screen--${tone}`}>
      <section className="auth-stage" aria-label="MARIED UNIVERSITY">
        <div className="auth-brand-panel" aria-hidden="true">
          <div className="auth-brand-ribbon" />
          <div className="auth-brand-stack">
            <LogoMark />
            <p>Gestão inteligente para empresas de semijoias.</p>
          </div>
        </div>
        <div className="auth-form-panel">{children}</div>
      </section>
    </main>
  );
}