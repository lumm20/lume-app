"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { transactionSchema } from "@/lib/validations/transaction"
import { getUser } from "@/lib/utils"

export async function createTransaction(formData: FormData) {
  const {user, supabase} = await getUser()

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

export async function deleteTransaction(id: string) {
  const {user, supabase} = await getUser()

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

export async function updateTransaction(id: string, formData: FormData) {
  const { user, supabase } = await getUser()

  const { data: transaction } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!transaction) throw new Error("Movimiento no encontrado")
  
  const raw = {
    t_type: formData.get("t_type") ?? transaction.t_type,
    category: formData.get("category") ?? transaction.category,
    description: formData.get("description") ?? transaction.description,
    amount: Number(formData.get("amount")) ?? transaction.amount,
    t_date: formData.get("t_date") ?? transaction.t_date,
    notes: formData.get("notes") ?? transaction.notes,
  }

  const parsed = transactionSchema.safeParse(raw)

  if(!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error("Error al actualizar el movimiento")

  revalidatePath("/transactions")
  revalidatePath("/dashboard")
  revalidatePath("/reports")
}
