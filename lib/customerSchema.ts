import { z } from "zod";

export const customerSchema = z.object({
  customerName: z
    .string()
    .min(2, "El nombre sebe ser mayor a dos caracteres")
    .max(30, "El nombre no puede exceder de 30 caracteres"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El formato debe ser de email"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
