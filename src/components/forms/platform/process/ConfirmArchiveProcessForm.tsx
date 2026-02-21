import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { useSWRConfig } from "swr";

export default function ConfirmArchiveProcessForm(props: any) {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const { mutate: globalMutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    console.log('🔴 [ConfirmArchiveProcessForm] iniciando archivación de proceso', { id: props.id });
    
    try {
      // Lógica para archivar el proceso
      console.log('🔴 [ConfirmArchiveProcessForm] enviando solicitud PUT a /api/platform/process/manage/status/archived');
      const response = await fetch("/api/platform/process/manage/status/archived", {
        method: "PUT",
        body: JSON.stringify({ id: props.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log('🔴 [ConfirmArchiveProcessForm] respuesta recibida', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 [ConfirmArchiveProcessForm] respuesta no OK', { status: response.status, text: errorText });
        throw new Error(`Error en la petición: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('🔴 [ConfirmArchiveProcessForm] resultado JSON', result);
      
      // Ejecutar callback del padre (que tiene el mutate correcto)
      console.log('🔴 [ConfirmArchiveProcessForm] ejecutando onSuccess callback');
      if (props.onSuccess) {
        await props.onSuccess();
      }
      console.log('🔴 [ConfirmArchiveProcessForm] onSuccess callback completado');
      
      // Revalidar todos los procesos en background (sin bloquear el cierre del modal)
      console.log('🔴 [ConfirmArchiveProcessForm] iniciando revalidación en background');
      const revalidateEndpoints = [
        '/api/platform/process/',
        '/api/platform/process/status/pending',
        '/api/platform/process/status/active',
        '/api/platform/process/status/archived',
        '/api/platform/process/all',
        '/api/platform/process/all/pending',
        '/api/platform/process/all/active',
        '/api/platform/process/all/archived',
      ];
      Promise.all(revalidateEndpoints.map(endpoint => globalMutate(endpoint))).then(() => {
        console.log('🔴 [ConfirmArchiveProcessForm] revalidación completada');
      }).catch(err => {
        console.error('🔴 [ConfirmArchiveProcessForm] error en revalidación', err);
      });
      
      // Mostrar mensaje de éxito
      console.log('🔴 [ConfirmArchiveProcessForm] mostrando toast de éxito');
      showToast('Proceso archivado correctamente', 'success');
      
      // Cerrar modal inmediatamente
      console.log('🔴 [ConfirmArchiveProcessForm] cerrando modal');
      closeModal();
      console.log('🔴 [ConfirmArchiveProcessForm] proceso completado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('🔴 [ConfirmArchiveProcessForm] ERROR CAPTURADO', { error, errorMessage });
      showToast(`Error al archivar el proceso: ${errorMessage}`, 'error');
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
