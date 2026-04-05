import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"
import { eliminarMovimiento } from "@/app/(dashboard)/transactions/new/actions"
import { Plus, Trash2 } from "lucide-react"
import type { Transaction } from "@/types/index"
import { DeleteButton } from "@/components/transactions/DeleteButton"

// Recibe searchParams para filtros por URL (?tipo=ingreso&mes=2025-03)
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

    const { t_type, t_month} = await searchParams
  if (t_type && t_type !== "all") {
    query = query.eq("t_type", t_type)
  }

  if (t_month) {
    const [year, month] = t_month.split("-")
    const from = `${year}-${month}-01`
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const to = `${year}-${month}-${lastDay}`
    query = query.gte("t_date", from).lte("t_date", to)
  }

  const { data: transactions } = await query

  const tipoActivo = t_type ?? "all"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Movimientos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {transactions?.length ?? 0} registros
          </p>
        </div>
        <Link
          href="/transactions/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus size={15} />
          Nuevo
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "all",   label: "Todos"     },
          { value: "income", label: "Ingresos"  },
          { value: "expense",   label: "Gastos"    },
        ].map(({ value, label }) => (
          <Link
            key={value}
            href={value === "all" ? "/transactions" : `/transactions?t_type=${value}`}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              tipoActivo === value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {transactions && transactions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-5 py-3">Fecha</th>
                <th className="text-left px-5 py-3">Tipo</th>
                <th className="text-left px-5 py-3">Categoría</th>
                <th className="text-left px-5 py-3">Descripción</th>
                <th className="text-right px-5 py-3">Monto</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t: Transaction) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {formatDate(t.t_date)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.t_type === "income"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {t.t_type === "income" ? "Ingreso" : "Gasto"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{t.category}</td>
                  <td className="px-5 py-3.5 text-gray-800">{t.description ?? "—"}</td>
                  <td className={`px-5 py-3.5 text-right font-medium tabular-nums ${
                    t.t_type === "income" ? "text-emerald-600" : "text-red-500"
                  }`}>
                    {t.t_type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <DeleteButton id={t.id}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">Sin movimientos.</p>
            <Link
              href="/transactions/new"
              className="mt-3 inline-block text-sm text-emerald-600 hover:underline"
            >
              Agrega el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
