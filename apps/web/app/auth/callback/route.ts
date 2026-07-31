import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLoginRedirectPath, getSafeRedirectPath } from "@/lib/auth/redirects";
import { hasSupabasePublicEnv } from "@/lib/supabase/public-env";

export const dynamic = "force-dynamic";

function redirectNoStore(request: NextRequest, pathname: string) {
  const response = NextResponse.redirect(new URL(pathname, request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));

  if (!hasSupabasePublicEnv() || !code) {
    return redirectNoStore(request, getLoginRedirectPath("invalid-link"));
  }

  const supabase = await createSupabaseServerClient();
  const exchangeResult = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeResult.error) {
    return redirectNoStore(request, getLoginRedirectPath("invalid-link"));
  }

  return redirectNoStore(request, nextPath);
}