import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils"
import { DeleteIngredientButton } from "@/components/costs/DeleteIngredientButton"
import { Plus } from "lucide-react"
import type { Ingredient } from "@/types/index"

export default async function IngredientsPage() {
  const supabase = await createClient()
  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .order("i_name", { ascending: true })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Ingredientes</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            {ingredients?.length ?? 0} en el catálogo
          </p>
        </div>
        <Link
          href="/costs/ingredients/new"
          className="flex items-center gap-2 rounded-xl bg-stone-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nuevo</span>
        </Link>
      </div>

      {/* Tabla desktop */}
      <div className="hidden sm:block bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {ingredients && ingredients.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                <th className="text-left px-5 py-3">Nombre</th>
                <th className="text-left px-5 py-3">Presentación</th>
                <th className="text-right px-5 py-3">Precio</th>
                <th className="text-right px-5 py-3">Costo por unidad</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {ingredients.map((ing: Ingredient) => {
                const costPerUnit = ing.price / ing.quantity
                return (
                  <tr key={ing.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-5 py-3.5 font-medium text-stone-800">
                      {ing.i_name}
                      {ing.notes && (
                        <span className="ml-2 text-xs text-stone-400 font-normal">{ing.notes}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">
                      {ing.quantity} {ing.unit}
                    </td>
                    <td className="px-5 py-3.5 text-right text-stone-700 tabular-nums">
                      {formatCurrency(ing.price)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      <span className="text-amber-600 font-medium">
                        {formatCurrency(costPerUnit)}
                      </span>
                      <span className="text-stone-400 text-xs ml-1">/{ing.unit}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                        <Link
                          href={`/costs/ingredients/${ing.id}/update`}
                          className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          Editar
                        </Link>
                        <DeleteIngredientButton id={ing.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <p className="text-stone-400 text-sm">Sin ingredientes en el catálogo.</p>
            <Link
              href="/costs/ingredients/new"
              className="mt-3 inline-block text-sm text-stone-600 hover:underline"
            >
              Agrega el primero
            </Link>
          </div>
        )}
      </div>

      {/* Cards móvil */}
      <div className="sm:hidden space-y-2">
        {ingredients && ingredients.length > 0 ? (
          ingredients.map((ing: Ingredient) => {
            const costPerUnit = ing.price / ing.quantity
            return (
              <div
                key={ing.id}
                className="bg-white rounded-2xl border border-stone-200 px-4 py-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-800">{ing.i_name}</p>
                    {ing.notes && (
                      <p className="text-xs text-stone-400 mt-0.5">{ing.notes}</p>
                    )}
                    <p className="text-xs text-stone-400 mt-1">
                      {ing.quantity} {ing.unit} · {formatCurrency(ing.price)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-amber-600 tabular-nums">
                      {formatCurrency(costPerUnit)}/{ing.unit}
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-2">
                      <Link
                        href={`/costs/ingredients/${ing.id}/update`}
                        className="text-xs text-stone-400 hover:text-stone-700"
                      >
                        Editar
                      </Link>
                      <DeleteIngredientButton id={ing.id} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-12 text-center text-stone-400 text-sm">
            Sin ingredientes.{" "}
            <Link href="/costs/ingredients/new" className="text-stone-600 hover:underline">
              Agrega el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}