import { z } from "zod";

const itemSchema = z.object({
  cantidad: z
    .string()
    .nonempty({ message: "La cantidad es obligatoria" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0, {
      message: "La cantidad debe ser un número positivo o 0",
    }),
  descripcion: z.string().nonempty({ message: "Descripción es requerida" }),
});

export const formSchema = z.object({
  folioExterno: z.string().nonempty({ message: "Folio externo es requerido" }),
  observaciones: z
    .string()
    .nonempty({ message: "Las observaciones son requeridas" }),
  items: z.array(itemSchema).min(1, { message: "Debe haber al menos un item" }),
});
