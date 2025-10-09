import React from "react";
import { useModal } from "@/context/ModalContext";
import { useProfesional } from "@/hooks/usePlatPro";
import { useProfesionalsListedInProcess } from "@/hooks/useProcess";

export default function ConfirmAddProfesionalToProcessForm(props: any) {

  const { closeModal } = useModal();
  const { data, mutate } = useProfesionalsListedInProcess(props.ProcessId);
  const chk = data?.payload.find((item: any) => item.profesional_id === props.UserID);
  if (chk) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl fontArci text-center pb-5">{`${props.fullName} ya fue agregado al Proceso ${props.processPosition}`}</h1>
        <button className="btn bg-[var(--main-arci)] h-7 w-20 text-white text-center justify-center pt" onClick={closeModal}>
          Cerrar
        </button>
      </div>
    );
  }
  const pack = {
    process_id: props.ProcessId,
    profesional_id: props.UserID,
    isArcidrade: props.isArci || false,
    status: 'listed'
  };
  const handleDelete = async () => {
    // Lógica para archivar el proceso
    const response = await fetch("/api/platform/process/candidates", {
      method: "POST",
      body: JSON.stringify({ userID: props.UserID, processId: props.ProcessId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error en la peticion o la informacion proporcionada");
    }
    const result = await response.json();
    console.log(response);
    mutate();
    closeModal();
  };
  return (
    <div className='flex flex-col justify-center align-middle items-center'>
      <h1 className='text-2xl fontArci text-center pb-5'>{`Se Agregara ${props.fullName} al Proceso ${props.processPosition}`}</h1>
      <button className='btn bg-[var(--main-arci)] h-7 w-20 text-white text-center justify-center pt' onClick={handleDelete}>
        Agregar
      </button>
    </div>
  );
}
