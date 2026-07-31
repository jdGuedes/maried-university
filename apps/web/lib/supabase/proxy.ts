import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabasePublicEnv, hasSupabasePublicEnv } from "./public-env";

const AUTH_ROUTES = ["/login", "/recuperar-senha"];
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

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  if (!hasSupabasePublicEnv()) {
    if (isProtectedPath(pathname)) {
      return noStore(NextResponse.redirect(safeRedirectUrl(request, "/login")));
    }

    return noStore(response);
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
    const loginUrl = safeRedirectUrl(request, "/login");
    loginUrl.searchParams.set("next", pathname);
    return noStore(NextResponse.redirect(loginUrl));
  }

  if (isAuthPath(pathname) && hasVerifiedSession) {
    return noStore(NextResponse.redirect(safeRedirectUrl(request, "/inicio")));
  }

  return noStore(response);
}

export const protectedRoutePrefixes = PROTECTED_PREFIXES;
export const authRoutePrefixes = AUTH_ROUTES;