import { z } from "zod"

export const recipeIngredientSchema = z.object({
  ingredient_id: z.string().min(1, "Selecciona un ingrediente"),
  quantity: z.number({ error: "Ingresa una cantidad válida" })
             .positive("La cantidad debe ser mayor a 0"),
})

export const recipeSchema = z.object({
  r_name:       z.string().min(1, "El nombre es requerido").max(100),
  overhead_pct: z.number({ error: "Ingresa un porcentaje válido" })
                 .min(0).max(999),
  margin_pct:   z.number({ error: "Ingresa un porcentaje válido" })
                 .min(0).max(999),
  notes:        z.string().max(300).optional(),
  ingredients: z.array(recipeIngredientSchema)
                 .min(1, "Agrega al menos un ingrediente"),
})

export type RecipeFormValues = z.infer<typeof recipeSchema>