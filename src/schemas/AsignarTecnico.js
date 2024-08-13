import { z } from "zod";

export const asignarTecnicoSchema = z.object({
  diagnostico: z.string()
    .min(1, "El diagnóstico es obligatorio")
    .max(500, "El diagnóstico no puede exceder los 500 caracteres"),
});
