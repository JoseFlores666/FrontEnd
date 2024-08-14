import { z } from "zod";

export const registerTecnicoPageSchema = z.object({
  fecha: z.string().nonempty({ message: "La fecha es obligatoria" }),
  areasoli: z.string().nonempty({ message: "El área del solicitante es obligatoria" }),
  solicita: z.string().nonempty({ message: "El nombre de quien solicita es obligatorio" }),
  edificio: z.string().nonempty({ message: "El nombre del edificio es obligatorio" }),
  tipoDeMantenimiento: z.string().nonempty({ message: "El tipo de mantenimiento es obligatorio" }),
  tipoDeTrabajo: z.string().nonempty({ message: "El tipo de trabajo es obligatorio" }),
  tipoDeSolicitud: z.string().nonempty({ message: "El tipo de solicitud es obligatorio" }),
  descripcion: z.string().nonempty({ message: "Ingrese la descripción del informe" }),
});
