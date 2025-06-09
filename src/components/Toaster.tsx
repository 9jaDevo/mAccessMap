import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastColors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

let toastQueue: Toast[] = [];
let setToastsCallback: (toasts: Toast[]) => void;

export const showToast = (type: Toast['type'], message: string) => {
  const toast: Toast = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    message,
  };
  
  toastQueue.push(toast);
  if (setToastsCallback) {
    setToastsCallback([...toastQueue]);
  }
  
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== toast.id);
    if (setToastsCallback) {
      setToastsCallback([...toastQueue]);
    }
  }, 5000);
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setToastsCallback = setToasts;
    setToasts([...toastQueue]);
  }, []);

  const removeToast = (id: string) => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    setToasts([...toastQueue]);
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${toastColors[toast.type]} animate-slide-in`}
          >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};