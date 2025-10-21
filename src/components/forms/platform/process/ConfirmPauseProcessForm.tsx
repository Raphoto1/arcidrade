import React from "react";
import { useModal } from "@/context/ModalContext";
import { useAllPendingProcesses } from "@/hooks/useProcess";

export default function ConfirmPauseProcessForm(props: any) {
  const { closeModal } = useModal();
  const { mutate } = useAllPendingProcesses()
  const handleDelete = async () => {
    // Lógica para pausar el proceso
    const response = await fetch("/api/platform/process/manage/status/paused", {
      method: "PUT",
      body: JSON.stringify({ id: props.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error en la peticion o la informacion proporcionada");
    }
    const result = await response.json();
    closeModal();
    mutate();
  };
  return (
    <div className='flex flex-col justify-center align-middle items-center'>
      <h1 className='text-2xl fontArci text-center pb-5'>Pausar Proceso</h1>
      <button className='btn bg-[var(--main-arci)] h-7 w-20 text-white text-center justify-center pt' onClick={handleDelete}>
        Aceptar
      </button>
    </div>
  );
}
