"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth/actions";
import { Spinner } from "@/components/feedback";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        window.localStorage.removeItem("maried:last-route");
        window.sessionStorage.clear();
        startTransition(() => {
          void signOutAction();
        });
      }}
      type="button"
      variant="secondary"
    >
      {isPending ? <Spinner /> : <LogOut aria-hidden="true" size={18} />}
      Sair
    </Button>
  );
}