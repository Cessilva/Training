'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExerciseTabs } from '@/components/exercise-tabs';
import { HintCard } from '@/components/hint-card';
import { CodeBlock } from '@/components/code-block';
import { 
  Users, Search, Plus, Trash2, AlertCircle, 
  Mail, User, Loader2
} from 'lucide-react';
import type { ExerciseTab, Customer } from '@/lib/types';
import { fetchCustomers, generateId } from '@/lib/mock-data';

// ============================================
// CÓDIGO INCOMPLETO - VERSIÓN "SUCIA" PARA ARREGLAR
// ============================================

function CustomerListDemo() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch {
      console.error('Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  // BUG: Esta función muta el array original
  const handleDelete = (id: string) => {
    // ❌ INCORRECTO: Esto podría causar bugs sutiles
    // BUG: Algunos devs hacen: customers.splice(index, 1)
    // TODO: Implementar con .filter() para inmutabilidad
    
    const index = customers.findIndex(c => c.id === id);
    if (index > -1) {
      // BUG: Mutación directa del array
      const newCustomers = customers;
      newCustomers.splice(index, 1);
      setCustomers(newCustomers);
    }
  };

  // BUG: Esta función no usa spread operator correctamente
  const handleAdd = () => {
    setFormError('');
    
    // Validación básica
    if (!newName.trim() || !newEmail.trim()) {
      setFormError('Todos los campos son requeridos');
      return;
    }

    // BUG: Validación de email muy básica
    if (!newEmail.includes('@')) {
      setFormError('Email inválido');
      return;
    }

    // BUG: No verifica duplicados de email
    
    const newCustomer: Customer = {
      id: generateId(),
      name: newName,
      email: newEmail,
      createdAt: new Date(),
    };

    // BUG: Esto podría hacerse mal así: customers.push(newCustomer)
    // TODO: Usar spread operator correctamente
    setCustomers([...customers, newCustomer]);
    
    // Limpiar form
    setNewName('');
    setNewEmail('');
  };

  // BUG: Filtrado sensible a mayúsculas/minúsculas
  const filteredCustomers = customers.filter(customer => {
    // TODO: Hacer case-insensitive
    // TODO: Buscar en nombre Y email
    return customer.name.includes(searchTerm) || customer.email.includes(searchTerm);
  });

  if (loading) {
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
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
          {formError && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formError}
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
        <span>Mostrando {filteredCustomers.length} de {customers.length} clientes</span>
      </div>

      {/* Lista de clientes */}
      <div className="space-y-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
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
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    ID: {customer.id}
                  </span>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? `No se encontraron clientes para "${searchTerm}"` : 'No hay clientes'}
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
        title="Inmutabilidad con .filter()"
        concept="Array.prototype.filter() + Reference Equality"
        description="React detecta cambios comparando referencias. Si mutas el array original, React no detectará el cambio porque la referencia es la misma. .filter() crea un nuevo array."
        seniorTip="const newCustomers = customers.filter(c => c.id !== idToDelete); Esto crea un nuevo array sin el elemento, manteniendo inmutabilidad."
        difficulty="básico"
      />
      
      <HintCard
        title="Spread Operator para Agregar"
        concept="Array Spread + Inmutabilidad"
        description="El spread operator [...array, newItem] crea un nuevo array con todos los elementos existentes más el nuevo. Esto es más limpio que concat y mantiene inmutabilidad."
        seniorTip="setCustomers(prev => [...prev, newCustomer]); Usa el callback form de setState para garantizar que usas el estado más reciente."
        difficulty="básico"
      />
      
      <HintCard
        title="Búsqueda Case-Insensitive"
        concept="String.toLowerCase() + Normalización"
        description="Para búsqueda robusta, convierte tanto el término como los datos a minúsculas. Un Senior también considera normalizar acentos y caracteres especiales."
        seniorTip="const matches = (field: string) => field.toLowerCase().includes(term.toLowerCase()). Aplica a todos los campos buscables."
        difficulty="básico"
      />
      
      <HintCard
        title="Validación de Email con Regex"
        concept="Regular Expressions + Validation Patterns"
        description="Una validación básica de email usa regex. Sin embargo, la mejor validación de email es enviar un correo de confirmación."
        seniorTip="const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/; Es simple pero efectivo para validación client-side básica."
        difficulty="intermedio"
      />
      
      <HintCard
        title="Optimización con useCallback y useMemo"
        concept="Memoization + Stable References"
        description="handleDelete y handleAdd se recrean en cada render, causando re-renders innecesarios de los hijos. useCallback las estabiliza."
        seniorTip="Usa useCallback para handlers y useMemo para filteredCustomers. Considera React.memo() para el componente de cada cliente."
        difficulty="avanzado"
      />
    </div>
  );
}

// Solución Senior
const SENIOR_SOLUTION = `'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Customer } from '@/lib/types';

// ✅ SENIOR: Regex de validación de email
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

// ✅ SENIOR: Función de normalización para búsqueda
const normalizeSearch = (str: string): string => {
  return str.toLowerCase().trim();
};

function CustomerListDemo() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [formError, setFormError] = useState('');

  // ✅ SENIOR: useCallback para handlers estables
  const handleDelete = useCallback((id: string) => {
    // ✅ SENIOR: .filter() retorna un NUEVO array (inmutabilidad)
    // Esto garantiza que React detecte el cambio de estado
    setCustomers(prevCustomers => 
      prevCustomers.filter(customer => customer.id !== id)
    );
  }, []);

  // ✅ SENIOR: Validación robusta antes de agregar
  const validateForm = useCallback((): string | null => {
    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim();

    if (!trimmedName) {
      return 'El nombre es requerido';
    }

    if (trimmedName.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }

    if (!trimmedEmail) {
      return 'El email es requerido';
    }

    // ✅ SENIOR: Validación con regex
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return 'El formato del email no es válido';
    }

    return null;
  }, [newName, newEmail]);

  // ✅ SENIOR: Verificar duplicados de forma memoizada
  const isDuplicateEmail = useCallback((email: string): boolean => {
    const normalizedEmail = normalizeSearch(email);
    return customers.some(c => 
      normalizeSearch(c.email) === normalizedEmail
    );
  }, [customers]);

  const handleAdd = useCallback(() => {
    setFormError('');

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const trimmedEmail = newEmail.trim();

    // ✅ SENIOR: Verificar email duplicado
    if (isDuplicateEmail(trimmedEmail)) {
      setFormError('Este email ya está registrado');
      return;
    }

    const newCustomer: Customer = {
      id: crypto.randomUUID(), // ✅ SENIOR: UUID criptográficamente seguro
      name: newName.trim(),
      email: trimmedEmail,
      createdAt: new Date(),
    };

    // ✅ SENIOR: Spread operator para inmutabilidad
    // Usa callback form para garantizar estado actualizado
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);

    // Limpiar formulario
    setNewName('');
    setNewEmail('');
  }, [newName, newEmail, validateForm, isDuplicateEmail]);

  // ✅ SENIOR: Filtrado memoizado y case-insensitive
  const filteredCustomers = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchTerm);

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter(customer => {
      // ✅ SENIOR: Buscar en múltiples campos
      const searchableText = normalizeSearch(
        \`\${customer.name} \${customer.email}\`
      );
      return searchableText.includes(normalizedSearch);
    });
  }, [customers, searchTerm]);

  return (
    // ... JSX con componentes optimizados
  );
}

// ✅ SENIOR: Componente de cliente memoizado para evitar re-renders
const CustomerCard = React.memo(function CustomerCard({ 
  customer, 
  onDelete 
}: { 
  customer: Customer; 
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      {/* ... contenido del cliente */}
      <Button onClick={() => onDelete(customer.id)}>
        <Trash2 />
      </Button>
    </Card>
  );
});

// ✅ PUNTOS CLAVE DE LA SOLUCIÓN SENIOR:
//
// 1. INMUTABILIDAD: .filter() y spread operator crean nuevos arrays
// 2. useCallback: Handlers estables que no causan re-renders
// 3. useMemo: Filtrado que solo recalcula cuando cambian las deps
// 4. React.memo: Componentes hijos que no re-renderizan innecesariamente
// 5. VALIDACIÓN: Regex para email, verificación de duplicados
// 6. NORMALIZACIÓN: Búsqueda case-insensitive en múltiples campos
// 7. crypto.randomUUID(): IDs seguros en lugar de Date.now()`;

function CustomerListSolution() {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-600">
          Esta solución demuestra inmutabilidad estricta, optimización con memoización, y validación robusta.
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

// Componente principal del ejercicio
export function CustomerListExercise() {
  const [activeTab, setActiveTab] = useState<ExerciseTab>('exercise');

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
                Implementa operaciones CRUD con inmutabilidad y búsqueda optimizada
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
          />
        </CardContent>
      </Card>
    </div>
  );
}
