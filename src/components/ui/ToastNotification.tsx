'use client';

import React, { useEffect, useState, JSX } from 'react';

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({ message, type, onClose, duration = 3000 }: ToastNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
    warning: 'alert-warning',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${typeStyles[type]} shadow-lg`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{icons[type]}</span>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

interface UseToastReturn {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  ToastComponent: () => JSX.Element | null;
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  const ToastComponent = () => {
    if (!toast) return null;
    return (
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showToast, ToastComponent };
}
