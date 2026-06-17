import { useState } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  tone: 'info' | 'success' | 'error';
}

export function useToastStack() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID?.() ?? `toast-${Date.now()}`;
    setToasts((current) => [{ id, ...toast }, ...current].slice(0, 4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 5200);
  };

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return { toasts, pushToast, dismissToast };
}
