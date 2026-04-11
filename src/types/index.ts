export type TransactionType = "income" | "expense"

export const INCOME_CATEGORIES = [
  "Pasteles",
  "Galletas",
  "Roles de canela",
  "Cupcakes",
  "Otros postres",
] as const

export const EXPENSE_CATEGORIES = [
  "Ingredientes",
  "Empaque",
  "Equipo",
  "Envíos",
  "Otros gastos",
] as const

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type Category = IncomeCategory | ExpenseCategory

export interface Transaction {
  id: string
  user_id: string
  t_type: TransactionType
  category: Category
  description: string | null
  amount: number
  t_date: string // ISO date: "2025-03-15"
  notes: string | null
  created_at: string
}

export interface TransactionInput {
  t_type: TransactionType
  category: Category
  description?: string
  amount: number
  t_date: string
  notes?: string
}

export interface MonthtlySummary {
  income: number
  expenses: number
  profits: number
  totalTransactions: number
}

export type Unit = "g" | "kg" | "ml" | "l" | "pza"

export const UNIDADES: { value: Unit; label: string }[] = [
  { value: "g",   label: "Gramos (g)"    },
  { value: "kg",  label: "Kilogramos (kg)" },
  { value: "ml",  label: "Mililitros (ml)" },
  { value: "l",   label: "Litros (l)"    },
  { value: "pza", label: "Piezas (pza)"  },
]

export interface Ingredient {
  id: string
  user_id: string
  i_name: string
  price: number
  quantity: number
  unit: Unit
  notes: string | null
  created_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  ingredient?: Ingredient
}

export interface Recipe {
  id: string
  user_id: string
  r_name: string
  overhead_pct: number
  margin_pct: number
  notes: string | null
  created_at: string
  recipe_ingredients?: RecipeIngredient[]
}

export interface RecipeResult {
  ingredientsCost: number
  totalCost: number
  sellingPrice: number
}
