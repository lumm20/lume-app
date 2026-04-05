"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowLeftRight, BarChart2 } from "lucide-react"

const NAV = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/movimientos",  label: "Movimientos",  icon: ArrowLeftRight   },
  { href: "/reportes",     label: "Reportes",     icon: BarChart2        },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-5 border-b border-gray-100">
        <span className="text-xl">🍰</span>
        <span className="font-semibold text-gray-900 text-sm">PastryBooks</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={16} className={active ? "text-emerald-600" : "text-gray-400"} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Version — espacio para futuros links de configuración */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">PastryBooks v1.0</p>
      </div>
    </aside>
  )
}
