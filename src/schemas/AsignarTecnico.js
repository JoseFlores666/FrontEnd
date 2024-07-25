import { z } from "zod";

export const asignarTecnicoSchema = z.object({
  observaciones: z.string().min(3, {
    message: "Las observaciones deben tener al menos 3 caracteres",
  }),
  tecnico: z.string().nonempty({
    message: "Selecciona un técnico",
  }),
});
