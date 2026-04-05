"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema, type TransactionFormValues } from "@/lib/validations/transaction"
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/types/index"
import { createTransaction } from "@/app/(dashboard)/transactions/new/actions"
import { SubmitButton } from "../ui/SubmitButton"

export function TransactionForm() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      t_type: "income",
      t_date: new Date().toISOString().split("T")[0],
    },
  })

  const type = useWatch({name:"t_type", control})
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function onSubmit(data: TransactionFormValues) {
    setLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) formData.append(k, String(v))
    })
    await createTransaction(formData)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Tipo */}
      <div className="flex gap-2">
        {(["income", "expense"] as const).map((t) => (
          <label key={t} className="flex-1 cursor-pointer">
            <input type="radio" value={t} {...register("t_type")} className="sr-only" />
            <div className={`rounded-xl border-2 px-4 py-2.5 text-center text-sm font-medium transition-all ${
              type === t
                ? t === "income"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-rose-300 bg-rose-50 text-rose-600"
                : "border-stone-200 text-stone-400 hover:border-stone-300 hover:bg-stone-50"
            }`}>
              {t === "income" ? "💰 Ingreso" : "🛒 Gasto"}
            </div>
          </label>
        ))}
      </div>

      {/* Categoría */}
      <Field label="Categoría" error={errors.category?.message}>
        <select {...register("category")}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors">
          <option value="">Seleccionar...</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Field>

      {/* Monto */}
      <Field label="Monto ($MXN)" error={errors.amount?.message}>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register("amount", { valueAsNumber: true })}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors"
        />
      </Field>

      {/* Fecha */}
      <Field label="Fecha" error={errors.t_date?.message}>
        <input
          type="date"
          {...register("t_date")}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors"
        />
      </Field>

      {/* Descripción */}
      <Field label="Descripción (opcional)" error={errors.description?.message}>
        <input
          type="text"
          placeholder="Ej. Pastel 3 pisos boda García"
          {...register("description")}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors"
        />
      </Field>

      {/* Notas */}
      <Field label="Notas (opcional)" error={errors.notes?.message}>
        <textarea
          placeholder="Ej. Pago anticipado, pendiente entregar el sábado"
          rows={2}
          {...register("notes")}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors resize-none"
        />
      </Field>

      <SubmitButton initialText="Guardar movimiento" loadingText="Guardando..." className="w-full rounded-xl bg-stone-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"/>
    </form>
  )
}

function Field({ label, error, children }: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-600">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}
