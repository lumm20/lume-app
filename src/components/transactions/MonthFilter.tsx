"use client"

import { useRouter } from "next/navigation"

export function MonthFilter({
  activeMonth,
  activeType,
}: {
  activeMonth: string
  activeType: string
}) {
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams()
    if (activeType && activeType !== "all") params.set("t_type", activeType)
    if (e.target.value) params.set("t_month", e.target.value)
    const query = params.toString()
    router.push(`/transactions${query ? "?" + query : ""}`)
  }

  const opciones = Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleDateString("es-MX", { month: "long", year: "numeric" })
    return { value, label }
  })

  return (
    <select
      value={activeMonth}
      onChange={handleChange}
      className="px-3 py-1.5 rounded-xl text-sm border border-stone-200 bg-white text-stone-600 hover:border-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300"
    >
      <option value="">Todos los meses</option>
      {opciones.map((o) => (
        <option key={o.value} value={o.value} className="capitalize">
          {o.label}
        </option>
      ))}
    </select>
  )
}