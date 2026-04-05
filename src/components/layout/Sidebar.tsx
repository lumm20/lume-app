"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowLeftRight, BarChart2 } from "lucide-react"

const NAV = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard, activeColor: "text-violet-500",  activeBg: "bg-violet-50  border-violet-200"  },
  { href: "/transactions", label: "Movimientos",  icon: ArrowLeftRight,  activeColor: "text-sky-600",     activeBg: "bg-sky-50     border-sky-200"      },
  { href: "/reports",    label: "Reportes",     icon: BarChart2,       activeColor: "text-emerald-600", activeBg: "bg-emerald-50 border-emerald-200"  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-stone-200 bg-stone-50 flex flex-col">
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-stone-200">
        <span className="text-xl">🍰</span>
        <span className="font-semibold text-stone-800 text-sm tracking-tight">PastryBooks</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, activeColor, activeBg }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm border transition-all duration-150 ${
                active
                  ? `${activeBg} ${activeColor} font-medium`
                  : "border-transparent text-stone-500 hover:bg-white hover:text-stone-800 hover:border-stone-200 hover:shadow-sm"
              }`}
            >
              <Icon size={15} className={active ? activeColor : "text-stone-400"} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-stone-200">
        <p className="text-xs text-stone-400">PastryBooks v1.0</p>
      </div>
    </aside>
  )
}
