"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-red-600 transition-colors hover:bg-red-50"
    >
      {children}
    </button>
  );
}
