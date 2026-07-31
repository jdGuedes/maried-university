"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { resetPasswordAction } from "@/lib/auth/actions";
import { idleAuthState, type AuthActionState } from "@/lib/auth/validation";
import { Alert, Spinner } from "@/components/feedback";
import { Button, Field, PasswordInput } from "@/components/ui";

export function ResetPasswordForm() {
  const initialState: AuthActionState = idleAuthState;
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(resetPasswordAction, initialState);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.fieldErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    if (state.fieldErrors.confirmPassword) {
      confirmRef.current?.focus();
    }
  }, [state.fieldErrors.confirmPassword, state.fieldErrors.password]);

  return (
    <form action={formAction} className="auth-form" noValidate>
      <div className="auth-heading">
        <p className="auth-kicker">Nova senha</p>
        <h1>Defina uma nova senha</h1>
        <p>Use pelo menos 6 caracteres. A senha nao sera armazenada pela aplicacao.</p>
      </div>

      {state.message ? (
        <Alert title="Nao foi possivel redefinir" tone="danger">
          <span aria-live="assertive">{state.message}</span>
        </Alert>
      ) : null}

      <Field error={state.fieldErrors.password} htmlFor="reset-password" label="Nova senha">
        <PasswordInput
          autoComplete="new-password"
          id="reset-password"
          invalid={Boolean(state.fieldErrors.password)}
          name="password"
          onToggleVisibility={() => setPasswordVisible((current) => !current)}
          placeholder="Nova senha"
          ref={passwordRef}
          revealLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
          visible={passwordVisible}
        />
      </Field>

      <Field error={state.fieldErrors.confirmPassword} htmlFor="reset-confirm-password" label="Confirmar senha">
        <PasswordInput
          autoComplete="new-password"
          id="reset-confirm-password"
          invalid={Boolean(state.fieldErrors.confirmPassword)}
          name="confirmPassword"
          onToggleVisibility={() => setConfirmationVisible((current) => !current)}
          placeholder="Confirme a nova senha"
          ref={confirmRef}
          revealLabel={confirmationVisible ? "Ocultar confirmacao" : "Mostrar confirmacao"}
          visible={confirmationVisible}
        />
      </Field>

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? <Spinner /> : null}
        {isPending ? "Salvando" : "Salvar nova senha"}
      </Button>

      <Link className="auth-link auth-link--center" href="/login">
        Voltar ao login
      </Link>
    </form>
  );
}