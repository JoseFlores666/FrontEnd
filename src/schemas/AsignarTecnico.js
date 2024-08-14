import { z } from "zod";

export const asignarTecnicoSchema = z.object({
  tecnico: z
    .string()
    .nonempty({ message: "Asignele un técnico para continuar" }),
});
export const diagnosticoSchema = z.object({
  diagnostico: z
    .string()
    .nonempty({ message: "Agregue su diagnostico técnico para continuar" }),
});
