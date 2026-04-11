import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatCurrency, calculateRecipe } from "@/lib/utils"
import { DeleteRecipeButton } from "@/components/costs/DeleteRecipeButton"
import { Plus } from "lucide-react"
import type { Recipe, RecipeIngredient, Ingredient } from "@/types/index"

export default async function RecipesPage() {
  const supabase = await createClient()
  const { data: recipes } = await supabase
    .from("recipes")
    .select(`
      *,
      recipe_ingredients (
        id, quantity, ingredient_id,
        ingredient:ingredients (*)
      )
    `)
    .order("r_name", { ascending: true })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Recipes</h1>
          <p className="text-sm text-stone-400 mt-0.5">{recipes?.length ?? 0} productos</p>
        </div>
        <Link
          href="/costs/recipes/new"
          className="flex items-center gap-2 rounded-xl bg-stone-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nueva</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe: Recipe) => {
            const items = (recipe.recipe_ingredients as (RecipeIngredient & { ingredient: Ingredient })[])
              .filter((ri) => ri.ingredient)
              .map((ri) => ({ quantity: ri.quantity, ingredient: ri.ingredient }))

            const result= calculateRecipe(items, recipe.overhead_pct, recipe.margin_pct)

            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div>
                  <h2 className="font-medium text-stone-800">{recipe.r_name}</h2>
                  {recipe.notes && (
                    <p className="text-xs text-stone-400 mt-0.5">{recipe.notes}</p>
                  )}
                </div>

                <div className="space-y-1.5 text-sm flex-1">
                  <div className="flex justify-between text-stone-500">
                    <span>Costo ingredientes</span>
                    <span className="tabular-nums">{formatCurrency(result.ingredientsCost)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Con overhead ({recipe.overhead_pct}%)</span>
                    <span className="tabular-nums">{formatCurrency(result.totalCost)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-amber-700 border-t border-stone-100 pt-1.5">
                    <span>Precio sugerido</span>
                    <span className="tabular-nums">{formatCurrency(result.sellingPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                  <p className="text-xs text-stone-400">
                    {recipe.recipe_ingredients?.length} ingredientes · margen {recipe.margin_pct}%
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/costs/recipes/${recipe.id}/update`}
                      className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
                    >
                      Editar
                    </Link>
                    <DeleteRecipeButton id={recipe.id} />
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-400 text-sm">Sin recetas todavía.</p>
            <Link
              href="/costs/recipes/new"
              className="mt-3 inline-block text-sm text-stone-600 hover:underline"
            >
              Crea la primera
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}