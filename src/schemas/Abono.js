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

export const formSchema = z.object({
  folioExterno: z
    .string()
    .nonempty({ message: "Folio externo es requerido" })
    .optional(),
  observaciones: z
    .string()
    .nonempty({ message: "Las observaciones son requeridas" })
    .optional(),
  items: z
    .array(itemSchema)
    .min(1, { message: "Debe haber al menos un item" })
    .optional(),
});
