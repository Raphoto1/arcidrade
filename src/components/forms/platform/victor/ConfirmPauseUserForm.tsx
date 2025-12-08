import React, { useState } from 'react'
import { useModal } from '@/context/ModalContext'
import { useAllProfesionals } from '@/hooks/usePlatPro'
import { useAllActiveInstitutions, useAllPausedInstitutions } from '@/hooks/usePlatInst'
import { mutate as globalMutate } from 'swr'

export default function ConfirmPauseUserForm(props: any) {
  const { closeModal } = useModal();
  const { mutate: mutateAllProfesionals } = useAllProfesionals();
  const { mutate: mutateActiveInstitutions } = useAllActiveInstitutions();
  const { mutate: mutatePausedInstitutions } = useAllPausedInstitutions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePauseUser = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/platform/victor/adminUser/desactivate/", {
        method: "PUT",
        body: JSON.stringify({ 
          userId: props.userId || props.id
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
      
      // Actualizar todas las listas de profesionales
      mutateAllProfesionals();
      // Actualizar cache global de profesionales paginados
      globalMutate(
        (key: any) => typeof key === 'string' && key.startsWith('/api/platform/profesional/paginated'),
        undefined,
        { revalidate: true }
      );
      // Actualizar listas de instituciones
      mutateActiveInstitutions();
      mutatePausedInstitutions();
    } catch (error) {
      console.error("Error al pausar usuario:", error);
      alert("Error al pausar el usuario. Por favor, intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col justify-center align-middle items-center max-w-md mx-auto p-4'>
      <h1 className='text-2xl fontArci text-center pb-5 text-yellow-600'>
        Pausar Usuario
      </h1>
      
      <div className='text-center mb-6'>
        <p className='text-lg text-gray-700 mb-3'>
          ¿Está seguro que desea pausar este usuario?
        </p>
        
        {props.userName && (
          <div className='bg-gray-50 p-3 rounded-lg mb-4'>
            <span className='text-sm text-gray-600'>Usuario:</span>
            <div className='font-medium text-gray-900'>{props.userName}</div>
          </div>
        )}
        
        {props.userEmail && (
          <div className='bg-gray-50 p-3 rounded-lg mb-4'>
            <span className='text-sm text-gray-600'>Email:</span>
            <div className='font-medium text-gray-900'>{props.userEmail}</div>
          </div>
        )}
        
        <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-yellow-700'>
                Al pausar el usuario, este no podrá usar la plataforma hasta que sea reactivado.
              </p>
            </div>
          </div>
        </div>
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
          className='btn bg-yellow-600 hover:bg-yellow-700 text-white flex-1 disabled:opacity-50'
          onClick={handlePauseUser}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <div className='loading loading-spinner loading-sm'></div>
              Pausando...
            </div>
          ) : (
            'Sí, pausar usuario'
          )}
        </button>
      </div>
    </div>
  )
}
