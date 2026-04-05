// app/(dashboard)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"
import { getCurrentMonthRange, formatCurrency } from "@/lib/utils"
import type { Transaction, MonthtlySummary } from "@/types/index"

// ─── Server Component: fetch directo, sin useEffect ───────────────────────
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen de {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Ingresos del mes"
          value={formatCurrency(summary.income)}
          color="green"
        />
        <MetricCard
          label="Gastos del mes"
          value={formatCurrency(summary.expenses)}
          color="red"
        />
        <MetricCard
          label="Ganancia neta"
          value={formatCurrency(summary.profits)}
          color={summary.profits >= 0 ? "green" : "red"}
        />
        <MetricCard
          label="Movimientos"
          value={String(summary.totalTransactions)}
          color="blue"
        />
      </div>

      {/* Últimos movimientos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-medium text-gray-800">Últimos movimientos</h2>
          <a href="/transactions/new"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            + Agregar
          </a>
        </div>
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
                <td className={`px-5 py-3 text-right font-medium ${
                  t.t_type === "income" ? "text-emerald-600" : "text-red-500"
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
    </div>
  )
}

// Componente auxiliar — mismo archivo por simplicidad
function MetricCard({
  label, value, color,
}: {
  label: string
  value: string
  color: "green" | "red" | "blue"
}) {
  const colors = {
    green: "text-emerald-600 bg-emerald-50",
    red: "text-red-500 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-semibold ${colors[color].split(" ")[0]}`}>{value}</p>
    </div>
  )
}
