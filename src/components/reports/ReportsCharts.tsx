"use client"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend, TooltipContentProps,
} from "recharts"

const INCOME_COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]
const EXPENSE_COLORS = ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"]

function formatMXN(value: number) {
  return "$" + Math.round(value).toLocaleString("es-MX")
}

// ── Tooltip personalizado ─────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-stone-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey as string} style={{ color: p.color }}>
          {p.name}: {formatMXN(p.value as number)}
        </p>
      ))}
    </div>
  )
}

// ── Pie tooltip ───────────────────────────────────────────────────────────
function PieTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-sm px-3 py-2 text-sm">
      <p className="font-medium text-stone-700">{d.name}</p>
      <p style={{ color: d.payload.fill }}>{formatMXN(d.value as number)}</p>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────
interface Props {
  flujoPorMes: { mes: string; ingresos: number; gastos: number }[]
  categoriaIngresos: { nombre: string; total: number }[]
  categoriaGastos: { nombre: string; total: number }[]
}

export function ReportesCharts({
  flujoPorMes,
  categoriaIngresos,
  categoriaGastos,
}: Props) {
  const hayDatos = flujoPorMes.some((m) => m.ingresos > 0 || m.gastos > 0)

  if (!hayDatos) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 py-16 text-center">
        <p className="text-stone-400 text-sm">Sin movimientos este año para graficar.</p>
      </div>
    )
  }

  const pieIngresos = categoriaIngresos.map((c, i) => ({
    name: c.nombre,
    value: c.total,
    fill: INCOME_COLORS[i % INCOME_COLORS.length],
  }))

  const pieGastos = categoriaGastos.map((c, i) => ({
    name: c.nombre,
    value: c.total,
    fill: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
  }))

  return (
    <div className="space-y-4">
      {/* Flujo mensual */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5">
        <h2 className="text-sm font-medium text-stone-700 mb-4">Flujo mensual</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={flujoPorMes} barGap={2} barCategoryGap="30%">
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: "#a8a29e" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatMXN}
              tick={{ fontSize: 10, fill: "#a8a29e" }}
              axisLine={false}
              tickLine={false}
              width={68}
            />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" name="Gastos" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-5 justify-center mt-2">
          <span className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />Ingresos
          </span>
          <span className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />Gastos
          </span>
        </div>
      </div>

      {/* Donas — 1 col móvil, 2 col md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieCard title="Ingresos por categoría" data={pieIngresos} />
        <PieCard title="Gastos por categoría" data={pieGastos} />
      </div>

      {/* Tablas desglose — 1 col móvil, 2 col md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CatTable title="Desglose de ingresos" data={categoriaIngresos} color="emerald" />
        <CatTable title="Desglose de gastos" data={categoriaGastos} color="red" />
      </div>
    </div>
  )
}

function PieCard({ title, data }: { title: string; data: { name: string, value: number, fill: string }[] }) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5">
        <h2 className="text-sm font-medium text-stone-700 mb-3">{title}</h2>
        <p className="text-stone-400 text-sm text-center py-8">Sin datos</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5">
      <h2 className="text-sm font-medium text-stone-700 mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Pie>
          <Tooltip content={PieTooltip} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-stone-600">
              <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: d.fill }} />
              <span className="truncate max-w-35">{d.name}</span>
            </span>
            <span className="font-medium text-stone-800 ml-2">{formatMXN(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CatTable({
  title, data, color,
}: {
  title: string
  data: { nombre: string; total: number }[]
  color: "emerald" | "red"
}) {
  const total = data.reduce((a, d) => a + d.total, 0)
  const textColor = color === "emerald" ? "text-emerald-600" : "text-red-500"
  const barColor = color === "emerald" ? "bg-emerald-500" : "bg-red-400"

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 md:p-5">
      <h2 className="text-sm font-medium text-stone-700 mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-stone-400 text-sm text-center py-4">Sin datos</p>
      ) : (
        <div className="space-y-3">
          {data.map((d) => {
            const pct = total > 0 ? (d.total / total) * 100 : 0
            return (
              <div key={d.nombre}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-600 truncate max-w-[55%]">{d.nombre}</span>
                  <span className={`font-medium ${textColor}`}>
                    {formatMXN(d.total)}
                    <span className="text-stone-400 font-normal ml-1">({pct.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-100">
                  <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
