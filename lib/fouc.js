const themeScript = `
  (function() {
    /**
     * PASO 1: Obtener la preferencia guardada
     * Intentamos leer del localStorage qué tema eligió el usuario en su última visita.
     */
    function getTheme() {
      try {
        const stored = localStorage.getItem('theme-preference');
        // Validamos que lo que haya en el storage sea una de nuestras opciones válidas
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          return stored;
        }
      } catch (e) {
        // Si el localStorage está bloqueado (por privacidad o error), no rompemos la app
      }
      // Si no hay nada guardado, por defecto usamos la configuración del sistema
      return 'system';
    }
    
    /**
     * PASO 2: Resolver el tema real
     * Si la preferencia es 'system', debemos preguntar al navegador qué prefiere el usuario
     * en su sistema operativo (Windows, macOS, Android, etc.).
     */
    function resolveTheme(theme) {
      if (theme === 'system') {
        // matchMedia consulta las media queries de CSS desde JavaScript
        // Si el SO está en modo oscuro, devuelve 'dark', de lo contrario 'light'
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      }
      return theme;
    }
    
    /**
     * PASO 3: Ejecución inmediata (BLOQUEANTE)
     * Este código se ejecuta en el <head>, antes de que se pinte el <body>.
     */
    const theme = getTheme(); // Obtenemos 'light', 'dark' o 'system'
    const resolved = resolveTheme(theme); // Lo convertimos en 'light' o 'dark' final
    
    // Añadimos la clase al <html> (document.documentElement)
    // Esto permite que Tailwind use 'dark:bg-black' inmediatamente
    document.documentElement.classList.add(resolved);
    
    // Sincronizamos el colorScheme del navegador
    // Esto cambia el color de las barras de desplazamiento y otros elementos nativos
    document.documentElement.style.colorScheme = resolved;
  })();
`;

export const clearThemeScript = `
  (function() {
    function getTheme() {
      try {
        const stored = localStorage.getItem('theme-preference');
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          return stored;
        }
      } catch (e) {}
      return 'system';
    }
    
    function resolveTheme(theme) {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      }
      return theme;
    }
    
    const theme = getTheme();
    const resolved = resolveTheme(theme);
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
  })();
`;