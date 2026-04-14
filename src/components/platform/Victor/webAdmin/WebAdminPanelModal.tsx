"use client";
import React, { useRef } from "react";
import { FiChevronRight } from "react-icons/fi";

interface WebAdminPanelModalProps {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  accentClassName: string;
  children: React.ReactNode;
}

export default function WebAdminPanelModal({
  eyebrow,
  title,
  description,
  status,
  accentClassName,
  children,
}: WebAdminPanelModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      {/* Tarjeta compacta */}
      <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
        <div className={`h-2 w-full ${accentClassName}`} />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{eyebrow}</p>
              <h2 className="mt-1.5 font-oswald text-xl text-(--main-arci) leading-tight">{title}</h2>
            </div>
            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              {status}
            </span>
          </div>
          <p className="mt-2 text-sm leading-5 text-gray-500 line-clamp-2">{description}</p>
          <button
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-(--main-arci) transition-colors hover:bg-(--soft-arci)"
            onClick={() => modalRef.current?.showModal()}
          >
            Gestionar
            <FiChevronRight size={16} />
          </button>
        </div>
      </article>

      {/* Modal con panel completo */}
      <dialog
        ref={modalRef}
        className="modal px-2 py-2 sm:px-4"
        onClick={(e) => e.target === e.currentTarget && modalRef.current?.close()}
      >
        <div className="modal-box relative w-full max-w-[min(100vw-1rem,56rem)] max-h-[92vh] overflow-y-auto overflow-x-hidden p-0">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost sticky top-2 right-2 float-right z-20 bg-base-100/90 mr-2 mt-2">
              ✕
            </button>
          </form>
          <div className="clear-both">
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}
