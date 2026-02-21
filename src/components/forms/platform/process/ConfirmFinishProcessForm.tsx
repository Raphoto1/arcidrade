import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { useSWRConfig } from "swr";

export default function ConfirmFinishProcessForm(props: any) {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const { mutate: globalMutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    console.log('🔵 [ConfirmFinishProcessForm] iniciando finalización de proceso', { id: props.id });
    
    try {
      // Lógica para finalizar el proceso
      console.log('🔵 [ConfirmFinishProcessForm] enviando solicitud PUT a /api/platform/process/manage/status/completed');
      const response = await fetch("/api/platform/process/manage/status/completed", {
        method: "PUT",
        body: JSON.stringify({ id: props.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log('🔵 [ConfirmFinishProcessForm] respuesta recibida', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔵 [ConfirmFinishProcessForm] respuesta no OK', { status: response.status, text: errorText });
        throw new Error(`Error en la petición: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('🔵 [ConfirmFinishProcessForm] resultado JSON', result);
      
      // Ejecutar callback del padre (que tiene el mutate correcto)
      console.log('🔵 [ConfirmFinishProcessForm] ejecutando onSuccess callback');
      if (props.onSuccess) {
        await props.onSuccess();
      }
      console.log('🔵 [ConfirmFinishProcessForm] onSuccess callback completado');
      
      // Revalidar todos los procesos en background (sin bloquear el cierre del modal)
      console.log('🔵 [ConfirmFinishProcessForm] iniciando revalidación en background');
      const revalidateEndpoints = [
        '/api/platform/process/',
        '/api/platform/process/status/active',
        '/api/platform/process/status/completed',
        '/api/platform/process/all',
        '/api/platform/process/all/active',
        '/api/platform/process/all/completed',
      ];
      Promise.all(revalidateEndpoints.map(endpoint => globalMutate(endpoint))).then(() => {
        console.log('🔵 [ConfirmFinishProcessForm] revalidación completada');
      }).catch(err => {
        console.error('🔵 [ConfirmFinishProcessForm] error en revalidación', err);
      });
      
      // Mostrar mensaje de éxito
      console.log('🔵 [ConfirmFinishProcessForm] mostrando toast de éxito');
      showToast('Proceso finalizado correctamente', 'success');
      
      // Cerrar modal
      console.log('🔵 [ConfirmFinishProcessForm] cerrando modal');
      closeModal();
      console.log('🔵 [ConfirmFinishProcessForm] proceso completado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('🔵 [ConfirmFinishProcessForm] ERROR CAPTURADO', { error, errorMessage });
      showToast(`Error al finalizar el proceso: ${errorMessage}`, 'error');
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
