"use client";
import React, { useRef } from "react";

export default function ModalForPreview({ children, title }: { title?: string } & React.PropsWithChildren<{}>) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    } else {
      console.warn("Modal no encontrado");
    }
  };

  return (
    <div>
      <button
        className='btn h-auto w-auto p-1 min-w-full text-white'
        style={{ backgroundColor: "var(--main-arci)" }}
        onClick={openModal}
      >
        {title || null}
      </button>
      <dialog ref={modalRef} className='modal px-2 py-2 sm:px-4' onClick={(event) => event.target === event.currentTarget && modalRef.current?.close()}>
        <div className='modal-box relative w-full max-w-[min(100vw-1rem,72rem)] max-h-[92vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost sticky top-0 float-right z-20 bg-base-100/90'>✕</button>
          </form>
          <div className='clear-both w-full min-w-0'>
            {children}
          </div>
        </div>
      </dialog>
    </div>
  );
}
