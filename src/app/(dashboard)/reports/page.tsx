import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { ReportesCharts } from "@/components/reports/ReportsCharts"
import type { Transaction } from "@/types/index"

export default async function ReportesPage() {
  const supabase = await createClient()

  // Traer todos los movimientos del año en curso
  const year = new Date().getFullYear()
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .gte("fecha", `${year}-01-01`)
    .lte("fecha", `${year}-12-31`)
    .order("fecha", { ascending: true })

  const todos: Transaction[] = transactions ?? []

  // ── Resumen anual ────────────────────────────────────────────────────────
  const totalIngresos = todos
    .filter((t) => t.t_type === "income")
    .reduce((a, t) => a + t.amount, 0)

  const totalGastos = todos
    .filter((t) => t.t_type === "expense")
    .reduce((a, t) => a + t.amount, 0)

  const ganancia = totalIngresos - totalGastos
  const margen = totalIngresos > 0 ? (ganancia / totalIngresos) * 100 : 0

  // ── Flujo por mes ────────────────────────────────────────────────────────
  const mesesNombres = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ]
  const flujoPorMes = mesesNombres.map((mes, i) => {
    const movDelMes = todos.filter(
      (t) => new Date(t.t_date + "T12:00:00").getMonth() === i
    )
    return {
      mes,
      ingresos: movDelMes.filter((t) => t.t_type === "income").reduce((a, t) => a + t.amount, 0),
      gastos:   movDelMes.filter((t) => t.t_type === "expense").reduce((a, t) => a + t.amount, 0),
    }
  })

  // ── Por categoría ────────────────────────────────────────────────────────
  const agruparPorCat = (tipo: "income" | "expense") => {
    const mapa: Record<string, number> = {}
    todos.filter((t) => t.t_type === tipo).forEach((t) => {
      mapa[t.category] = (mapa[t.category] ?? 0) + t.amount
    })
    return Object.entries(mapa)
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total)
  }

  const categoriaIngresos = agruparPorCat("income")
  const categoriaGastos   = agruparPorCat("expense")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
        <p className="text-sm text-gray-500 mt-0.5">Año {year}</p>
      </div>

      {/* Métricas anuales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Ingresos totales"  value={formatCurrency(totalIngresos)} color="green" />
        <MetricCard label="Gastos totales"    value={formatCurrency(totalGastos)}   color="red"   />
        <MetricCard
          label="Ganancia neta"
          value={formatCurrency(Math.abs(ganancia))}
          color={ganancia >= 0 ? "green" : "red"}
          prefix={ganancia < 0 ? "−" : undefined}
        />
        <MetricCard
          label="Margen neto"
          value={`${margen.toFixed(1)}%`}
          color={margen >= 0 ? "blue" : "red"}
        />
      </div>

      {/* Gráficas — componente cliente para Recharts */}
      <ReportesCharts
        flujoPorMes={flujoPorMes}
        categoriaIngresos={categoriaIngresos}
        categoriaGastos={categoriaGastos}
      />
    </div>
  )
}

function MetricCard({
  label, value, color, prefix,
}: {
  label: string
  value: string
  color: "green" | "red" | "blue"
  prefix?: string
}) {
  const textColor = {
    green: "text-emerald-600",
    red:   "text-red-500",
    blue:  "text-blue-600",
  }[color]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-semibold ${textColor}`}>
        {prefix}{value}
      </p>
    </div>
  )
}
