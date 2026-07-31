export type MemberRole = "owner" | "admin" | "manager" | "operator" | "viewer";

export type TenantStatus = "trial" | "active" | "past_due" | "suspended" | "cancelled";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          is_platform_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_platform_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_platform_admin?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      tenants: {
        Row: {
          id: string;
          name: string;
          trade_name: string | null;
          document_type: string | null;
          document_number: string | null;
          email: string | null;
          phone: string | null;
          status: TenantStatus;
          timezone: string;
          locale: string;
          stripe_customer_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          trade_name?: string | null;
          document_type?: string | null;
          document_number?: string | null;
          email?: string | null;
          phone?: string | null;
          status?: TenantStatus;
          timezone?: string;
          locale?: string;
          stripe_customer_id?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          name?: string;
          trade_name?: string | null;
          document_type?: string | null;
          document_number?: string | null;
          email?: string | null;
          phone?: string | null;
          status?: TenantStatus;
          timezone?: string;
          locale?: string;
          stripe_customer_id?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      tenant_members: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          role: MemberRole;
          is_active: boolean;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          role?: MemberRole;
          is_active?: boolean;
          joined_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: MemberRole;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey";
            columns: ["tenant_id"];
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tenant_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_tenant_member: {
        Args: { target_tenant: string };
        Returns: boolean;
      };
      has_tenant_role: {
        Args: { target_tenant_id: string; allowed_roles: MemberRole[] };
        Returns: boolean;
      };
    };
    Enums: {
      member_role: MemberRole;
      tenant_status: TenantStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
