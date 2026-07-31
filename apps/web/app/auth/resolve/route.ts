import { NextResponse } from "next/server";
import { resolveServerAccessContext } from "@/lib/access/session-context";
import { hasSupabasePublicEnv } from "@/lib/supabase/public-env";

export const dynamic = "force-dynamic";

function noStoreJson(destination: string) {
  return NextResponse.json(
    { destination },
    {
      headers: {
        "Cache-Control": "private, no-store"
      }
    }
  );
}

export async function GET() {
  if (!hasSupabasePublicEnv()) {
    return noStoreJson("/login");
  }

  const access = await resolveServerAccessContext();

  if (access.ok) {
    return noStoreJson("/inicio");
  }

  if (access.code === "NO_SESSION") {
    return noStoreJson("/login");
  }

  return noStoreJson("/acesso-negado");
}