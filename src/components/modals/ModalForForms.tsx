import React from "react";

export default function ModalForForms({children, title}:{title?: string} & React.PropsWithChildren<{}>) {
  return (
    <div>
      <button className='btn bg-[var(--soft-arci)] h-7 w-20' onClick={() => document.getElementById("myModal").showModal()}>
        {title || null}
      </button>
      <dialog id='myModal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          {children}
          <div className='modal-action'></div>
        </div>
      </dialog>
    </div>
  );
}
