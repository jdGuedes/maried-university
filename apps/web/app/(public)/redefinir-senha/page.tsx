import type { Metadata } from "next";
import { AuthLayout, ResetPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Redefinir senha | MARIED UNIVERSITY",
  description: "Redefinição segura de senha da MARIED UNIVERSITY."
};

export default function RedefinirSenhaPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}