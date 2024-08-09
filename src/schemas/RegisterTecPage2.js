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
<<<<<<< HEAD
  
=======
  images: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, {
      message: "Debe subir al menos una imagen.",
    })
    .refine(
      (files) =>
        files.every((file) =>
          ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(
            file.type
          )
        ),
      {
        message:
          "Solo se permiten imágenes con extensiones .png, .jpeg, .jpg o .gif",
      }
    ),
>>>>>>> f61e376d83023e0c9d12df59a10976c2ffd15296
  items: z.array(itemSchema).min(1, { message: "Debe haber al menos un item" }),
});
