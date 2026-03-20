import { useEffect, useRef } from "react";
import { saveDraft } from "@/lib/storage";

export function useAutoSave(
  markdown: string,
  { enabled = true, onSave }: { enabled?: boolean; onSave?: () => void } = {}
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!enabled) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (saveDraft(markdown)) {
        onSave?.();
      }
    }, 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [markdown, enabled, onSave]);
}
