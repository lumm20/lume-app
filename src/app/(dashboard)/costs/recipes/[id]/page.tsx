import { createClient } from "@/lib/supabase/server";
import { formatCurrency, calculateRecipe } from "@/lib/utils";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Recipe, Ingredient, RecipeIngredient } from "@/types/index";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipe } = await supabase
    .from("recipes")
    .select(
      `
      *,
      recipe_ingredients (
        id, quantity, ingredient_id,
        ingredient:ingredients (*)
      )
    `,
    )
    .eq("id", id)
    .single<Recipe>();

  if (!recipe) notFound();

  const items = (
    recipe.recipe_ingredients as (RecipeIngredient & {
      ingredient: Ingredient;
    })[]
  )
    .filter((ri) => ri.ingredient)
    .map((ri) => ({ quantity: ri.quantity, ingredient: ri.ingredient }));

  const result = calculateRecipe(items, recipe.overhead_pct, recipe.margin_pct);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/costs/recipes"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-3 transition-colors group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Volver a recetas
          </Link>
          <h1 className="text-xl font-semibold text-stone-800">
            {recipe.r_name}
          </h1>
          {recipe.notes && (
            <p className="text-sm text-stone-400 mt-0.5">{recipe.notes}</p>
          )}
        </div>
        <Link
          href={`/costs/recipes/${recipe.id}/update`}
          className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-600 hover:border-stone-300 hover:shadow-sm transition-all shrink-0"
        >
          <Pencil size={14} />
          <span className="hidden sm:inline">Editar</span>
        </Link>
      </div>

      {/* Resultado principal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">
            Costo de ingredients
          </p>
          <p className="text-2xl font-semibold text-stone-700 tabular-nums">
            {formatCurrency(result.ingredientsCost)}
          </p>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">
            Con overhead ({recipe.overhead_pct}%)
          </p>
          <p className="text-2xl font-semibold text-stone-700 tabular-nums">
            {formatCurrency(result.totalCost)}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-600 mb-2">
            Precio sugerido ({recipe.margin_pct}% margen)
          </p>
          <p className="text-2xl font-semibold text-amber-700 tabular-nums">
            {formatCurrency(result.sellingPrice)}
          </p>
        </div>
      </div>

      {/* Desglose de ingredients */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-medium text-stone-700">
            Desglose de ingredientes
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
              <th className="text-left px-5 py-3">Ingrediente</th>
              <th className="text-right px-5 py-3">Cantidad usada</th>
              <th className="text-right px-5 py-3">Precio unitario</th>
              <th className="text-right px-5 py-3">Costo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {items.map(({ quantity, ingredient }) => {
              const costoLinea =
                (quantity / ingredient.quantity) * ingredient.price;
              const pricePerUnit = ingredient.price / ingredient.quantity;
              return (
                <tr
                  key={ingredient.id}
                  className="hover:bg-stone-50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-stone-800">
                    {ingredient.i_name}
                  </td>
                  <td className="px-5 py-3.5 text-right text-stone-500 tabular-nums">
                    {quantity} {ingredient.unit}
                  </td>
                  <td className="px-5 py-3.5 text-right text-stone-500 tabular-nums">
                    {formatCurrency(pricePerUnit)}/{ingredient.unit}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-stone-700 tabular-nums">
                    {formatCurrency(costoLinea)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-stone-200 bg-stone-50">
              <td
                colSpan={3}
                className="px-5 py-3 text-sm font-medium text-stone-600 text-right"
              >
                Total ingredientes
              </td>
              <td className="px-5 py-3 text-right font-semibold text-stone-800 tabular-nums">
                {formatCurrency(result.ingredientsCost)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Resumen del cálculo */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
        <h2 className="text-sm font-medium text-stone-700 mb-4">
          Resumen del cálculo
        </h2>
        <Row
          label="Costo de ingredients"
          value={formatCurrency(result.ingredientsCost)}
        />
        <Row
          label={`Overhead ${recipe.overhead_pct}% (tiempo + servicios)`}
          value={formatCurrency(result.totalCost - result.ingredientsCost)}
        />
        <Row
          label="Costo total de producción"
          value={formatCurrency(result.totalCost)}
          bold
        />
        <div className="border-t border-stone-100 pt-3">
          <Row
            label={`Margen de ganancia ${recipe.margin_pct}%`}
            value={formatCurrency(result.sellingPrice - result.totalCost)}
          />
          <Row
            label="Precio de venta sugerido"
            value={formatCurrency(result.sellingPrice)}
            bold
            highlight
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold = false,
  highlight = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-medium text-stone-700" : "text-stone-500"}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          highlight
            ? "text-lg font-bold text-amber-700"
            : bold
              ? "font-semibold text-stone-800"
              : "text-stone-600"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
