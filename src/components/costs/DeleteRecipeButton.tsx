"use client"

import { deleteRecipe } from "@/app/(dashboard)/costs/recipes/new/actions"
import { Trash2 } from "lucide-react"

export function DeleteRecipeButton({ id }: { id: string }) {
  return (
    <form action={deleteRecipe.bind(null, id)}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("¿Eliminar esta receta?")) e.preventDefault()
        }}
        className="text-stone-300 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-50 transition-colors"
        title="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}