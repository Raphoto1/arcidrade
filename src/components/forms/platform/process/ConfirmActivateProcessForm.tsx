import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { revalidateAllProcesses } from "@/hooks/useProcess";

export default function ConfirmActivateProcessForm(props: any) {
  const { closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Lógica para activar el proceso
      const response = await fetch("/api/platform/process/manage/status/active", {
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
      // Revalidar todas las listas de procesos
      await revalidateAllProcesses();
      // Si hay un callback onSuccess, ejecutarlo (para actualizar el proceso individual)
      if (props.onSuccess) {
        await props.onSuccess();
      }
      closeModal();
    } catch (error) {
      console.error("Error al activar proceso:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='flex flex-col justify-center align-middle items-center'>
      <h1 className='text-2xl fontArci text-center pb-5'>Aceptar Proceso</h1>
      <button 
        className='btn bg-[var(--main-arci)] h-7 w-20 text-white text-center justify-center pt' 
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? <span className='loading loading-spinner loading-xs'></span> : 'Aceptar'}
      </button>
    </div>
  );
}
