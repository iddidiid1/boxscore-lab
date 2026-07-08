import { useCallback, useEffect, useRef } from "react";

// Warns the user before the browser unloads the page (tab close, refresh, or a
// full-page navigation such as a back link) while a form has unsaved changes.
//
// Note: the app uses a custom pushState-based router, so purely client-side
// navigations do not trigger `beforeunload`. Forms therefore also guard their
// own Cancel action explicitly.
//
// Returns `allowUnload`: call it right before a programmatic navigation that
// follows a successful save (e.g. `window.location.href = ...`). Otherwise the
// form is still "dirty" at that moment and the browser would show a bogus
// "unsaved changes" prompt for data that was in fact persisted.
export function useUnsavedChangesWarning(isDirty: boolean): () => void {
  const bypassRef = useRef(false);

  useEffect(() => {
    if (!isDirty) return;

    const handler = (event: BeforeUnloadEvent) => {
      if (bypassRef.current) return;
      event.preventDefault();
      // Required by some browsers to actually show the native prompt.
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return useCallback(() => {
    bypassRef.current = true;
  }, []);
}
