"use client";

import type { ButtonHTMLAttributes } from "react";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth/actions";
import { Spinner } from "@/components/feedback";
import { Button } from "@/components/ui";

type LogoutButtonProps = Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "role">;

export function LogoutButton({ className, role }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className={className}
      disabled={isPending}
      onClick={() => {
        window.localStorage.removeItem("maried:last-route");
        window.sessionStorage.clear();
        startTransition(() => {
          void signOutAction();
        });
      }}
      role={role}
      type="button"
      variant="secondary"
    >
      {isPending ? <Spinner /> : <LogOut aria-hidden="true" size={18} />}
      Sair
    </Button>
  );
}