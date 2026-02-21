import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { useSWRConfig } from "swr";

export default function ConfirmActivateProcessForm(props: any) {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const { mutate: globalMutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    console.log('🟢 [ConfirmActivateProcessForm] iniciando activación de proceso', { id: props.id });
    try {
      // Lógica para activar el proceso
      console.log('🟢 [ConfirmActivateProcessForm] enviando solicitud PUT a /api/platform/process/manage/status/active');
      const response = await fetch("/api/platform/process/manage/status/active", {
        method: "PUT",
        body: JSON.stringify({ id: props.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log('🟢 [ConfirmActivateProcessForm] respuesta recibida', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🟢 [ConfirmActivateProcessForm] respuesta no OK', { status: response.status, text: errorText });
        throw new Error(`Error en la peticion: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('🟢 [ConfirmActivateProcessForm] resultado JSON', result);
      
      // Ejecutar callback del padre (que tiene el mutate correcto)
      console.log('🟢 [ConfirmActivateProcessForm] ejecutando onSuccess callback');
      if (props.onSuccess) {
        await props.onSuccess();
      }
      console.log('🟢 [ConfirmActivateProcessForm] onSuccess callback completado');
      
      // Revalidar todos los procesos en background (sin bloquear el cierre del modal)
      console.log('🟢 [ConfirmActivateProcessForm] iniciando revalidación en background');
      const revalidateEndpoints = [
        '/api/platform/process/',
        '/api/platform/process/status/active',
        '/api/platform/process/status/pending',
        '/api/platform/process/status/paused',
        '/api/platform/process/status/archived',
        '/api/platform/process/all',
        '/api/platform/process/all/active',
        '/api/platform/process/all/pending',
        '/api/platform/process/all/paused',
        '/api/platform/process/all/archived',
      ];
      Promise.all(revalidateEndpoints.map(endpoint => globalMutate(endpoint))).then(() => {
        console.log('🟢 [ConfirmActivateProcessForm] revalidación completada');
      }).catch(err => {
        console.error('🟢 [ConfirmActivateProcessForm] error en revalidación', err);
      });
      
      // Mostrar mensaje de éxito
      console.log('🟢 [ConfirmActivateProcessForm] mostrando toast de éxito');
      showToast('Proceso aceptado correctamente', 'success');
      
      // Cerrar modal inmediatamente
      console.log('🟢 [ConfirmActivateProcessForm] cerrando modal');
      closeModal();
      console.log('🟢 [ConfirmActivateProcessForm] proceso completado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('🟢 [ConfirmActivateProcessForm] ERROR CAPTURADO', { error, errorMessage });
      showToast(`Error al aceptar el proceso: ${errorMessage}`, 'error');
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
