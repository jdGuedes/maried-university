import type { Metadata } from "next";
import { SplashScreen } from "@/components/auth";

export const metadata: Metadata = {
  title: "MARIED UNIVERSITY | Carregando",
  description: "Inicialização segura da MARIED UNIVERSITY."
};

export default function Home() {
  return <SplashScreen />;
}