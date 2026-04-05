// types/index.ts

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
