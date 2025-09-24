"use client";
import React, { useRef } from "react";

export default function ModalForPreviewTextLink({ children, title }: { title?: string } & React.PropsWithChildren<{}>) {
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
      <button className='text-sm text-main link text-blue-300' onClick={openModal}>
        {title || null}
      </button>
      <dialog ref={modalRef} className='modal modal-middle overflow-y-auto h-full md:w-full'>
        <div className='modal-box md:w-full overflow-y-auto max-h-10/12 md:h-fit'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-1 top-1'>✕</button>
          </form>
          <div className="pt-2">
          {children}
          </div>
        </div>
      </dialog>
    </div>
  );
}
