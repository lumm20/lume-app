import { createClient } from "@/lib/supabase/server"
import { IngredientForm } from "@/components/costs/IngredientForm"
import { updateIngredient } from "@/app/(dashboard)/costs/ingredients/new/actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditIngredientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: ingredient } = await supabase
    .from("ingredients")
    .select("*")
    .eq("id", id)
    .single()

  console.log(ingredient)
  if (!ingredient) notFound()

  return (
    <div className="max-w-lg">
      <Link
        href="/costs/ingredients"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Volver a ingredientes
      </Link>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Editar ingrediente</h1>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <IngredientForm
          onSubmit={updateIngredient.bind(null, id)}
          defaultValues={ingredient}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}