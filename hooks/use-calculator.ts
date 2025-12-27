import { useCallback, useState } from "react";

interface UseCalculatorOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCalculator(options?: UseCalculatorOptions) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculate = useCallback(async <T, R>(
    calculatorFn: (input: T) => R,
    input: T
  ): Promise<R | null> => {
    setIsCalculating(true);
    setError(null);

    try {
      const result = calculatorFn(input);
      options?.onSuccess?.();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Calculation failed");
      setError(error);
      options?.onError?.(error);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [options]);

  return {
    calculate,
    isCalculating,
    error,
    clearError: () => setError(null),
  };
}
