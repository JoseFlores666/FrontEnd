import { z } from "zod";

export const registerSoliSchema = z.object({
  folioInterno: z.string().optional(),
  proyecto: z.string().nonempty({ message: "El proyecto es obligatorio" }),
  suministro: z.string().nonempty({ message: "El suministro es obligatorio" }),
  pc: z.string().nonempty({ message: "El proceso clave es obligatorio" }),
  actividad: z.string().nonempty({ message: "La actividad es obligatoria" }),
  justificacion: z.string().nonempty({ message: "La justificación es obligatoria" }),
  items: z.array(
    z.object({
      cantidad: z.string().nonempty({ message: "La cantidad es obligatoria" }),
      unidad: z.string().nonempty({ message: "La unidad es obligatoria" }),
      descripcion: z.string().nonempty({ message: "La descripción es obligatoria" }),
    })
  ).min(1, { message: "Debe haber al menos un ítem" }),
});