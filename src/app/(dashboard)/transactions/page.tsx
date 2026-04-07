import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus } from "lucide-react"
import type { Transaction } from "@/types/index"
import { DeleteButton } from "@/components/transactions/DeleteButton"
import { MonthFilter } from "@/components/transactions/MonthFilter"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { t_type?: string; t_month?: string }
}) {
  const supabase = await createClient()

  let query = supabase
    .from("transactions")
    .select("*")
    .order("t_date", { ascending: false })
    .order("created_at", { ascending: false })

  const { t_type, t_month } = await searchParams
  if (t_type && t_type !== "all") {
    query = query.eq("t_type", t_type)
  }

  if (t_month) {
    const [year, month] = t_month.split("-")
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    query = query
      .gte("fecha", `${t_month}-01`)
      .lte("fecha", `${t_month}-${lastDay}`)
  }

  const { data: transactions } = await query

  const activeType = t_type ?? "all"
  const activeMonth = t_month ?? ""

  const FILTERS = [
    { value: "all", label: "Todos" },
    { value: "income", label: "Ingresos" },
    { value: "expense", label: "Gastos" },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Movimientos</h1>
          <p className="text-sm text-stone-400 mt-0.5">{transactions?.length ?? 0} registros</p>
        </div>
        <Link
          href="/transactions/new"
          className="flex items-center gap-2 rounded-xl bg-stone-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nuevo</span>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap items-center">
        {FILTERS.map(({ value, label }) => (
          <Link
            key={value}
            href={value === "all" ? "/transactions" : `/transactions?t_type=${value}`}
            className={`px-3.5 py-1.5 rounded-xl text-sm border transition-all duration-150 ${activeType === value
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-700 hover:shadow-sm"
              }`}
          >
            {label}
          </Link>
        ))}
        <MonthFilter activeMonth={activeMonth} activeType={activeType}/>
      </div>

      {/* Tabla desktop*/}
      <div className="hidden sm:block bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {transactions && transactions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3">Fecha</th>
                <th className="text-left px-5 py-3">Tipo</th>
                <th className="text-left px-5 py-3">Categoría</th>
                <th className="text-left px-5 py-3">Descripción</th>
                <th className="text-right px-5 py-3">Monto</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {transactions.map((t: Transaction) => (
                <tr key={t.id} className="hover:bg-stone-50 transition-colors group">
                  <td className="px-5 py-3.5 text-stone-400 text-xs whitespace-nowrap">{formatDate(t.t_date)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${t.t_type === "income"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}>
                      {t.t_type === "income" ? "Ingreso" : "Gasto"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-lg text-xs bg-stone-100 text-stone-500">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-stone-700">{t.description ?? "—"}</td>
                  <td className={`px-5 py-3.5 text-right font-medium tabular-nums ${t.t_type === "income" ? "text-emerald-600" : "text-rose-500"
                    }`}>
                    {t.t_type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <DeleteButton id={t.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <p className="text-stone-400 text-sm">Sin movimientos.</p>
            <Link href="/transactions/new" className="mt-3 inline-block text-sm text-stone-600 hover:underline">
              Agrega el primero
            </Link>
          </div>
        )}
      </div>

      {/* Cards móvil */}
      <div className="sm:hidden space-y-2">
        {transactions && transactions.length > 0 ? transactions.map((t: Transaction) => (
          <div key={t.id} className="bg-white rounded-2xl border border-stone-200 px-4 py-3.5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${t.t_type === "income"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-600 border border-rose-200"
                  }`}>
                  {t.t_type === "income" ? "Ingreso" : "Gasto"}
                </span>
                <span className="text-xs text-stone-400 truncate">{t.category}</span>
              </div>
              <p className="text-sm text-stone-700 truncate">{t.description ?? "—"}</p>
              <p className="text-xs text-stone-400 mt-0.5">{formatDate(t.t_date)}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`font-medium tabular-nums text-sm ${t.t_type === "income" ? "text-emerald-600" : "text-rose-500"
                }`}>
                {t.t_type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
              </span>
              <DeleteButton id={t.id} />
            </div>
          </div>
        )) : (
          <div className="py-12 text-center text-stone-400 text-sm">
            Sin movimientos.{" "}
            <Link href="/transactions/new" className="text-stone-600 hover:underline">
              Agrega el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
