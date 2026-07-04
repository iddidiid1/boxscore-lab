import { useEffect } from "react";

// Warns the user before the browser unloads the page (tab close, refresh, or a
// full-page navigation such as a back link) while a form has unsaved changes.
//
// Note: the app uses a custom pushState-based router, so purely client-side
// navigations do not trigger `beforeunload`. Forms therefore also guard their
// own Cancel action explicitly.
export function useUnsavedChangesWarning(isDirty: boolean): void {
  useEffect(() => {
    if (!isDirty) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Required by some browsers to actually show the native prompt.
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}
