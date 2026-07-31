"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveServerAccessContext, type AccessResolutionCode } from "@/lib/access/session-context";
import { authMessages, hasFieldErrors, type AuthActionState, validateLoginFields, validateRecoveryFields, validateResetFields } from "./validation";
import { getLoginRedirectPath, getSafeRedirectPath } from "./redirects";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function invalidState(message: string, fieldErrors: AuthActionState["fieldErrors"] = {}): AuthActionState {
  return {
    status: "ERROR",
    message,
    fieldErrors
  };
}

function submittedState(message: string): AuthActionState {
  return {
    status: "SUBMITTED",
    message,
    fieldErrors: {}
  };
}

function mapAccessCodeToLoginMessage(code: Exclude<AccessResolutionCode, "AUTHENTICATED" | "NO_SESSION">) {
  if (code === "TENANT_ACCESS_ENDED") {
    return authMessages.accessEnded;
  }

  if (code === "PROFILE_NOT_FOUND" || code === "NO_ACTIVE_TENANT" || code === "TENANT_INACTIVE" || code === "TENANT_INVALID") {
    return authMessages.inactiveAccess;
  }

  return authMessages.genericFailure;
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("host");
  const protocol = host?.startsWith("127.0.0.1") || host?.startsWith("localhost") ? "http" : "https";

  if (origin?.startsWith("http://") || origin?.startsWith("https://")) {
    return origin;
  }

  return host ? `${protocol}://${host}` : "http://127.0.0.1:3000";
}

export async function signInAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const nextPath = getSafeRedirectPath(formData.get("next"));
  const fieldErrors = validateLoginFields(email, password);

  if (hasFieldErrors(fieldErrors)) {
    return invalidState(Object.values(fieldErrors)[0] ?? authMessages.genericFailure, fieldErrors);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const signInResult = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (signInResult.error) {
      return invalidState(authMessages.invalidCredentials);
    }

    const access = await resolveServerAccessContext();

    if (!access.ok) {
      await supabase.auth.signOut();

      if (access.code === "NO_SESSION") {
        return invalidState(authMessages.genericFailure);
      }

      return invalidState(mapAccessCodeToLoginMessage(access.code));
    }
  } catch {
    return invalidState(authMessages.genericFailure);
  }

  redirect(nextPath);
}

export async function requestPasswordRecoveryAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const fieldErrors = validateRecoveryFields(email);

  if (hasFieldErrors(fieldErrors)) {
    return invalidState(Object.values(fieldErrors)[0] ?? authMessages.genericFailure, fieldErrors);
  }

  const origin = await getRequestOrigin();
  const redirectTo = new URL("/auth/callback", origin);
  redirectTo.searchParams.set("next", "/redefinir-senha");

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectTo.toString()
    });
  } catch {
    return submittedState(authMessages.recoveryNeutral);
  }

  return submittedState(authMessages.recoveryNeutral);
}

export async function resetPasswordAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");
  const fieldErrors = validateResetFields(password, confirmPassword);

  if (hasFieldErrors(fieldErrors)) {
    return invalidState(Object.values(fieldErrors)[0] ?? authMessages.genericFailure, fieldErrors);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const userResult = await supabase.auth.getUser();

    if (!userResult.data.user || userResult.error) {
      return invalidState(authMessages.invalidResetLink);
    }

    const updateResult = await supabase.auth.updateUser({ password });

    if (updateResult.error) {
      return invalidState(authMessages.invalidResetLink);
    }

    await supabase.auth.signOut();
  } catch {
    return invalidState(authMessages.invalidResetLink);
  }

  redirect(getLoginRedirectPath("password-updated"));
}

export async function signOutAction() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Local state is still cleared by the client before this action runs.
  }

  redirect(getLoginRedirectPath("signed-out"));
}