import { IngredientForm } from "@/components/costs/IngredientForm"
import { createIngredient } from "./actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewIngredientPage() {
  return (
    <div className="max-w-lg">
      <Link
        href="/costs/ingredients"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Volver a ingredientes
      </Link>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Nuevo ingrediente</h1>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <IngredientForm onSubmit={createIngredient} />
      </div>
    </div>
  )
}