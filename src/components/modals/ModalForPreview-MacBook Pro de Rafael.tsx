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
      <button className='btn bg-[var(--main-arci)] h-auto w-auto p-1 min-w-full text-white' onClick={openModal}>
        {title || null}
      </button>
      <dialog ref={modalRef} className='modal modal-start overflow-y-auto h-full md:w-full'>
        <div className='modal-box md:w-full overflow-y-auto max-h-10/12 md:h-auto'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-1 top-1'>✕</button>
          </form>
          <div >
          {children}
          </div>
        </div>
      </dialog>
    </div>
  );
}
