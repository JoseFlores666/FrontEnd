import { z } from "zod";

export const firmasSchema = z.object({
  solicitante: z.string(),
  jefeInmediato: z.string(),
  direccion: z.string(),
  rectoria: z.string(),
});
