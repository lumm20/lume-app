"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { transactionSchema } from "@/lib/validations/transaction"

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  console.log("formdata:",Object.fromEntries(formData.entries()));
  // Parsear y validar con Zod
  const raw = {
    t_type: formData.get("t_type"),
    category: formData.get("category"),
    description: formData.get("description") || undefined,
    amount: Number(formData.get("amount")),
    t_date: formData.get("t_date"),
    notes: formData.get("notes") || undefined,
  }

  const parsed = transactionSchema.safeParse(raw)

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { error } = await supabase.from("transactions").insert({
    ...parsed.data,
    user_id: user.id,
  })

  if (error) throw new Error("Error al guardar el movimiento")

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  revalidatePath("/reports")
  redirect("/transactions")
}

export async function eliminarMovimiento(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error("Error al eliminar")

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  revalidatePath("/reports")
}
