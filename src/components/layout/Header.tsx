"use client"

import type { User } from "@supabase/supabase-js"
import { logout } from "@/app/(auth)/login/actions"
import { LogOut } from "lucide-react"

export function Header({ user }: { user: User }) {
  return (
    <header className="h-14 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      {/* Espacio izquierdo — se puede usar para breadcrumbs después */}
      <div />

      {/* Usuario + logout */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{user.email}</span>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
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
