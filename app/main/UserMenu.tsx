//Client Component: the name dropdown
"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/login/actions";

export function UserMenu({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm text-gray-300 hover:text-white"
      >
        {name} ▾
      </button>

      {open && (
        <>
          {/* click-away backdrop */}
        <div className="fixed inset-0 z-0" onClick={() => setOpen(false)} />
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-700 bg-gray-900 py-1 z-10">
            {isAdmin && (
                <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-800">
                Admin page
                </Link>
            )}
            <Link href="/user" className="block px-4 py-2 text-sm hover:bg-gray-800">
                Profile page
            </Link>
            <form action={logout}>
                <button
                type="submit"
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                >
                Log out
                </button>
            </form>
        </div>
        </>
      )}
    </div>
  );
}