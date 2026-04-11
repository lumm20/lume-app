"use client"

import { deleteIngredient } from "@/app/(dashboard)/costs/ingredients/new/actions"
import { Trash2 } from "lucide-react"

export function DeleteIngredientButton({ id }: { id: string }) {
  return (
    <form action={deleteIngredient.bind(null, id)}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("¿Eliminar este ingrediente? Se quitará de todas las recetas que lo usen."))
            e.preventDefault()
        }}
        className="text-stone-300 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-50 transition-colors"
        title="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}