import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { useSWRConfig } from "swr";

export default function ConfirmPauseProcessForm(props: any) {
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const { mutate: globalMutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    console.log('🟡 [ConfirmPauseProcessForm] iniciando pausa de proceso', { id: props.id });
    try {
      // Lógica para pausar el proceso
      console.log('🟡 [ConfirmPauseProcessForm] enviando solicitud PUT a /api/platform/process/manage/status/paused');
      const response = await fetch("/api/platform/process/manage/status/paused", {
        method: "PUT",
        body: JSON.stringify({ id: props.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log('🟡 [ConfirmPauseProcessForm] respuesta recibida', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🟡 [ConfirmPauseProcessForm] respuesta no OK', { status: response.status, text: errorText });
        throw new Error(`Error en la peticion: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('🟡 [ConfirmPauseProcessForm] resultado JSON', result);
      
      // Ejecutar callback del padre (que tiene el mutate correcto)
      console.log('🟡 [ConfirmPauseProcessForm] ejecutando onSuccess callback');
      if (props.onSuccess) {
        await props.onSuccess();
      }
      console.log('🟡 [ConfirmPauseProcessForm] onSuccess callback completado');
      
      // Revalidar todos los procesos en background (sin bloquear el cierre del modal)
      console.log('🟡 [ConfirmPauseProcessForm] iniciando revalidación en background');
      const revalidateEndpoints = [
        '/api/platform/process/',
        '/api/platform/process/status/active',
        '/api/platform/process/status/paused',
        '/api/platform/process/all',
        '/api/platform/process/all/active',
        '/api/platform/process/all/paused',
      ];
      Promise.all(revalidateEndpoints.map(endpoint => globalMutate(endpoint))).then(() => {
        console.log('🟡 [ConfirmPauseProcessForm] revalidación completada');
      }).catch(err => {
        console.error('🟡 [ConfirmPauseProcessForm] error en revalidación', err);
      });
      
      // Mostrar mensaje de éxito
      console.log('🟡 [ConfirmPauseProcessForm] mostrando toast de éxito');
      showToast('Proceso pausado correctamente', 'success');
      
      // Cerrar modal inmediatamente
      console.log('🟡 [ConfirmPauseProcessForm] cerrando modal');
      closeModal();
      console.log('🟡 [ConfirmPauseProcessForm] proceso completado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('🟡 [ConfirmPauseProcessForm] ERROR CAPTURADO', { error, errorMessage });
      showToast(`Error al pausar el proceso: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='flex flex-col justify-center align-middle items-center'>
      <h1 className='text-2xl fontArci text-center pb-5'>Pausar Proceso</h1>
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
