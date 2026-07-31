import type { Metadata } from "next";
import { AuthLayout, LoginForm } from "@/components/auth";
import { authMessages } from "@/lib/auth/validation";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Entrar | MARIED UNIVERSITY",
  description: "Acesso seguro à MARIED UNIVERSITY."
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusMessages: Record<string, string> = {
  "password-updated": authMessages.resetSuccess,
  "signed-out": "Sessão encerrada com segurança.",
  "session-expired": "Sua sessão expirou. Entre novamente para continuar.",
  "invalid-link": authMessages.invalidResetLink
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const status = Array.isArray(params.status) ? params.status[0] : params.status;
  const nextPath = getSafeRedirectPath(params.next);

  return (
    <AuthLayout>
      <LoginForm initialMessage={status ? statusMessages[status] ?? "" : ""} nextPath={nextPath} />
    </AuthLayout>
  );
}