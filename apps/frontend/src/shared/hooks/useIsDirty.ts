import { useEffect, useRef } from "react";

// Tracks whether a form has diverged from the value it was first loaded with.
//
// Pass a serialized snapshot of the editable state (e.g. JSON.stringify of the
// relevant fields) and a `ready` flag that is true once initial data has loaded.
// The first snapshot captured while `ready` is used as the baseline; any later
// difference marks the form dirty. `ready === false` is never dirty.
export function useIsDirty(serialized: string, ready: boolean): boolean {
  const baseline = useRef<string | null>(null);

  useEffect(() => {
    if (ready && baseline.current === null) baseline.current = serialized;
  }, [ready, serialized]);

  if (!ready || baseline.current === null) return false;
  return baseline.current !== serialized;
}
