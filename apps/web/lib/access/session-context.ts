import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MemberRole, TenantStatus } from "@/lib/supabase/database.types";

const ACTIVE_TENANT_STATUSES = new Set<TenantStatus>(["trial", "active"]);

export type AccessResolutionCode =
  | "AUTHENTICATED"
  | "NO_SESSION"
  | "PROFILE_NOT_FOUND"
  | "NO_ACTIVE_TENANT"
  | "MULTIPLE_TENANTS_UNSUPPORTED"
  | "TENANT_INACTIVE"
  | "ACCESS_ERROR";

export type TenantContext = {
  id: string;
  name: string;
  tradeName: string | null;
  status: TenantStatus;
  timezone: string;
  locale: string;
};

export type AuthenticatedUserContext = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isPlatformAdmin: boolean;
};

export type AccessContext = {
  user: AuthenticatedUserContext;
  tenant: TenantContext;
  role: MemberRole;
  membershipId: string;
};

export type AccessResolution =
  | {
      ok: true;
      code: "AUTHENTICATED";
      context: AccessContext;
    }
  | {
      ok: false;
      code: Exclude<AccessResolutionCode, "AUTHENTICATED">;
      safeMessage: string;
    };

type MembershipRow = {
  id: string;
  tenant_id: string;
  role: MemberRole;
  is_active: boolean;
};

export async function resolveServerAccessContext(): Promise<AccessResolution> {
  const supabase = await createSupabaseServerClient();

  const claimsResult = await supabase.auth.getClaims();
  const userId = claimsResult.data?.claims?.sub;

  if (!userId || claimsResult.error) {
    return accessDenied("NO_SESSION", "Sessao nao encontrada ou expirada.");
  }

  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;

  if (!user || user.id !== userId || userResult.error) {
    return accessDenied("NO_SESSION", "Sessao nao encontrada ou expirada.");
  }

  const profileResult = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, is_platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (profileResult.error) {
    return accessDenied("ACCESS_ERROR", "Nao foi possivel validar seu acesso.");
  }

  if (!profileResult.data) {
    return accessDenied("PROFILE_NOT_FOUND", "Seu acesso ainda nao esta disponivel.");
  }

  const membershipsResult = await supabase
    .from("tenant_members")
    .select("id, tenant_id, role, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .returns<MembershipRow[]>();

  if (membershipsResult.error) {
    return accessDenied("ACCESS_ERROR", "Nao foi possivel validar seu acesso.");
  }

  const activeMemberships = membershipsResult.data ?? [];

  if (activeMemberships.length === 0) {
    return accessDenied("NO_ACTIVE_TENANT", "Seu acesso esta inativo. Entre em contato com o suporte.");
  }

  if (activeMemberships.length > 1) {
    return accessDenied("MULTIPLE_TENANTS_UNSUPPORTED", "Nao foi possivel escolher a empresa automaticamente.");
  }

  const membership = activeMemberships[0];
  const tenantResult = await supabase
    .from("tenants")
    .select("id, name, trade_name, status, timezone, locale")
    .eq("id", membership.tenant_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (tenantResult.error) {
    return accessDenied("ACCESS_ERROR", "Nao foi possivel validar sua empresa.");
  }

  if (!tenantResult.data) {
    return accessDenied("NO_ACTIVE_TENANT", "Seu acesso esta inativo. Entre em contato com o suporte.");
  }

  if (!ACTIVE_TENANT_STATUSES.has(tenantResult.data.status)) {
    return accessDenied("TENANT_INACTIVE", "Seu acesso esta inativo. Entre em contato com o suporte.");
  }

  return {
    ok: true,
    code: "AUTHENTICATED",
    context: {
      user: {
        id: user.id,
        email: user.email ?? null,
        fullName: profileResult.data.full_name,
        avatarUrl: profileResult.data.avatar_url,
        isPlatformAdmin: profileResult.data.is_platform_admin
      },
      tenant: {
        id: tenantResult.data.id,
        name: tenantResult.data.name,
        tradeName: tenantResult.data.trade_name,
        status: tenantResult.data.status,
        timezone: tenantResult.data.timezone,
        locale: tenantResult.data.locale
      },
      role: membership.role,
      membershipId: membership.id
    }
  };
}

export async function requireServerAccessContext(): Promise<AccessContext> {
  const resolution = await resolveServerAccessContext();

  if (resolution.ok) {
    return resolution.context;
  }

  if (resolution.code === "NO_SESSION") {
    redirect("/login");
  }

  redirect("/acesso-negado");
}

function accessDenied(code: Exclude<AccessResolutionCode, "AUTHENTICATED">, safeMessage: string): AccessResolution {
  return {
    ok: false,
    code,
    safeMessage
  };
}
