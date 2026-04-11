import { z } from "zod"
import { UNIDADES } from "@/types/index"

export const ingredientSchema = z.object({
  i_name:   z.string().min(1, "El nombre es requerido").max(100),
  price:   z.number({ error: "Ingresa un precio válido" })
             .positive("El precio debe ser mayor a 0")
             .max(99999.99),
  quantity: z.number({ error: "Ingresa una cantidad válida" })
             .positive("La cantidad debe ser mayor a 0")
             .max(99999.999),
  unit:   z.enum(
              UNIDADES.map((u) => u.value) as [string, ...string[]],
              { error: () => ({ message: "Selecciona una unidad" }) }
            ),
  notes:    z.string().max(300).optional(),
})

export type IngredientFormValues = z.infer<typeof ingredientSchema>