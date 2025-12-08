import React, { useState } from 'react'
import { useModal } from '@/context/ModalContext'
import { useAllProfesionals } from '@/hooks/usePlatPro'
import { useAllActiveInstitutions, useAllPausedInstitutions } from '@/hooks/usePlatInst'
import { mutate as globalMutate } from 'swr'

export default function ConfirmDeleteUserForm(props: any) {
  const { closeModal } = useModal();
  const { mutate: mutateAllProfesionals } = useAllProfesionals();
  const { mutate: mutateActiveInstitutions } = useAllActiveInstitutions();
  const { mutate: mutatePausedInstitutions } = useAllPausedInstitutions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/platform/victor/adminUser/delete/", {
        method: "DELETE",
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
      
      // Actualizar todas las listas
      mutateAllProfesionals();
      globalMutate(
        (key: any) => typeof key === 'string' && key.startsWith('/api/platform/profesional/paginated'),
        undefined,
        { revalidate: true }
      );
      mutateActiveInstitutions();
      mutatePausedInstitutions();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar el usuario. Por favor, intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col justify-center align-middle items-center max-w-md mx-auto p-4'>
      <h1 className='text-2xl fontArci text-center pb-5 text-red-600'>
        Eliminar Usuario
      </h1>
      
      <div className='text-center mb-6'>
        <p className='text-lg text-gray-700 mb-3'>
          ¿Está seguro que desea eliminar permanentemente este usuario?
        </p>
        
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
          <p className='text-sm text-gray-600 mb-1'>
            <span className='font-semibold'>Nombre:</span> {props.userName || 'No disponible'}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-semibold'>Email:</span> {props.userEmail || 'No disponible'}
          </p>
        </div>

        <div className='bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4'>
          <p className='text-sm text-yellow-800 font-semibold mb-2'>
            ⚠️ ADVERTENCIA: Esta acción es irreversible
          </p>
          <p className='text-xs text-yellow-700'>
            Se eliminarán todos los datos asociados al usuario:
          </p>
          <ul className='text-xs text-yellow-700 text-left mt-2 space-y-1'>
            <li>• Datos profesionales o institucionales</li>
            <li>• Estudios y certificaciones</li>
            <li>• Experiencia laboral</li>
            <li>• Procesos de selección</li>
            <li>• Campañas y leads asociados</li>
          </ul>
        </div>
      </div>

      <div className='flex flex-col w-full gap-3'>
        <button
          onClick={handleDeleteUser}
          disabled={isSubmitting}
          className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
        >
          {isSubmitting ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
        </button>
        
        <button
          onClick={closeModal}
          disabled={isSubmitting}
          className='px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50'
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
