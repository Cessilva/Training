import { z } from "zod";

export const flightSchema = z.object({
  passengerName: z
    .string()
    .min(2, "El nombre sebe ser mayor a dos caracteres")
    .max(30, "El nombre no puede exceder de 30 caracteres"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El formato debe ser de email"),
  origin: z
    .string()
    .min(3, "Código IATA requerido (3 letras)")
    .max(3, "Código IATA debe ser de 3 letras")
    .toUpperCase(),
  destination: z
    .string()
    .min(3, "Código IATA requerido (3 letras)")
    .max(3, "Código IATA debe ser de 3 letras")
    .toUpperCase(),
  departureDate: z
    .string()
    .min(1, "La fecha de salida debe ser requerida")
    .refine((date) => {
      const today = new Date(); //hora actual en tu zona local (GMT-6)
      today.setHours(0, 0, 0, 0); // lo pone a medianoche local
      return new Date(date + "T00:00:00") >= today;
    }, "No se pueden escoger fechas pasadas"),
  returnDate: z.string().min(1, "La fecha de regreso debe ser requerida"),
  passengers: z
    .number({ invalid_type_error: "Debe ser un número" })
    .min(1, "Mínimo 1 pasajero")
    .max(9, "Máximo 9 pasajeros"),
  seatClass: z.enum(["economy", "business", "first"], {
    errorMap: () => ({ message: "Selecciona una clase válida" }),
  }),
});

export type FlightFormValues = z.infer<typeof flightSchema>;
