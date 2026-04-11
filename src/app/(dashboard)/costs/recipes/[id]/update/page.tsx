import { createClient } from "@/lib/supabase/server"
import { RecipeForm } from "@/components/costs/RecipeForm"
import { updateRecipe } from "@/app/(dashboard)/costs/recipes/new/actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditRecipePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase =await createClient()

  const [{ data: recipe }, { data: ingredients }] = await Promise.all([
    supabase
      .from("recipes")
      .select("*, recipe_ingredients(*, ingredient:ingredients(*))")
      .eq("id", params.id)
      .single(),
    supabase
      .from("ingredients")
      .select("*")
      .order("i_name", { ascending: true }),
  ])

  if (!recipe) notFound()

  return (
    <div className="max-w-2xl">
      <Link
        href="/costs/recipes"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Volver a recetas
      </Link>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Editar receta</h1>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <RecipeForm
          ingredients={ingredients ?? []}
          onSubmit={updateRecipe.bind(null, params.id)}
          defaultValues={recipe}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}