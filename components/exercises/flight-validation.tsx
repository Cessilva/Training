"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExerciseTabs } from "@/components/exercise-tabs";
import { HintCard } from "@/components/hint-card";
import { CodeBlock } from "@/components/code-block";
import {
  Plane,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  MapPin,
} from "lucide-react";
import type { ExerciseTab } from "@/lib/types";
import { FlightFormValues, flightSchema } from "@/lib/flightSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function FlightForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    mode: "onChange",
    defaultValues: {
      passengerName: "",
      email: "",
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      passengers: 1,
      seatClass: undefined,
    },
  });

  // Validaciones cruzadas en tiempo real usando watch
  const origin = watch("origin");
  const destination = watch("destination");
  const departureDate = watch("departureDate");
  const returnDate = watch("returnDate");

  const crossErrors = useMemo(() => {
    // Para que crossErrors solo se recalcule cuando cambian origin, destination, departureDate o returnDate — no en cada render del componente.
    //Sin useMemo, cada vez que el componente se re-renderiza (por ejemplo al escribir en el campo "nombre"), la función de validación cruzada se ejecutaría de nuevo aunque esos 4 valores no hayan cambiado.
    // Con useMemo, React guarda el resultado anterior y solo lo recalcula si alguna de las dependencias cambió.
    // En este caso la diferencia de performance es mínima (son comparaciones simples), pero es el patrón correcto para estado derivado: si un valor se calcula a partir de otros valores, usa useMemo.
    const result: { destination?: string; returnDate?: string } = {};

    if (
      origin &&
      destination &&
      origin.length === 3 &&
      destination.length === 3 &&
      origin.toUpperCase() === destination.toUpperCase()
    ) {
      result.destination = "El origen y destino no pueden ser iguales";
    }

    if (departureDate && returnDate) {
      const start = new Date(departureDate + "T00:00:00");
      const end = new Date(returnDate + "T00:00:00");
      if (end <= start) {
        result.returnDate =
          "La fecha de regreso debe ser posterior a la de salida";
      }
    }

    return result;
  }, [origin, destination, departureDate, returnDate]);

  const onSubmit = (data: FlightFormValues) => {
    // Bloquear submit si hay errores cruzados
    if (crossErrors.destination || crossErrors.returnDate) return;
    console.log("✅ Form válido:", data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Alert className="bg-green-500/10 border-green-500/20">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-600">
          ¡Vuelo reservado exitosamente!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sección: Datos del Pasajero */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Datos del Pasajero
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="passengerName">
              <User className="w-3 h-3 inline mr-1" />
              Nombre Completo
            </Label>
            <Input
              id="passengerName"
              placeholder="Juan Pérez"
              className={errors.passengerName ? "border-red-500" : ""}
              {...register("passengerName")}
            />
            {errors.passengerName && (
              <p className="text-red-400">{errors.passengerName.message}</p>
            )}
            {/* TODO: Muestra error de passengerName si existe */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="w-3 h-3 inline mr-1" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="juan@email.com"
              className={errors.email ? "border-red-500" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
            {/* TODO: Muestra error de email si existe */}
          </div>
        </div>
      </div>

      {/* Sección: Ruta del Vuelo */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Ruta del Vuelo
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="origin">
              <MapPin className="w-3 h-3 inline mr-1" />
              Origen (código IATA)
            </Label>
            <Input
              id="origin"
              placeholder="SCL"
              maxLength={3}
              className={errors.origin ? "border-red-500" : ""}
              {...register("origin", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />

            {/* TODO: Muestra error de origin si existe */}
            {errors.origin && (
              <p className="text-red-400">{errors.origin.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">
              <MapPin className="w-3 h-3 inline mr-1" />
              Destino (código IATA)
            </Label>
            <Input
              id="destination"
              placeholder="MIA"
              maxLength={3}
              className={
                errors.destination || crossErrors.destination
                  ? "border-red-500"
                  : ""
              }
              {...register("destination", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
            {(errors.destination || crossErrors.destination) && (
              <p className="text-red-400">
                {errors.destination?.message || crossErrors.destination}
              </p>
            )}
            {/* TODO: Muestra error de destination si existe */}
          </div>
        </div>
      </div>

      {/* Sección: Fechas */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Fechas del Viaje
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="departureDate">Fecha de Salida</Label>
            <Input
              id="departureDate"
              type="date"
              className={errors.departureDate ? "border-red-500" : ""}
              {...register("departureDate")}
            />
            {errors.departureDate && (
              <p className="text-red-400">{errors.departureDate.message}</p>
            )}
            {/* TODO: Muestra error de departureDate si existe */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnDate">Fecha de Retorno</Label>
            <Input
              id="returnDate"
              type="date"
              className={
                errors.returnDate || crossErrors.returnDate
                  ? "border-red-500"
                  : ""
              }
              {...register("returnDate")}
            />
            {(errors.returnDate || crossErrors.returnDate) && (
              <p className="text-red-400">
                {errors.returnDate?.message || crossErrors.returnDate}
              </p>
            )}
            {/* TODO: Muestra error de returnDate si existe */}
          </div>
        </div>
      </div>

      {/* Sección: Detalles del Vuelo */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Detalles del Vuelo
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="passengers">Número de Pasajeros</Label>
            <Input
              id="passengers"
              type="number"
              min={1}
              max={9}
              className={errors.passengers ? "border-red-500" : ""}
              {...register("passengers", { valueAsNumber: true })}
              placeholder="1"
            />
            {errors.passengers && (
              <p className="text-red-400">{errors.passengers.message}</p>
            )}
            {/* TODO: Muestra error de passengers si existe */}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seatClass">Clase</Label>
            {/* TODO: Usa un <select> o un componente Select y conéctalo con register('seatClass') */}
            <select
              id="seatClass"
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.seatClass ? "border-red-500" : "border-input"}`}
              {...register("seatClass")}
            >
              <option value="">Selecciona una clase</option>
              <option value="economy">Económica</option>
              <option value="business">Business</option>
              <option value="first">Primera Clase</option>
            </select>
            {/* TODO: Muestra error de seatClass si existe */}
            {errors.seatClass && (
              <p className="text-red-400">{errors.seatClass.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={
            !isValid || !!crossErrors.destination || !!crossErrors.returnDate
          }
        >
          <Plane className="w-4 h-4 mr-2" />
          Reservar Vuelo
        </Button>
        <Button type="button" variant="outline" onClick={() => reset()}>
          Limpiar
        </Button>
      </div>
    </form>
  );
}

// ============================================
// PISTAS
// ============================================

function FlightHints() {
  return (
    <div className="space-y-4">
      <HintCard
        title="Los types NO existen en runtime"
        concept="type vs valor en Zod"
        description="Un type de TypeScript se borra al compilar. z.enum() necesita un VALOR real (un array). No puedes pasar un type a Zod."
        seniorTip="Usa 'as const' en un array y deriva el type: const CLASSES = ['a', 'b'] as const; type Class = (typeof CLASSES)[number];"
        difficulty="intermedio"
      />

      <HintCard
        title="new Date('2026-05-10') usa UTC, no tu zona"
        concept="Timezone en fechas de inputs"
        description="JavaScript parsea strings YYYY-MM-DD como medianoche UTC. En GMT-6 eso es el día anterior a las 18:00. Esto rompe comparaciones con new Date() que usa hora local."
        seniorTip="Agrega 'T00:00:00' al string para forzar parseo en zona local: new Date(date + 'T00:00:00'). O compara strings directamente (YYYY-MM-DD se compara bien alfabéticamente)."
        difficulty="avanzado"
      />

      <HintCard
        title=".refine() retorna true = VÁLIDO"
        concept="La lógica de refine está invertida a lo que esperas"
        description="En .refine(), retornar true significa 'pasa la validación'. Si quieres rechazar fechas pasadas, la condición debe retornar true cuando la fecha es FUTURA: return date >= today."
        seniorTip="Piensa: '¿cuándo es válido?' y esa es tu condición. No pienses en cuándo es inválido."
        difficulty="básico"
      />

      <HintCard
        title="Con resolver, validate en register() se IGNORA"
        concept="zodResolver es el único validador"
        description="Cuando usas resolver: zodResolver(...), React Hook Form ignora completamente las opciones validate que pongas dentro de register(). El resolver es el único responsable."
        seniorTip="Toda validación debe estar en el schema de Zod O manejarse manualmente con watch/useMemo. No mezcles validate de register con resolver."
        difficulty="avanzado"
      />

      <HintCard
        title="Zod NO ejecuta .superRefine() si un campo falla"
        concept="Validaciones cruzadas no corren hasta que todo pase"
        description="Si email está vacío, Zod se detiene en la fase 1 (campos individuales) y NUNCA llega al .superRefine(). Por eso las validaciones cruzadas no aparecen en tiempo real."
        seniorTip="Para validaciones cruzadas en tiempo real: usa watch() + useMemo() en el componente. Zod solo sirve para validaciones cruzadas al momento del submit."
        difficulty="avanzado"
      />

      <HintCard
        title="valueAsNumber en inputs numéricos"
        concept="register('passengers', { valueAsNumber: true })"
        description="Sin valueAsNumber, el input type='number' manda un STRING ('1'). Zod espera un number y falla silenciosamente. Esto puede bloquear que los .refine() se ejecuten."
        seniorTip="Siempre usa { valueAsNumber: true } para inputs type='number'. Sin esto, todo el schema puede fallar sin errores visibles."
        difficulty="intermedio"
      />

      <HintCard
        title="watch + useMemo = validaciones cruzadas en vivo"
        concept="Estado derivado para errores que dependen de múltiples campos"
        description="watch() observa valores en tiempo real. useMemo recalcula solo cuando cambian las dependencias. Juntos reemplazan a .superRefine() para feedback inmediato."
        seniorTip="Crea un objeto crossErrors con useMemo. Combínalo con errors de RHF en el JSX y en el disabled del botón. Bloquea también el onSubmit como segunda barrera."
        difficulty="intermedio"
      />
    </div>
  );
}

// ============================================
// SOLUCIÓN SENIOR
// ============================================

const SENIOR_SOLUTION = `'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ✅ Schema de Zod — validaciones individuales por campo
const flightSchema = z.object({
  passengerName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(30, 'El nombre no puede exceder 30 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  origin: z
    .string()
    .min(3, 'Código IATA requerido (3 letras)')
    .max(3, 'Código IATA debe ser de 3 letras')
    .toUpperCase(),
  destination: z
    .string()
    .min(3, 'Código IATA requerido (3 letras)')
    .max(3, 'Código IATA debe ser de 3 letras')
    .toUpperCase(),
  departureDate: z
    .string()
    .min(1, 'La fecha de salida es requerida')
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(date + 'T00:00:00') >= today;
    }, 'No se pueden escoger fechas pasadas'),
  returnDate: z
    .string()
    .min(1, 'La fecha de regreso es requerida'),
  passengers: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(1, 'Mínimo 1 pasajero')
    .max(9, 'Máximo 9 pasajeros'),
  seatClass: z.enum(['economy', 'business', 'first'], {
    errorMap: () => ({ message: 'Selecciona una clase válida' }),
  }),
});

type FlightFormValues = z.infer<typeof flightSchema>;

function FlightForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    mode: 'onChange',
    defaultValues: {
      passengerName: '',
      email: '',
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      seatClass: undefined,
    },
  });

  // ✅ Validaciones cruzadas en tiempo real con watch + useMemo
  // Zod no ejecuta .refine()/.superRefine() hasta que TODOS los campos
  // base pasen, por eso las validaciones cruzadas se manejan aparte.
  const origin = watch('origin');
  const destination = watch('destination');
  const departureDate = watch('departureDate');
  const returnDate = watch('returnDate');

  const crossErrors = useMemo(() => {
    const result: { destination?: string; returnDate?: string } = {};

    if (
      origin && destination &&
      origin.length === 3 && destination.length === 3 &&
      origin.toUpperCase() === destination.toUpperCase()
    ) {
      result.destination = 'El origen y destino no pueden ser iguales';
    }

    if (departureDate && returnDate) {
      const start = new Date(departureDate + 'T00:00:00');
      const end = new Date(returnDate + 'T00:00:00');
      if (end <= start) {
        result.returnDate = 'La fecha de regreso debe ser posterior a la de salida';
      }
    }

    return result;
  }, [origin, destination, departureDate, returnDate]);

  const onSubmit = (data: FlightFormValues) => {
    if (crossErrors.destination || crossErrors.returnDate) return;
    console.log('✅ Form válido:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return <div>¡Vuelo reservado exitosamente!</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Cada input usa {...register('campo')} para conectarse */}
      <div>
        <label htmlFor="passengerName">Nombre</label>
        <input
          id="passengerName"
          className={errors.passengerName ? 'border-red-500' : ''}
          {...register('passengerName')}
        />
        {errors.passengerName && <p>{errors.passengerName.message}</p>}
      </div>

      <div>
        <label htmlFor="origin">Origen</label>
        <input
          id="origin"
          maxLength={3}
          className={errors.origin ? 'border-red-500' : ''}
          {...register('origin', {
            onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
          })}
        />
        {errors.origin && <p>{errors.origin.message}</p>}
      </div>

      <div>
        <label htmlFor="destination">Destino</label>
        <input
          id="destination"
          maxLength={3}
          className={errors.destination || crossErrors.destination ? 'border-red-500' : ''}
          {...register('destination', {
            onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
          })}
        />
        {/* ✅ Combina errores de Zod + errores cruzados */}
        {(errors.destination || crossErrors.destination) && (
          <p>{errors.destination?.message || crossErrors.destination}</p>
        )}
      </div>

      <div>
        <label htmlFor="returnDate">Retorno</label>
        <input
          id="returnDate"
          type="date"
          className={errors.returnDate || crossErrors.returnDate ? 'border-red-500' : ''}
          {...register('returnDate')}
        />
        {(errors.returnDate || crossErrors.returnDate) && (
          <p>{errors.returnDate?.message || crossErrors.returnDate}</p>
        )}
      </div>

      <div>
        <label htmlFor="passengers">Pasajeros</label>
        <input
          id="passengers"
          type="number"
          {...register('passengers', { valueAsNumber: true })}
        />
        {errors.passengers && <p>{errors.passengers.message}</p>}
      </div>

      {/* ✅ Botón deshabilitado con isValid + crossErrors */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!isValid || !!crossErrors.destination || !!crossErrors.returnDate}
        >
          Reservar Vuelo
        </button>
        <button type="button" onClick={() => reset()}>
          Limpiar
        </button>
      </div>
    </form>
  );
}

// ✅ PUNTOS CLAVE:
// 1. Zod para validaciones individuales (formato, largo, requerido)
// 2. watch + useMemo para validaciones cruzadas en tiempo real
// 3. mode: 'onChange' para feedback inmediato
// 4. register() con onChange custom para transformar valores (toUpperCase)
// 5. valueAsNumber para inputs numéricos
// 6. Combinar errors (Zod) + crossErrors (manual) en el JSX
// 7. disabled considera ambas fuentes de error
// 8. reset() para limpiar el formulario completo
// 9. Bloquear onSubmit como segunda barrera si hay crossErrors`;

function FlightSolution() {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-600">
          Esta solución usa React Hook Form + Zod para validaciones
          individuales, y watch + useMemo para validaciones cruzadas en tiempo
          real (origin ≠ destination, fechas).
        </AlertDescription>
      </Alert>

      <CodeBlock
        code={SENIOR_SOLUTION}
        title="flight-validation-senior.tsx"
        showRevealButton={true}
      />
    </div>
  );
}

function FlightTracking() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tracking del Ejercicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              Pasos realizados
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                <strong>Crear schema de Zod</strong> en archivo separado (
                <code>lib/flightSchema.ts</code>) — validaciones individuales
                por campo (min, max, email, enum, refine para fechas)
              </li>
              <li>
                <strong>Configurar useForm</strong> con <code>zodResolver</code>{" "}
                y <code>mode: &quot;onChange&quot;</code> para validación
                reactiva
              </li>
              <li>
                <strong>Conectar inputs</strong> con{" "}
                <code>{`{...register("campo")}`}</code> — spread pattern
              </li>
              <li>
                <strong>Mostrar errores</strong> con{" "}
                <code>errors.campo?.message</code> y borde rojo condicional
              </li>
              <li>
                <strong>Validaciones cruzadas</strong> con <code>watch</code> +{" "}
                <code>useMemo</code> (porque Zod no ejecuta superRefine si algún
                campo falla)
              </li>
              <li>
                <strong>Botón disabled</strong> combinando{" "}
                <code>!isValid || !!crossErrors</code>
              </li>
              <li>
                <strong>Reset</strong> con <code>reset()</code> de RHF
              </li>
              <li>
                <strong>onChange custom</strong> en register para toUpperCase en
                origin/destination
              </li>
            </ol>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              ¿Por qué se hizo así?
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Zod + RHF</strong> — stack estándar de la industria para
                formularios tipados
              </li>
              <li>
                <strong>Schema separado</strong> — reutilizable en
                backend/tests, componente queda limpio
              </li>
              <li>
                <strong>watch + useMemo</strong> — Zod no corre
                refine/superRefine hasta que TODOS los campos pasen. Para
                feedback inmediato en cruzadas, se necesita lógica manual
              </li>
              <li>
                <strong>mode onChange</strong> — feedback inmediato al usuario,
                no solo al submit
              </li>
              <li>
                <strong>T00:00:00 en fechas</strong> — sin esto, new
                Date(&quot;YYYY-MM-DD&quot;) se parsea como UTC y en GMT-6
                parece el día anterior
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              Herramientas usadas
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-muted rounded text-xs">
                react-hook-form
              </span>
              <span className="px-2 py-1 bg-muted rounded text-xs">
                @hookform/resolvers/zod
              </span>
              <span className="px-2 py-1 bg-muted rounded text-xs">zod</span>
              <span className="px-2 py-1 bg-muted rounded text-xs">
                useMemo
              </span>
              <span className="px-2 py-1 bg-muted rounded text-xs">watch</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function FlightValidationExercise() {
  const [activeTab, setActiveTab] = useState<ExerciseTab>("exercise");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Flight Booking Form</CardTitle>
              <CardDescription>
                Implementa un formulario de reserva de vuelos usando React Hook
                Form + Zod
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ExerciseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            exerciseContent={<FlightForm />}
            hintsContent={<FlightHints />}
            solutionContent={<FlightSolution />}
            trackingContent={<FlightTracking />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
