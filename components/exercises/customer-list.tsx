"use client";

import { useState, useEffect, useDeferredValue } from "react";
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
  Users,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  Mail,
  User,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import type { ExerciseTab, Customer } from "@/lib/types";
import { fetchCustomers, generateId } from "@/lib/mock-data";
import { useFetch } from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormValues, customerSchema } from "@/lib/customerSchema";
import { useForm } from "react-hook-form";

function CustomerListDemo() {
  const {
    data: customers,
    error,
    isLoading,
    isError,
    isSuccess,
    execute,
    cancel,
  } = useFetch<Customer[]>();

  const [currentCustomers, setCurrentCustomers] = useState<Customer[] | null>(
    customers,
  );
  const [searchTerm, setSearchTerm] = useState("");
  // Campos para editar
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const deferredSearch = useDeferredValue(searchTerm.toLowerCase());

  useEffect(() => {
    execute((_signal) => fetchCustomers());
    return () => cancel();
  }, []);

  useEffect(() => {
    if (customers) {
      setCurrentCustomers(customers);
    }
  }, [customers]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      customerName: "",
      email: "",
    },
  });

  const handleDelete = (id: string) => {
    const newCustomers: Customer[] =
      currentCustomers?.filter((cus) => cus.id !== id) ?? [];
    setCurrentCustomers(newCustomers);
  };
  // Funciones edit, cancel y save de edicion
  // Inicia el modo edición para un customer
  const handleEditStart = (customer: Customer) => {
    setEditingId(customer.id);
    setEditName(customer.name);
    setEditEmail(customer.email);
  };

  // Cancela la edición
  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  // Guarda los cambios con .map() (inmutabilidad)
  const handleEditSave = (id: string) => {
    if (!editName.trim() || !editEmail.trim()) return;

    setCurrentCustomers(
      (current) =>
        current?.map((customer) =>
          customer.id === id
            ? { ...customer, name: editName.trim(), email: editEmail.trim() }
            : customer,
        ) ?? [],
    );
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const onSubmit = (data: CustomerFormValues) => {
    const newCustomer: Customer = {
      id: generateId(), //return Date.now().toString(36) + Math.random().toString(36).substr(2);
      name: data.customerName,
      email: data.email,
      createdAt: new Date(),
    };
    setCurrentCustomers((current) => [...(current ?? []), newCustomer]);
  };

  // BUG: Filtrado sensible a mayúsculas/minúsculas
  const filteredCustomers: Customer[] | null | undefined =
    currentCustomers?.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(deferredSearch) ||
        customer.email.toLowerCase().includes(deferredSearch)
      );
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario de agregar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Agregar Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  {...register("customerName")}
                  className={`pl-10 ${errors.customerName ? "border-red-500" : ""}`}
                />
              </div>
              <p
                className={`text-sm flex items-center gap-1 min-h-5 ${errors.customerName ? "text-red-500" : "text-transparent"}`}
              >
                <AlertCircle className="w-3 h-3" />
                {errors.customerName?.message ?? "\u00A0"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  {...register("email")}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              <p
                className={`text-sm flex items-center gap-1 min-h-5 ${errors.email ? "text-red-500" : "text-transparent"}`}
              >
                <AlertCircle className="w-3 h-3" />
                {errors.email?.message ?? "\u00A0"}
              </p>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                disabled={!isValid}
                onClick={handleSubmit(onSubmit)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
              <p className="min-h-5">&nbsp;</p>
            </div>
          </div>
          {isError && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Estadísticas */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {filteredCustomers?.length} de {currentCustomers?.length}{" "}
          clientes
        </span>
      </div>

      {/* Lista de clientes */}
      {isSuccess && (
        <div className="space-y-3">
          {filteredCustomers?.map((customer) => (
            <Card
              key={customer.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                {editingId === customer.id ? (
                  /* Modo edición */
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium">
                        {editName.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="flex-1 grid gap-2 md:grid-cols-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nombre"
                        className="h-8"
                      />
                      <Input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        className="h-8"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSave(customer.id)}
                        className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Modo visualización */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        ID: {customer.id}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStart(customer)}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCustomers?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm
            ? `No se encontraron clientes para "${searchTerm}"`
            : "No hay clientes"}
        </div>
      )}

      {/* Info de bugs */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Bugs a arreglar:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>handleDelete muta el array original (usar .filter())</li>
            <li>La búsqueda es sensible a mayúsculas/minúsculas</li>
            <li>No hay validación de email duplicado</li>
            <li>La validación de email es muy básica</li>
            <li>El componente no está optimizado (re-renders innecesarios)</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Hints para este ejercicio
function CustomerListHints() {
  return (
    <div className="space-y-4">
      <HintCard
        title="useFetch da data de solo lectura — necesitas estado local"
        concept="Sincronizar data del fetch con estado editable"
        description="useFetch retorna data pero no setData. Para CRUD necesitas un useState local que se sincronice con useEffect cuando data cambie."
        seniorTip="useEffect(() => { if (customers) setCurrentCustomers(customers); }, [customers]); — sincroniza solo cuando el fetch termina. Sin esto, tu estado local queda en null."
        difficulty="intermedio"
      />

      <HintCard
        title="?. retorna undefined, no array vacío"
        concept="Optional chaining + nullish coalescing"
        description="currentCustomers?.filter() retorna undefined si currentCustomers es null. TypeScript no te deja asignar undefined a Customer[]. Usa ?? [] como fallback."
        seniorTip="const result: Customer[] = currentCustomers?.filter(...) ?? []; El ?? [] convierte null/undefined en array vacío."
        difficulty="básico"
      />

      <HintCard
        title="Spread de null explota — usa ?? [] en el callback"
        concept="Spread operator necesita un iterable"
        description="[...null, newItem] lanza error porque null no es iterable. Cuando usas el callback form de setState, current puede ser null."
        seniorTip="setCurrentCustomers((current) => [...(current ?? []), newCustomer]); — el (current ?? []) garantiza que siempre haces spread de un array."
        difficulty="básico"
      />

      <HintCard
        title="disabled={isValid} vs disabled={!isValid}"
        concept="La negación importa"
        description="disabled={isValid} deshabilita cuando ES válido (al revés). disabled={!isValid} deshabilita cuando NO es válido. Un ! de diferencia cambia todo el comportamiento."
        seniorTip="Lee el disabled en voz alta: 'deshabilitado cuando NO es válido' = disabled={!isValid}. Si el botón se comporta al revés, revisa la negación."
        difficulty="básico"
      />

      <HintCard
        title=".map() para editar con inmutabilidad"
        concept="Crear nuevo array modificando solo un elemento"
        description=".map() recorre todo el array y retorna uno nuevo. Si el id coincide, retorna el objeto modificado con spread. Si no, retorna el original sin cambios."
        seniorTip="current.map(c => c.id === id ? { ...c, name: newName } : c) — spread copia todo y sobreescribe solo lo que cambió. Inmutable y limpio."
        difficulty="intermedio"
      />

      <HintCard
        title="handleSubmit(onSubmit) valida antes de ejecutar"
        concept="RHF solo llama onSubmit si el form es válido"
        description="Con resolver, handleSubmit ejecuta la validación de Zod primero. Solo si pasa, llama a tu onSubmit con los datos ya validados y tipados."
        seniorTip="onClick={handleSubmit(onSubmit)} en el botón. No necesitas validar manualmente dentro de onSubmit — los datos ya están limpios."
        difficulty="básico"
      />

      <HintCard
        title="Errores que empujan el layout — reserva espacio"
        concept="min-h + text-transparent para espacio fijo"
        description="Si el texto de error aparece/desaparece, empuja los elementos de abajo. Reserva el espacio siempre con min-h-5 y usa text-transparent cuando no hay error."
        seniorTip="El texto siempre está ahí (con &nbsp; como fallback), solo cambia de text-transparent a text-red-500. Así el layout nunca se mueve."
        difficulty="básico"
      />
    </div>
  );
}

// Solución Senior
const SENIOR_SOLUTION = `// ============================================
// SOLUCIÓN: CUSTOMER LIST - CRUD Completo
// ============================================

"use client";

import { useState, useEffect, useDeferredValue } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/use-fetch";
import { fetchCustomers, generateId } from "@/lib/mock-data";
import { customerSchema, CustomerFormValues } from "@/lib/customerSchema";
import type { Customer } from "@/lib/types";

function CustomerListDemo() {
  // ─── DATA FETCHING ───────────────────────────────────
  const {
    data: customers,
    error,
    isLoading,
    isError,
    isSuccess,
    execute,
    cancel,
  } = useFetch<Customer[]>();

  // Estado local editable — useFetch da data de solo lectura (no tiene setData)
  const [currentCustomers, setCurrentCustomers] = useState<Customer[] | null>(customers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const deferredSearch = useDeferredValue(searchTerm.toLowerCase());

  // Fetch inicial con cleanup
  useEffect(() => {
    execute((_signal) => fetchCustomers());
    return () => cancel();
  }, []);

  // Sincronizar data del fetch → estado local
  // Sin esto, currentCustomers queda en null porque useState solo usa el valor inicial una vez
  useEffect(() => {
    if (customers) {
      setCurrentCustomers(customers);
    }
  }, [customers]);

  // ─── FORMULARIO (React Hook Form + Zod) ──────────────
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: { customerName: "", email: "" },
  });

  // ─── CRUD HANDLERS ───────────────────────────────────

  // DELETE: .filter() crea nuevo array sin el elemento (inmutabilidad)
  const handleDelete = (id: string) => {
    // ?? [] porque ?.filter() retorna undefined si currentCustomers es null
    const newCustomers: Customer[] =
      currentCustomers?.filter((cus) => cus.id !== id) ?? [];
    setCurrentCustomers(newCustomers);
  };

  // EDIT START: carga valores actuales en estado temporal
  const handleEditStart = (customer: Customer) => {
    setEditingId(customer.id);
    setEditName(customer.name);
    setEditEmail(customer.email);
  };

  // EDIT CANCEL: limpia estado de edición
  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  // EDIT SAVE: .map() crea nuevo array modificando solo el que coincide
  const handleEditSave = (id: string) => {
    if (!editName.trim() || !editEmail.trim()) return;

    setCurrentCustomers(
      (current) =>
        current?.map((customer) =>
          customer.id === id
            ? { ...customer, name: editName.trim(), email: editEmail.trim() }
            : customer // los demás se retornan sin cambios
        ) ?? [],
    );
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  // CREATE: handleSubmit valida con Zod antes de llamar onSubmit
  const onSubmit = (data: CustomerFormValues) => {
    const newCustomer: Customer = {
      id: generateId(),
      name: data.customerName,
      email: data.email,
      createdAt: new Date(),
    };
    // (current ?? []) porque current puede ser null al inicio
    setCurrentCustomers((current) => [...(current ?? []), newCustomer]);
  };

  // BÚSQUEDA: case-insensitive con useDeferredValue (debounce nativo)
  const filteredCustomers: Customer[] | null | undefined =
    currentCustomers?.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(deferredSearch) ||
        customer.email.toLowerCase().includes(deferredSearch)
      );
    });

  // ─── UI ──────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario de agregar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Agregar Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  {...register("customerName")}
                  className={\`pl-10 \${errors.customerName ? "border-red-500" : ""}\`}
                />
              </div>
              {/* min-h-5 + text-transparent reserva espacio para no mover el layout */}
              <p className={\`text-sm flex items-center gap-1 min-h-5 \${errors.customerName ? "text-red-500" : "text-transparent"}\`}>
                <AlertCircle className="w-3 h-3" />
                {errors.customerName?.message ?? "\\u00A0"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  {...register("email")}
                  className={\`pl-10 \${errors.email ? "border-red-500" : ""}\`}
                />
              </div>
              <p className={\`text-sm flex items-center gap-1 min-h-5 \${errors.email ? "text-red-500" : "text-transparent"}\`}>
                <AlertCircle className="w-3 h-3" />
                {errors.email?.message ?? "\\u00A0"}
              </p>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              {/* disabled={!isValid} — con ! para deshabilitar cuando NO es válido */}
              <Button disabled={!isValid} onClick={handleSubmit(onSubmit)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
              <p className="min-h-5">&nbsp;</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Estadísticas */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {filteredCustomers?.length} de {currentCustomers?.length} clientes
        </span>
      </div>

      {/* Lista de clientes con edición inline */}
      {isSuccess && (
        <div className="space-y-3">
          {filteredCustomers?.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {editingId === customer.id ? (
                  /* Modo edición: inputs + botones guardar/cancelar */
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium">
                        {editName.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="flex-1 grid gap-2 md:grid-cols-2">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nombre" className="h-8" />
                      <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" type="email" className="h-8" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditSave(customer.id)} className="text-green-500 hover:text-green-600 hover:bg-green-500/10">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleEditCancel} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Modo visualización: datos + botones editar/eliminar */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditStart(customer)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(customer.id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {filteredCustomers?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm
            ? \`No se encontraron clientes para "\${searchTerm}"\`
            : "No hay clientes"}
        </div>
      )}
    </div>
  );
}

// ✅ PUNTOS CLAVE:
// 1. useFetch para data + useState local para CRUD (sincronizados con useEffect)
// 2. ?? [] después de ?.filter() y ?.map() para manejar null
// 3. (current ?? []) en el callback de setState para spread seguro
// 4. .filter() para DELETE, .map() + spread para EDIT, [...arr, new] para CREATE
// 5. handleSubmit(onSubmit) valida con Zod antes de ejecutar
// 6. disabled={!isValid} — el ! importa
// 7. min-h-5 + text-transparent para errores que no mueven el layout
// 8. editingId condiciona la UI entre modo edición y visualización`;

function CustomerListSolution() {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-600">
          Esta solución implementa CRUD completo (Create, Read, Update, Delete)
          con inmutabilidad, React Hook Form + Zod, y edición inline.
        </AlertDescription>
      </Alert>

      <CodeBlock
        code={SENIOR_SOLUTION}
        title="customer-list-senior.tsx"
        showRevealButton={true}
      />
    </div>
  );
}

function CustomerListTracking() {
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
                <strong>useFetch</strong> para cargar datos iniciales con
                cleanup
              </li>
              <li>
                <strong>useState local</strong> (<code>currentCustomers</code>)
                para manejar CRUD — useFetch no tiene setData
              </li>
              <li>
                <strong>useEffect de sincronización</strong> — cuando{" "}
                <code>customers</code> (del fetch) cambia, actualiza{" "}
                <code>currentCustomers</code>
              </li>
              <li>
                <strong>React Hook Form + Zod</strong> para validar el
                formulario de agregar
              </li>
              <li>
                <strong>CREATE</strong> con <code>handleSubmit(onSubmit)</code>{" "}
                + spread: <code>[...(current ?? []), newCustomer]</code>
              </li>
              <li>
                <strong>DELETE</strong> con <code>.filter()</code> +{" "}
                <code>?? []</code> para inmutabilidad
              </li>
              <li>
                <strong>EDIT</strong> con <code>.map()</code> + spread:{" "}
                <code>{`{ ...customer, name: editName }`}</code> solo modifica
                el que coincide
              </li>
              <li>
                <strong>UI condicional</strong> con{" "}
                <code>editingId === customer.id</code> para modo edición inline
              </li>
              <li>
                <strong>Errores con espacio reservado</strong> —{" "}
                <code>min-h-5</code> + <code>text-transparent</code> para no
                mover el layout
              </li>
            </ol>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              ¿Por qué se hizo así?
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Estado local separado del fetch</strong> — useFetch es
                de solo lectura. Para CRUD necesitas un estado que puedas mutar
                (agregar/editar/eliminar)
              </li>
              <li>
                <strong>useEffect para sincronizar</strong> — useState solo usa
                el valor inicial una vez. Sin el effect, currentCustomers queda
                en null después del fetch
              </li>
              <li>
                <strong>?? [] en todas partes</strong> — ?.filter() y ?.map()
                retornan undefined si el array es null. TypeScript no te deja
                asignar undefined a Customer[]
              </li>
              <li>
                <strong>(current ?? []) en setState callback</strong> — spread
                de null explota. El fallback a [] lo previene
              </li>
              <li>
                <strong>.map() para editar</strong> — recorre todo, solo
                modifica el que coincide. Inmutable: retorna nuevo array sin
                mutar el original
              </li>
              <li>
                <strong>disabled={`{!isValid}`} con !</strong> — sin el ! se
                deshabilita cuando ES válido (al revés)
              </li>
              <li>
                <strong>handleSubmit(onSubmit)</strong> — RHF valida con Zod
                antes de llamar onSubmit. No necesitas validar manualmente
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase">
              Patrones de inmutabilidad
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <strong>CREATE:</strong> <code>[...array, newItem]</code>
              </div>
              <div className="p-2 bg-muted rounded">
                <strong>DELETE:</strong>{" "}
                <code>array.filter(item =&gt; item.id !== id)</code>
              </div>
              <div className="p-2 bg-muted rounded">
                <strong>UPDATE:</strong>{" "}
                <code>{`array.map(item => item.id === id ? { ...item, changes } : item)`}</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal del ejercicio
export function CustomerListExercise() {
  const [activeTab, setActiveTab] = useState<ExerciseTab>("exercise");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Customer List (CRUD)</CardTitle>
              <CardDescription>
                Implementa operaciones CRUD con inmutabilidad y búsqueda
                optimizada
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ExerciseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            exerciseContent={<CustomerListDemo />}
            hintsContent={<CustomerListHints />}
            solutionContent={<CustomerListSolution />}
            trackingContent={<CustomerListTracking />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
