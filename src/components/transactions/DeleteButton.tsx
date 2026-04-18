"use client"

import { deleteTransaction } from "@/app/(dashboard)/transactions/actions"
import { Trash2 } from "lucide-react"

export function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteTransaction.bind(null, id)}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("¿Eliminar este movimiento?")) e.preventDefault()
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-50"
        title="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}