"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CreditCard, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/auth";

export function UserMenu({ displayName, email }: { displayName: string; email: string | null }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="user-menu">
      <button aria-expanded={open} aria-haspopup="menu" className="user-menu-trigger" onClick={() => setOpen((current) => !current)} ref={buttonRef} type="button">
        <span className="user-menu-avatar" aria-hidden="true">
          {displayName.slice(0, 1).toUpperCase()}
        </span>
        <span className="user-menu-copy">
          <span>{displayName}</span>
          {email ? <small>{email}</small> : null}
        </span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>

      {open ? (
        <div className="user-menu-panel" ref={menuRef} role="menu">
          <Link className="user-menu-item" href="/minha-conta" role="menuitem" onClick={() => setOpen(false)}>
            <UserRound aria-hidden="true" size={17} />
            Minha Conta
          </Link>
          <Link className="user-menu-item" href="/minha-assinatura" role="menuitem" onClick={() => setOpen(false)}>
            <CreditCard aria-hidden="true" size={17} />
            Minha Assinatura
          </Link>
          <div className="user-menu-divider" />
          <LogoutButton className="user-menu-item user-menu-logout" role="menuitem" />
        </div>
      ) : null}
    </div>
  );
}