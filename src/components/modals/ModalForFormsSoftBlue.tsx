"use client";
import React, { useRef } from "react";
import { ModalContext } from "@context/ModalContext";

interface ModalProps {
  title?: string;
  children: React.ReactNode;
}

export default function ModalForFormsSoftBlue({ children, title }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  return (
    <div>
      {title && (
        <button className='btn bg-[var(--soft-arci)] h-auto w-auto p-1 min-w-full' onClick={openModal}>
          {title}
        </button>
      )}
      <dialog ref={modalRef} className='modal modal-middle sm:modal-middle' aria-labelledby='modal-title'>
        <ModalContext.Provider value={{ closeModal }}>
          <div className='modal-box max-h-90vh mb-10'>
            <form method='dialog'>
              <button type='button' className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={closeModal}>
                ✕
              </button>
            </form>
            {title && (
              <h2 id='modal-title' className='text-lg font-bold mb-2'>
                {title}
              </h2>
            )}
            {children}
          </div>
        </ModalContext.Provider>
      </dialog>
    </div>
  );
}
