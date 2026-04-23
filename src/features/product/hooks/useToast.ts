import { useState, useRef } from "react";
import type { ToastMessage, ToastType } from "../../../shared/components/Toast";

export function useToast() {
  const [toast, setToast] = useState<ToastMessage>({ type: "heart", visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(type: ToastType) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ type, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }

  return { toast, showToast };
}