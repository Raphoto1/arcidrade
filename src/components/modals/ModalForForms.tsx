'use client'
import React, { useRef } from "react";

export default function ModalForForms({ children, title }: { title?: string } & React.PropsWithChildren<{}>) {
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
      <button className='btn bg-[var(--soft-arci)] h-7 w-20' onClick={openModal}>
        {title || null}
      </button>
      <dialog ref={modalRef} className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          {children}
          <div className='modal-action'></div>
        </div>
      </dialog>
    </div>
  );
}
