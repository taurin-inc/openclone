// Adapted from google-gemini/gemini-cli (Apache-2.0).
// https://github.com/google-gemini/gemini-cli/blob/main/packages/cli/src/ui/hooks/useStateAndRef.ts
import { useCallback, useRef, useState } from "react";

export function useStateAndRef<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);
  const set = useCallback((value: T | ((previous: T) => T)) => {
    const next = typeof value === "function"
      ? (value as (previous: T) => T)(ref.current)
      : value;
    ref.current = next;
    setState(next);
  }, []);
  return [state, ref, set] as const;
}
