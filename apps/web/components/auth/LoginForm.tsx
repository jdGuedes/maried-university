"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { signInAction } from "@/lib/auth/actions";
import { authMessages, idleAuthState, type AuthActionState } from "@/lib/auth/validation";
import { Alert, Spinner } from "@/components/feedback";
import { Button, Field, FormMessage, Input, PasswordInput } from "@/components/ui";

export function LoginForm({ initialMessage = "", nextPath = "/inicio" }: { initialMessage?: string; nextPath?: string }) {
  const initialState: AuthActionState = initialMessage ? { ...idleAuthState, status: "SUBMITTED", message: initialMessage } : idleAuthState;
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(signInAction, initialState);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.fieldErrors.email) {
      emailRef.current?.focus();
      return;
    }

    if (state.fieldErrors.password) {
      passwordRef.current?.focus();
    }
  }, [state.fieldErrors.email, state.fieldErrors.password]);

  return (
    <form action={formAction} className="auth-form" noValidate>
      <input name="next" type="hidden" value={nextPath} />
      <div className="auth-heading">
        <p className="auth-kicker">Acesso seguro</p>
        <h1>Entre na MARIED UNIVERSITY</h1>
        <p>Use seu e-mail e senha para acessar sua empresa.</p>
      </div>

      {state.message ? (
        <Alert title={state.status === "ERROR" ? "Nao foi possivel entrar" : "Tudo certo"} tone={state.status === "ERROR" ? "danger" : "success"}>
          <span aria-live="assertive">{state.message}</span>
        </Alert>
      ) : null}

      <Field error={state.fieldErrors.email} htmlFor="login-email" label="E-mail">
        <Input
          autoComplete="email"
          id="login-email"
          invalid={Boolean(state.fieldErrors.email)}
          name="email"
          placeholder="nome@empresa.com"
          ref={emailRef}
          type="email"
        />
      </Field>

      <Field error={state.fieldErrors.password} htmlFor="login-password" label="Senha">
        <PasswordInput
          autoComplete="current-password"
          id="login-password"
          invalid={Boolean(state.fieldErrors.password)}
          name="password"
          onToggleVisibility={() => setPasswordVisible((current) => !current)}
          placeholder="Sua senha"
          ref={passwordRef}
          revealLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
          visible={passwordVisible}
        />
      </Field>

      <div className="auth-row auth-row--between">
        <FormMessage>{authMessages.recoveryNeutral}</FormMessage>
        <Link className="auth-link" href="/recuperar-senha">
          Recuperar senha
        </Link>
      </div>

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? <Spinner /> : null}
        {isPending ? "Entrando" : "Entrar"}
        <ArrowRight aria-hidden="true" size={18} />
      </Button>
    </form>
  );
}