import type { Metadata } from "next";
import { AuthLayout, RecoveryForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Recuperar senha | MARIED UNIVERSITY",
  description: "Recuperação segura de senha da MARIED UNIVERSITY."
};

export default function RecuperarSenhaPage() {
  return (
    <AuthLayout>
      <RecoveryForm />
    </AuthLayout>
  );
}