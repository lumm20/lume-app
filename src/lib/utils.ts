import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Ingredient, RecipeResult } from "../types"
import { createClient } from "./supabase/server"
import { redirect } from "next/navigation"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function getCurrentMonthRange(): { from: string; to: string } {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0]
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]
  return { from, to }
}

export function calculateRecipe(
  ingredients: { quantity: number; ingredient: Ingredient }[],
  overheadPct: number,
  marginPct: number
): RecipeResult {
  const ingredientsCost = ingredients.reduce((sum, item) => {
    const costPerUnit = item.ingredient.price / item.ingredient.quantity
    return sum + costPerUnit * item.quantity
  }, 0)

  const totalCost = ingredientsCost * (1 + overheadPct / 100)
  const sellingPrice = totalCost * (1 + marginPct / 100)

  return { ingredientsCost, totalCost, sellingPrice }
}

export async function getUser(){
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return {user, supabase}
}
