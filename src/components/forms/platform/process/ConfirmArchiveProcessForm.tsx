import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useProfesional } from "@/hooks/usePlatPro";

export default function ConfirmArchiveProcessForm(props: any) {
  const { mutate } = useProfesional();
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    
    try {
      // Lógica para archivar el proceso
      const response = await fetch("/api/platform/process/status/archived", {
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
      mutate();
      closeModal();
    } catch (error) {
      console.error("Error al archivar proceso:", error);
      // Aquí podrías agregar un toast o notificación de error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col justify-center align-middle items-center max-w-md mx-auto p-6'>
      <h1 className='text-2xl fontArci text-center pb-5 text-[var(--orange-arci)]'>
        Archivar Proceso
      </h1>
      
      <div className='text-center mb-6'>
        <p className='text-gray-600 mb-2'>
          ¿Estás seguro de que deseas archivar este proceso?
        </p>
        <p className='text-sm text-gray-500'>
          El proceso se moverá a la sección de archivados y podrá ser restaurado posteriormente.
        </p>
      </div>

      {props.processTitle && (
        <div className='bg-orange-50 p-3 rounded-lg mb-6 w-full border border-orange-200'>
          <p className='text-sm text-orange-700 text-center'>
            Proceso: <span className='font-medium'>{props.processTitle}</span>
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
          className='btn bg-[var(--orange-arci)] hover:bg-[var(--orange-arci)]/90 text-white flex-1 disabled:opacity-50'
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <div className='loading loading-spinner loading-sm'></div>
              Archivando...
            </div>
          ) : (
            "Archivar"
          )}
        </button>
      </div>
    </div>
  );
}
