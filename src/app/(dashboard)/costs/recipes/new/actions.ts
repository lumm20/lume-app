"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { recipeSchema } from "@/lib/validations/recipe"

async function getUser(){
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return {user, supabase}
}

export async function createRecipe(data: {
  r_name: string
  overhead_pct: number
  margin_pct: number
  notes?: string
  ingredients: { ingredient_id: string; quantity: number }[]
}) {
  const {supabase, user} = await getUser()

  const parsed = recipeSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      r_name:       parsed.data.r_name,
      overhead_pct: parsed.data.overhead_pct,
      margin_pct:   parsed.data.margin_pct,
      notes:        parsed.data.notes,
      user_id:      user.id,
    })
    .select("id")
    .single()

  if (error || !recipe) throw new Error("Error al guardar la receta")

  const ingredientRows = parsed.data.ingredients.map((i) => ({
    recipe_id:      recipe.id,
    ingredient_id: i.ingredient_id,
    quantity:       i.quantity,
  }))

  const { error: ingError } = await supabase
    .from("recipe_ingredients")
    .insert(ingredientRows)

  if (ingError) throw new Error("Error al guardar los ingredientes")

  revalidatePath("/costs/recipes")
  revalidatePath("/costs")
  redirect("/costs/recipes")
}

export async function updateRecipe(
  id: string,
  data: {
    r_name: string
    overhead_pct: number
    margin_pct: number
    notes?: string
    ingredients: { ingredient_id: string; quantity: number }[]
  }
) {
  const {supabase, user} = await getUser()

  const parsed = recipeSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const { error } = await supabase
    .from("recetas")
    .update({
      r_name:       parsed.data.r_name,
      overhead_pct: parsed.data.overhead_pct,
      margin_pct:   parsed.data.margin_pct,
      notes:        parsed.data.notes,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error("Error al actualizar la receta")

  await supabase.from("recipe_ingredients").delete().eq("recipe_id", id)

  const ingredientRows = parsed.data.ingredients.map((i) => ({
    recipe_id:      id,
    ingredient_id: i.ingredient_id,
    quantity:       i.quantity,
  }))

  const { error: ingError } = await supabase
    .from("recipe_ingredients")
    .insert(ingredientRows)

  if (ingError) throw new Error("Error al actualizar los ingredientes")

  revalidatePath("/costs/recipes")
  revalidatePath(`/costs/recipes/${id}`)
  redirect("/costs/recipes")
}

export async function deleteRecipe(id: string) {
  const {supabase, user} = await getUser()

  await supabase.from("recipes").delete().eq("id", id).eq("user_id", user.id)

  revalidatePath("/costs/recipes")
  revalidatePath("/costs")
}