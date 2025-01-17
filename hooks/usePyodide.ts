import { useState, useCallback } from "react";
import { initPyodide } from "../services/pythonPyodide";

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodide) return pyodide;

    try {
      setLoading(true);
      const pyodideInstance = await initPyodide();
      setPyodide(pyodideInstance);
      return pyodideInstance;
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Failed to load Pyodide");
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [pyodide]);

  return { pyodide, loading, error, loadPyodide };
}