import { z } from "zod";

const itemSchema = z.object({
  cantidad: z
    .union([z.string(), z.number()])
    .refine((val) => parseInt(val, 10) >= 0, {
      message: "La cantidad debe ser un número positivo o 0",
    })
    .transform((val) => parseInt(val, 10)),
  unidad: z.string().nonempty({ message: "La unidad es requerida" }),
  descripcion: z.string().nonempty({ message: "Descripción es requerida" }),
});

export const formSchema = z.object({
  items: z.array(itemSchema).min(1, { message: "Debe haber al menos un item" }),
});
