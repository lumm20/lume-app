import { z } from "zod"
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types/index"

export const transactionSchema = z.object({
  t_type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Selecciona una categoría"),
  description: z.string().max(200).optional(),
  amount: z
    .number({ error: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0")
    .max(999999.99, "Monto demasiado alto"),
  t_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  notes: z.string().max(500).optional(),
}).refine((data) => {
  const cats =
    data.t_type === "income"
      ? (INCOME_CATEGORIES as readonly string[])
      : (EXPENSE_CATEGORIES as readonly string[])
  return cats.includes(data.category)
}, {
  message: "Categoría inválida para el tipo seleccionado",
  path: ["category"],
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
