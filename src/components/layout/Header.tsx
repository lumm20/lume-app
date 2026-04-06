"use client"

import type { User } from "@supabase/supabase-js"
import { logout } from "@/app/(auth)/login/actions"
import { LogOut } from "lucide-react"

export function Header({ user }: { user: User }) {
  return (
    <header className="h-14 shrink-0 border-b border-stone-200 bg-white flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-lg">🍰</span>
        <span className="font-semibold text-stone-800 text-sm">PastryBooks</span>
      </div>
      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full max-w-[140px] truncate hidden sm:block">
          {user.email}
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline text-sm">Salir</span>
          </button>
        </form>
      </div>
    </header>
  )
}
