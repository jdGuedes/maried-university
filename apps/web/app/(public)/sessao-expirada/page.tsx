import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Alert } from "@/components/feedback";

export const metadata: Metadata = {
  title: "Sessão expirada | MARIED UNIVERSITY",
  description: "Sessão expirada na MARIED UNIVERSITY."
};

export default function SessaoExpiradaPage() {
  return (
    <AuthLayout>
      <div className="auth-form">
        <div className="auth-heading">
          <p className="auth-kicker">Sessão expirada</p>
          <h1>Entre novamente</h1>
          <p>Sua sessão não pôde ser validada com segurança.</p>
        </div>
        <Alert title="Acesso protegido" tone="warning">
          Nenhum dado da empresa foi carregado. Faça login novamente para continuar.
        </Alert>
        <Link className="auth-submit-link" href="/login?status=session-expired">
          Voltar ao login
        </Link>
      </div>
    </AuthLayout>
  );
}