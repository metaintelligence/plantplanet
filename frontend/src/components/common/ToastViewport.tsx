import type { ToastMessage } from '../../hooks/useToastStack';

interface ToastViewportProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <button className={`toast ${toast.tone}`} key={toast.id} type="button" onClick={() => onDismiss(toast.id)}>
          <strong>{toast.title}</strong>
          <span>{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
