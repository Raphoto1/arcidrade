"use client";
import React from "react";
import { useToast } from "@/context/ToastContext";

const typeStyles = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
  warning: "alert-warning",
};

const icons = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️",
};

/**
 * Renderiza los toasts DENTRO del <dialog> para que sean visibles
 * en el HTML top layer (creado por showModal()).
 * Debe incluirse dentro de cada modal wrapper.
 */
export default function ModalToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert ${typeStyles[toast.type]} shadow-lg cursor-pointer`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{icons[toast.type]}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
