import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { FlaskConical, ShoppingBasket } from "lucide-react"

export default async function CostosPage() {
  const supabase = await createClient()
  const [{ count: totalIng }, { count: totalRec }] = await Promise.all([
    supabase.from("ingredients").select("*", { count: "exact", head: true }),
    supabase.from("recipes").select("*", { count: "exact", head: true }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Costos</h1>
        <p className="text-sm text-stone-400 mt-0.5">
          Calcula el precio de tus productos automáticamente
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/costs/ingredients"
          className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md hover:border-stone-300 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <ShoppingBasket size={22} />
            </div>
            <div>
              <h2 className="font-medium text-stone-800">Ingredientes</h2>
              <p className="text-sm text-stone-400 mt-0.5">
                {totalIng ?? 0} en el catálogo
              </p>
              <p className="text-xs text-stone-400 mt-2">
                Registra los precios actuales de cada ingrediente. Cuando suban de precio, actualízalos aquí y todos tus precios se recalculan solos.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/costs/recipes"
          className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md hover:border-stone-300 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
              <FlaskConical size={22} />
            </div>
            <div>
              <h2 className="font-medium text-stone-800">Recetas</h2>
              <p className="text-sm text-stone-400 mt-0.5">
                {totalRec ?? 0} productos
              </p>
              <p className="text-xs text-stone-400 mt-2">
                Define los ingredientes de cada producto, tu overhead y margen de ganancia. La app calcula el precio de venta sugerido.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}