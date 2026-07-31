"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { requestPasswordRecoveryAction } from "@/lib/auth/actions";
import { idleAuthState, type AuthActionState } from "@/lib/auth/validation";
import { Alert, Spinner } from "@/components/feedback";
import { Button, Field, Input } from "@/components/ui";

export function RecoveryForm() {
  const initialState: AuthActionState = idleAuthState;
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(requestPasswordRecoveryAction, initialState);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.fieldErrors.email) {
      emailRef.current?.focus();
    }
  }, [state.fieldErrors.email]);

  return (
    <form action={formAction} className="auth-form" noValidate>
      <div className="auth-heading">
        <p className="auth-kicker">Recuperacao</p>
        <h1>Recupere sua senha</h1>
        <p>Informe seu e-mail para receber instrucoes, se a conta estiver habilitada.</p>
      </div>

      {state.message ? (
        <Alert title={state.status === "ERROR" ? "Revise o e-mail" : "Solicitacao recebida"} tone={state.status === "ERROR" ? "danger" : "success"}>
          <span aria-live="assertive">{state.message}</span>
        </Alert>
      ) : null}

      <Field error={state.fieldErrors.email} htmlFor="recovery-email" label="E-mail">
        <Input autoComplete="email" id="recovery-email" invalid={Boolean(state.fieldErrors.email)} name="email" placeholder="nome@empresa.com" ref={emailRef} type="email" />
      </Field>

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? <Spinner /> : null}
        {isPending ? "Enviando" : "Enviar instrucoes"}
      </Button>

      <Link className="auth-link auth-link--center" href="/login">
        Voltar ao login
      </Link>
    </form>
  );
}