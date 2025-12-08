import React, { useState } from 'react'
import { useModal } from '@/context/ModalContext'
import { 
  useAllPendingProcesses, 
  useAllProcesses, 
  useAllActiveProcesses,
  usePendingProcesses,
  useProcesses,
  useProcess
} from '@/hooks/useProcess'

export default function ConfirmMakeProcessArciForm(props: any) {
  const { closeModal } = useModal();
  const { mutate: mutatePendingProcesses } = useAllPendingProcesses();
  const { mutate: mutateAllProcesses } = useAllProcesses();
  const { mutate: mutateActiveProcesses } = useAllActiveProcesses();
  const { mutate: mutatePendingProcessesShort } = usePendingProcesses();
  const { mutate: mutateProcesses } = useProcesses();
  const { mutate: mutateSpecificProcess } = useProcess(props.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMakeArcidrade = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/platform/process/manage/type/", {
        method: "PUT",
        body: JSON.stringify({ 
          id: props.id,
          type: 'auto' 
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Error en la petición o la información proporcionada");
      }
      
      const result = await response.json();
      closeModal();
      
      // Actualizar todas las listas de procesos
      mutatePendingProcesses();
      mutateAllProcesses();
      mutateActiveProcesses();
      mutatePendingProcessesShort();
      mutateProcesses();
      mutateSpecificProcess(); // Actualizar el proceso específico que se está viendo en ProcessVictor
    } catch (error) {
      console.error("Error al convertir proceso a Arcidrade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col justify-center align-middle items-center max-w-md mx-auto p-4'>
      <h1 className='text-2xl fontArci text-center pb-5 text-[var(--main-arci)]'>
        Convertir a Proceso Autogestionado
      </h1>
      
      <div className='text-center mb-6'>
        <p className='text-lg text-gray-700 mb-3'>
          ¿Desea convertir este proceso en Autogestionado?
        </p>
        
        {props.processTitle && (
          <div className='bg-gray-50 p-3 rounded-lg mb-4'>
            <span className='text-sm text-gray-600'>Proceso:</span>
            <div className='font-medium text-gray-900'>{props.processTitle}</div>
          </div>
        )}
        
        <p className='text-sm text-gray-600'>
          Al convertirlo en proceso Autogestionado, no se listarán en Arcidrade y se gestionarán por las instituciones de manera autónoma.
        </p>
      </div>

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
          onClick={handleMakeArcidrade}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <div className='loading loading-spinner loading-sm'></div>
              Procesando...
            </div>
          ) : (
            'Sí, convertir a Autogestionado'
          )}
        </button>
      </div>
    </div>
  )
}
