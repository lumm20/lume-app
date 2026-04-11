"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ingredientSchema } from "@/lib/validations/ingredient"
import { createClient } from "@/lib/supabase/server"

async function getUser(){
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return {user, supabase}
}

export async function createIngredient(formData: FormData) {
    const { supabase, user } = await getUser()

    const raw = {
        i_name: formData.get("i_name"),
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        unit: formData.get("unit"),
        notes: formData.get("notes") || undefined,
    }

    const parsed = ingredientSchema.safeParse(raw)
    if (!parsed.success) throw new Error(parsed.error.issues[0].message)

    const { error } = await supabase.from("ingredients").insert({
        ...parsed.data,
        user_id: user.id,
    })
    if (error) throw new Error("Error al guardar el ingrediente")

    revalidatePath("/costs/ingredients")
    redirect("/costs/ingredients")
}

export async function updateIngredient(id: string, formData: FormData) {
    const { user, supabase } = await getUser()

    const raw = {
        i_name: formData.get("i_name"),
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        unit: formData.get("unit"),
        notes: formData.get("notes") || undefined,
    }

    const parsed = ingredientSchema.safeParse(raw)
    if (!parsed.success) throw new Error(parsed.error.issues[0].message)

    const { error } = await supabase
        .from("ingredients")
        .update(parsed.data)
        .eq("id", id)
        .eq("user_id", user.id)
    if (error) throw new Error("Error al actualizar el ingrediente")

    revalidatePath("/costs/ingredients")
    redirect("/costs/ingredients")
}

export async function deleteIngredient(id: string) {
    const { supabase, user } = await getUser()

    const { error } = await supabase
        .from("ingredients")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

    if (error) throw new Error("Error al eliminar el ingrediente")

    revalidatePath("/costs/ingredients")
}