"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ingredientSchema, type IngredientFormValues } from "@/lib/validations/ingredient"
import { UNIDADES, type Ingredient } from "@/types/index"
import { SubmitButton } from "@/components/ui/SubmitButton"

interface Props {
  onSubmit: (formData: FormData) => Promise<void>
  defaultValues?: Partial<Ingredient>
  submitLabel?: string
}

export function IngredientForm({
  onSubmit,
  defaultValues,
  submitLabel = "Guardar ingrediente",
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      i_name:   defaultValues?.i_name   ?? "",
      price:   defaultValues?.price   ?? undefined,
      quantity: defaultValues?.quantity ?? undefined,
      unit:   defaultValues?.unit   ?? undefined,
      notes:    defaultValues?.notes    ?? "",
    },
  })

  async function handleAction(data: IngredientFormValues) {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) formData.append(k, String(v))
    })
    await onSubmit(formData)
  }

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors"

  return (
    <form onSubmit={handleSubmit(handleAction)} className="space-y-5">
      <Field label="Nombre" error={errors.i_name?.message}>
        <input
          type="text"
          placeholder="Ej. Harina de trigo"
          {...register("i_name")}
          className={inputClass}
        />
      </Field>

      {/* Precio y quantity en la misma fila */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Precio ($MXN)" error={errors.price?.message}>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
            className={inputClass}
          />
        </Field>

        <Field label="Cantidad incluida" error={errors.quantity?.message}>
          <input
            type="number"
            step="0.001"
            min="0"
            placeholder="0"
            {...register("quantity", { valueAsNumber: true })}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Unidad" error={errors.unit?.message}>
        <select {...register("unit")} className={inputClass}>
          <option value="">Seleccionar...</option>
          {UNIDADES.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Hint contextual */}
      <p className="text-xs text-stone-400 -mt-3">
        Ejemplo: Harina $25 · 1000 g → la app calcula cuánto cuesta cada gramo que usas en tus recetas.
      </p>

      <Field label="Notas (opcional)" error={errors.notes?.message}>
        <input
          type="text"
          placeholder="Ej. Marca Selecta, La Moderna..."
          {...register("notes")}
          className={inputClass}
        />
      </Field>

      <SubmitButton 
      initialText={submitLabel} 
      loadingText="Guardando..." 
      className="w-full rounded-xl bg-stone-800 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2" />
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
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