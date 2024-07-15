import { z } from "zod";

export const folioExternoSchema = z.object({
  folioExterno: z
    .string()
    .nonempty({ message: "El folio externo es obligatorio" }),
});
