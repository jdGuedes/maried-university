"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/brand";
import { Spinner } from "@/components/feedback";
import { Button } from "@/components/ui";

type SplashState = "loading" | "error";

export function SplashScreen() {
  const router = useRouter();
  const [state, setState] = useState<SplashState>("loading");
  const abortRef = useRef<AbortController | null>(null);

  const resolveDestination = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState("loading");

    const timeout = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch("/auth/resolve", {
        cache: "no-store",
        credentials: "include",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("resolve-failed");
      }

      const payload = (await response.json()) as { destination?: string };
      router.replace(payload.destination || "/login");
    } catch {
      if (!controller.signal.aborted) {
        setState("error");
      } else {
        setState("error");
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }, [router]);

  useEffect(() => {
    void resolveDestination();

    return () => abortRef.current?.abort();
  }, [resolveDestination]);

  return (
    <main className="splash-screen" aria-busy={state === "loading"}>
      <div className="splash-mark" aria-hidden="true">
        <span>M</span>
      </div>
      <LogoMark />
      <div className="splash-copy">
        <h1>MARIED UNIVERSITY</h1>
        <p>{state === "loading" ? "Preparando seu acesso com segurança." : "Não foi possível carregar agora."}</p>
      </div>
      <div aria-live="polite" className="splash-status">
        {state === "loading" ? (
          <>
            <Spinner />
            <span>Validando sessão</span>
          </>
        ) : (
          <Button onClick={resolveDestination} type="button" variant="secondary">
            Tentar novamente
          </Button>
        )}
      </div>
    </main>
  );
}