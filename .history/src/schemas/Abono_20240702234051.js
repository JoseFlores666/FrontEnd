
export const abonoSolicitudSchema = z.object({
  folio: z.string().nonempty({ message: "El folio externo es obligatorio" }).optional(),
  folioExterno: z.string().nonempty({ message: "El folio externo es obligatorio" }).optional(),
  items: z.array(
    z.object({
      cantidadEntregada: z.string().nonempty({ message: "La cantidad entregada es obligatoria" }),
      NumEntregas: z.string().nonempty({ message: "La cantidad entregada es obligatoria" }),
    })
  ).min(1, { message: "Debe haber al menos un ítem" }),
});
