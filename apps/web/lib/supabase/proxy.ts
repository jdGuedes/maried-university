import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabasePublicEnv, hasSupabasePublicEnv } from "./public-env";

const AUTH_ROUTES = ["/login", "/recuperar-senha", "/redefinir-senha"];
const PROTECTED_PREFIXES = ["/inicio", "/precificacao", "/estoque", "/fornecedores", "/minicursos", "/minha-conta", "/minha-assinatura"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAuthPath(pathname: string) {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function safeRedirectUrl(request: NextRequest, pathname: string) {
  return new URL(pathname, request.url);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  if (!hasSupabasePublicEnv()) {
    if (isProtectedPath(pathname)) {
      return NextResponse.redirect(safeRedirectUrl(request, "/login"));
    }

    return response;
  }

  const { url, publishableKey } = getSupabasePublicEnv();
  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { data, error } = await supabase.auth.getClaims();
  const hasVerifiedSession = Boolean(data?.claims?.sub && !error);

  if (isProtectedPath(pathname) && !hasVerifiedSession) {
    return NextResponse.redirect(safeRedirectUrl(request, "/login"));
  }

  if (isAuthPath(pathname) && hasVerifiedSession) {
    return NextResponse.redirect(safeRedirectUrl(request, "/inicio"));
  }

  return response;
}

export const protectedRoutePrefixes = PROTECTED_PREFIXES;
export const authRoutePrefixes = AUTH_ROUTES;
