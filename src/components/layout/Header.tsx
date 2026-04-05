"use client"

import type { User } from "@supabase/supabase-js"
import { logout } from "@/app/(auth)/login/actions"
import { LogOut } from "lucide-react"

export function Header({ user }: { user: User }) {
  return (
    <header className="h-14 shrink-0 border-b border-stone-200 bg-white flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
          {user.email}
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-500 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </form>
      </div>
    </header>
  )
}
