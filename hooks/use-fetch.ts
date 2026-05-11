import { useReducer, useCallback, useRef } from "react";

// Estado discriminado — solo puede estar en UNO de estos estados a la vez
type FetchState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

// Acciones posibles
type FetchAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; payload: string };

function fetchReducer<T>(
  _state: FetchState<T>,
  action: FetchAction<T>,
): FetchState<T> {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading", data: null, error: null };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload, error: null };
    case "FETCH_ERROR":
      return { status: "error", data: null, error: action.payload };
  }
}

export function useFetch<T>() {
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    status: "idle",
    data: null,
    error: null,
  });

  // Guarda el AbortController actual para poder cancelarlo
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (fetchFn: (signal: AbortSignal) => Promise<T>) => {
      // Si hay un fetch anterior en curso, lo cancela
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crea un nuevo AbortController para esta llamada
      const controller = new AbortController();
      abortControllerRef.current = controller;

      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchFn(controller.signal);

        // Si fue abortado, no actualiza estado
        if (!controller.signal.aborted) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
        }
      } catch (err) {
        // Si el error es por abort, lo ignoramos (no es un error real)
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        if (!controller.signal.aborted) {
          dispatch({
            type: "FETCH_ERROR",
            payload: err instanceof Error ? err.message : "Error desconocido",
          });
        }
      }
    },
    [],
  );

  // Cancela el fetch en curso (para usar en cleanup de useEffect)
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    ...state,
    isLoading: state.status === "loading",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    execute,
    cancel,
  };
}
