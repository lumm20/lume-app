"use client"

import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormStatus } from "react-dom"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { recipeSchema, type RecipeFormValues } from "@/lib/validations/recipe"
import { formatCurrency, calculateRecipe } from "@/lib/utils"
import type { Ingredient, Recipe, RecipeIngredient } from "@/types/index"

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-stone-800 px-4 py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
    >
      {pending && <Loader2 size={15} className="animate-spin" />}
      {pending ? "Guardando..." : label}
    </button>
  )
}

interface Props {
  ingredients: Ingredient[]
  onSubmit: (data: RecipeFormValues) => Promise<void>
  defaultValues?: Recipe & { recipe_ingredients: RecipeIngredient[] }
  submitLabel?: string
}

export function RecipeForm({
  ingredients,
  onSubmit,
  defaultValues,
  submitLabel = "Guardar recipe",
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      r_name:       defaultValues?.r_name       ?? "",
      overhead_pct: defaultValues?.overhead_pct ?? 30,
      margin_pct:   defaultValues?.margin_pct   ?? 40,
      notes:        defaultValues?.notes        ?? "",
      ingredients: defaultValues?.recipe_ingredients?.map((ri) => ({
        ingredient_id: ri.ingredient_id,
        quantity:       ri.quantity,
      })) ?? [{ ingredient_id: "", quantity: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  })

  // Watch para el preview en tiempo real
  const watchedIngredients = useWatch({ control, name: "ingredients" })
  const watchedOverhead     = useWatch({ control, name: "overhead_pct" })
  const watchedMargen       = useWatch({ control, name: "margin_pct" })

  // Calcula el preview usando los ingredients del catálogo
  const preview = calculateRecipe(
    watchedIngredients
      .filter((wi) => wi.ingredient_id && wi.quantity > 0)
      .map((wi) => ({
        quantity:    wi.quantity,
        ingredient: ingredients.find((i) => i.id === wi.ingredient_id)!,
      }))
      .filter((wi) => wi.ingredient),
    watchedOverhead ?? 0,
    watchedMargen   ?? 0
  )

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nombre */}
      <Field label="Nombre del producto" error={errors.r_name?.message}>
        <input
          type="text"
          placeholder="Ej. Pastel de chocolate 1kg"
          {...register("r_name")}
          className={inputClass}
        />
      </Field>

      {/* Overhead y margen */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="% Overhead (tiempo + servicios)" error={errors.overhead_pct?.message}>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="30"
              {...register("overhead_pct", { valueAsNumber: true })}
              className={inputClass + " pr-8"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">%</span>
          </div>
        </Field>
        <Field label="% Margen de ganancia" error={errors.margin_pct?.message}>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="40"
              {...register("margin_pct", { valueAsNumber: true })}
              className={inputClass + " pr-8"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">%</span>
          </div>
        </Field>
      </div>

      {/* Lista de ingredients */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-stone-600">Ingredients</label>
          <button
            type="button"
            onClick={() => append({ ingredient_id: "", quantity: 0 })}
            className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <Plus size={13} />
            Agregar ingrediente
          </button>
        </div>

        {errors.ingredients?.root && (
          <p className="text-xs text-rose-500">{errors.ingredients.root.message}</p>
        )}

        {fields.map((field, index) => {
          const wi = watchedIngredients[index]
          const ing = ingredients.find((i) => i.id === wi?.ingredient_id)
          const costoLinea =
            ing && wi?.quantity > 0
              ? (wi.quantity / ing.quantity) * ing.price
              : null

          return (
            <div
              key={field.id}
              className="bg-stone-50 rounded-xl border border-stone-200 p-3 space-y-2"
            >
              <div className="flex gap-2">
                {/* Selector de ingrediente */}
                <div className="flex-1">
                  <select
                    {...register(`ingredients.${index}.ingredient_id`)}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors"
                  >
                    <option value="">Seleccionar...</option>
                    {ingredients.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.i_name} ({i.quantity}{i.unit} · {formatCurrency(i.price)})
                      </option>
                    ))}
                  </select>
                  {errors.ingredients?.[index]?.ingredient_id && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.ingredients[index]?.ingredient_id?.message}
                    </p>
                  )}
                </div>

                {/* Cantidad + unidad */}
                <div className="w-32 shrink-0">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0"
                      {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                      className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors pr-8"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
                      {ing?.unit ?? "—"}
                    </span>
                  </div>
                  {errors.ingredients?.[index]?.quantity && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.ingredients[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                {/* Botón eliminar fila */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-stone-300 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Costo de esta línea */}
              {costoLinea !== null && (
                <p className="text-xs text-amber-600 font-medium pl-1">
                  Costo: {formatCurrency(costoLinea)}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Notas */}
      <Field label="Notas (opcional)" error={errors.notes?.message}>
        <input
          type="text"
          placeholder="Ej. Rinde para 10-12 personas"
          {...register("notes")}
          className={inputClass}
        />
      </Field>

      {/* Preview del resultado en tiempo real */}
      {preview.ingredientsCost > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-2">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-3">
            Vista previa del precio
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Costo de ingredients</span>
            <span className="font-medium text-stone-800 tabular-nums">
              {formatCurrency(preview.ingredientsCost)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Con overhead ({watchedOverhead}%)</span>
            <span className="font-medium text-stone-800 tabular-nums">
              {formatCurrency(preview.totalCost)}
            </span>
          </div>
          <div className="border-t border-amber-200 pt-2 flex justify-between">
            <span className="text-sm font-semibold text-amber-800">
              Precio de venta sugerido
            </span>
            <span className="text-lg font-bold text-amber-700 tabular-nums">
              {formatCurrency(preview.sellingPrice)}
            </span>
          </div>
        </div>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  )
}

function Field({
  label, error, children,
}: {
  label: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-600">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}