import { z } from "zod";

const itemSchema = z.object({
  cantidadEntregada: z
    .string()
    .nonempty({ message: "Ingrese la cantidad" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0, {
      message: "La cantidad debe ser un número positivo o 0",
    }),
});

export const AbonoSchema = z.object({
 
  items: z
    .array(itemSchema)
});
