import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { 
  useProcesses, 
  useActiveProcesses, 
  usePendingProcesses, 
  useFinishedProcesses, 
  usePausedProcesses,
  useArchivedProcesses 
} from "@/hooks/useProcess";

export default function ConfirmFinishProcessForm(props: any) {
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks para actualizar todas las listas de procesos
  const { mutate: mutateProcesses } = useProcesses();
  const { mutate: mutateActiveProcesses } = useActiveProcesses();
  const { mutate: mutatePendingProcesses } = usePendingProcesses();
  const { mutate: mutateFinishedProcesses } = useFinishedProcesses();
  const { mutate: mutatePausedProcesses } = usePausedProcesses();
  const { mutate: mutateArchivedProcesses } = useArchivedProcesses();

  const handleDelete = async () => {
    setIsSubmitting(true);
    
    try {
      // Lógica para finalizar el proceso
      const response = await fetch("/api/platform/process/status/completed", {
        method: "PUT",
        body: JSON.stringify({ id: props.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Error en la petición o la información proporcionada");
      }
      
      const result = await response.json();
      
      // Actualizar todas las listas de procesos para reflejar el cambio
      await Promise.all([
        mutateProcesses(),
        mutateActiveProcesses(),
        mutatePendingProcesses(),
        mutateFinishedProcesses(),
        mutatePausedProcesses(),
        mutateArchivedProcesses()
      ]);
      
      closeModal();
    } catch (error) {
      console.error("Error al finalizar proceso:", error);
      // Aquí podrías agregar un toast o notificación de error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col justify-center align-middle items-center max-w-md mx-auto p-6'>
      <h1 className='text-2xl fontArci text-center pb-5 text-[var(--main-arci)]'>
        Finalizar Proceso
      </h1>
      
      <div className='text-center mb-6'>
        <p className='text-gray-600 mb-2'>
          ¿Estás seguro de que deseas finalizar este proceso?
        </p>
        <p className='text-sm text-gray-500'>
          Esta acción marcará el proceso como completado y no se podrá deshacer.
        </p>
      </div>

      {props.processTitle && (
        <div className='bg-gray-50 p-3 rounded-lg mb-6 w-full'>
          <p className='text-sm text-gray-600 text-center'>
            Proceso: <span className='font-medium text-gray-900'>{props.processTitle}</span>
          </p>
        </div>
      )}

      <div className='flex gap-3 w-full'>
        <button 
          className='btn btn-outline flex-1'
          onClick={closeModal}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        
        <button 
          className='btn bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white flex-1 disabled:opacity-50'
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <div className='loading loading-spinner loading-sm'></div>
              Finalizando...
            </div>
          ) : (
            "Finalizar"
          )}
        </button>
      </div>
    </div>
  );
}
