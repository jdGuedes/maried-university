import { AuthenticatedShell } from "@/components/layout";
import { requireServerAccessContext } from "@/lib/access/session-context";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const access = await requireServerAccessContext();

  return <AuthenticatedShell access={access}>{children}</AuthenticatedShell>;
}