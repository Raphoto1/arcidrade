'use client'
import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useProfesionalsListedInProcess, useActiveProcessesByUser } from "@/hooks/useProcess";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastContext";

export default function ConfirmAddProfesionalToProcessForm(props: any) {

  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const { data: session } = useSession();
  const { data, mutate } = useProfesionalsListedInProcess(props.ProcessId);
  const { mutate: mutateUserProcesses } = useActiveProcessesByUser(session?.user.id || null);
  const chk = data?.payload.find((item: any) => item.profesional_id === props.UserID && item.added_by === 'institution');
  
  if (chk) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl fontArci text-center pb-5">{`${props.fullName || ''} ya fue agregado al Proceso ${props.processPosition}`}</h1>
        <button className="btn bg-(--main-arci) h-7 w-20 text-white text-center justify-center pt" onClick={closeModal}>
          Cerrar
        </button>
      </div>
    );
  }
  const pack = {
    process_id: props.ProcessId,
    profesional_id: props.UserID,
    isArcidrade: props.isArci || false,
    status: 'listed',
    added_by: props.addedBy || ''
  };
  const handleDelete = async () => {
    setIsLoading(true);

    
    try {
      // Lógica para agregar el profesional al proceso
      const response = await fetch("/api/platform/process/candidates", {
        method: "POST",
        body: JSON.stringify(pack),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error en la peticion o la informacion proporcionada");
      }
      const result = await response.json();

      // Revalidar la lista de profesionales en este proceso
      mutate();
      
      // Revalidar la lista de postulaciones del usuario profesional
      mutateUserProcesses();

      // Mostrar mensaje de éxito
      showToast('Postulación enviada correctamente', 'success');
      
      closeModal();
    } catch (error: any) {
      console.error("Error al agregar profesional:", error);
      showToast(`Error al enviar postulación: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='flex flex-col justify-center align-middle items-center'>
      <h1 className='text-2xl fontArci text-center pb-5'>{`${props.fullName||''} Se Agregara al Proceso ${props.processPosition}`}</h1>
      <button 
        className={`btn h-7 w-20 text-white text-center justify-center pt flex items-center ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-(--main-arci)'
        }`}
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          'Agregar'
        )}
      </button>
    </div>
  );
}
