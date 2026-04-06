import { createClient } from "@/lib/supabase/server"
import { getCurrentMonthRange, formatCurrency } from "@/lib/utils"
import type { Transaction, MonthtlySummary } from "@/types/index"
import { Minus, Plus, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { from, to } = getCurrentMonthRange()

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .gte("t_date", from)
    .lte("t_date", to)
    .order("t_date", { ascending: false })

  const summary: MonthtlySummary = (transactions ?? []).reduce(
    (acc, t: Transaction) => {
      if (t.t_type === "income") acc.income += t.amount
      else acc.expenses += t.amount
      acc.totalTransactions++
      return acc
    },
    { income: 0, expenses: 0, profits: 0, totalTransactions: 0 }
  )
  summary.profits = summary.income - summary.expenses

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Resumen de {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
          </p>
        </div>

        <Link
          href="/transactions/new"
          className="flex items-center gap-2 rounded-xl bg-stone-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nuevo</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Ingresos del mes"
          value={formatCurrency(summary.income)}
          icon={<TrendingUp size={16} />}
          palette="bg-emerald-50 border-emerald-200 text-emerald-700"
          iconBg="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          label="Gastos del mes"
          value={formatCurrency(summary.expenses)}
          icon={<TrendingDown size={16} />}
          palette="bg-rose-50 border-rose-200 text-rose-600"
          iconBg="bg-rose-100 text-rose-500"
        />
        <MetricCard
          label="Ganancia neta"
          value={formatCurrency(summary.profits)}
          prefix={summary.profits < 0 ? "-" : undefined}
          icon={<Minus size={16} />}
          palette={summary.profits >= 0
            ? "bg-sky-50 border-sky-200 text-sky-700"
            : "bg-amber-50 border-amber-200 text-amber-700"}
          iconBg={summary.profits >= 0 ? "bg-sky-100 text-sky-600" : "bg-amber-100 text-amber-600"}
        />
      </div>
      
         {/* Últimos movimientos */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3.5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-stone-700">Últimos movimientos</h2>
          <Link href="/transactions" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
            Ver todos →
          </Link>
        </div>

        {/* Tabla en desktop */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3">Fecha</th>
                <th className="text-left px-5 py-3">Descripción</th>
                <th className="text-left px-5 py-3">Categoría</th>
                <th className="text-right px-5 py-3">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {(transactions ?? []).slice(0, 8).map((t: Transaction) => (
                <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5 text-stone-400 whitespace-nowrap text-xs">{t.t_date}</td>
                  <td className="px-5 py-3.5 text-stone-700">{t.description ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-stone-100 text-stone-500">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-right font-medium tabular-nums ${
                    t.t_type === "income" ? "text-emerald-600" : "text-rose-500"
                  }`}>
                    {t.t_type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards en móvil */}
        <div className="sm:hidden divide-y divide-stone-50">
          {(transactions ?? []).slice(0, 8).map((t: Transaction) => (
            <div key={t.id} className="px-4 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-stone-700 truncate">{t.description ?? t.category}</p>
                <p className="text-xs text-stone-400 mt-0.5">{t.t_date} · {t.category}</p>
              </div>
              <span className={`ml-3 font-medium tabular-nums text-sm shrink-0 ${
                t.t_type === "income" ? "text-emerald-600" : "text-rose-500"
              }`}>
                {t.t_type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
          {!transactions?.length && (
            <div className="px-4 py-10 text-center text-stone-400 text-sm">
              Sin movimientos este mes.{" "}
              <Link href="/transactions/new" className="text-stone-600 hover:underline">
                Agrega el primero
              </Link>
            </div>
          )}
        </div>

        {!transactions?.length && (
          <div className="hidden sm:block px-5 py-12 text-center text-stone-400 text-sm">
            Sin movimientos este mes.{" "}
            <Link href="/transactions/new" className="text-stone-600 hover:underline">
              Agrega el primero
            </Link>
          </div>
        )}
      </div>

        {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Últimos movimientos</h2>
            <a href="/transactions/new"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              + Agregar
            </a>
          </div>

          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Fecha</th>
                  <th className="text-left px-5 py-3">Descripción</th>
                  <th className="text-left px-5 py-3">Categoría</th>
                  <th className="text-right px-5 py-3">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(transactions ?? []).slice(0, 8).map((t: Transaction) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{t.t_date}</td>
                    <td className="px-5 py-3 text-gray-800">{t.description ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right font-medium ${t.t_type === "income" ? "text-emerald-600" : "text-red-500"
                      }`}>
                      {t.t_type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
                {!transactions?.length && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400">
                      Sin movimientos este mes.{" "}
                      <a href="/transactions/new" className="text-emerald-600 hover:underline">
                        Agrega el primero
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
      )
}

function MetricCard({
  label, value, prefix, icon, palette, iconBg,
}: {
  label: string
  value: string
  prefix?: string
  icon: React.ReactNode
  palette: string
  iconBg: string
}) {
  return (
    <div className={`rounded-2xl border p-4 md:p-5 transition-shadow hover:shadow-md ${palette}`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
        <span className={`p-1.5 rounded-lg ${iconBg}`}>{icon}</span>
      </div>
      <p className="text-2xl font-semibold">{prefix}{value}</p>
    </div>
  )
}
