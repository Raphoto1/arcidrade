import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useAllPendingProcesses } from "@/hooks/useProcess";

export default function ConfirmResendInvitationForm(props: any) {
  const { closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/auth/invitations/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Error en la peticion o la informacion proporcionada");
      }
      
      const result = await response.json();

      
      // Pequeña pausa para mostrar el éxito antes de cerrar
      setTimeout(() => {
        closeModal();
      }, 500);
      
    } catch (error: any) {
      console.error('Error al reenviar invitación:', error);
      setError(error.message || 'Error al reenviar la invitación');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='flex flex-col justify-center align-middle items-center'>
      <h1 className='text-2xl fontArci text-center pb-5'>
        Reenviar Invitación a {props.email}
      </h1>
      
      {/* Mostrar error si existe */}
      {error && (
        <div className="alert alert-error max-w-md mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Estado de loading */}
      {isLoading && (
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="loading loading-spinner loading-lg text-[var(--main-arci)]"></div>
          <p className="text-sm text-gray-600">Reenviando invitación...</p>
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="flex gap-3">
        <button 
          className={`btn h-7 w-20 text-white text-center justify-center ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[var(--main-arci)] hover:bg-[var(--soft-arci)]'
          }`}
          onClick={handleResend}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            'Aceptar'
          )}
        </button>
        
        <button 
          className="btn btn-outline h-7 w-20 text-center justify-center"
          onClick={closeModal}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
      
      {/* Mensaje de confirmación */}
      {!isLoading && !error && (
        <p className="text-xs text-gray-500 text-center mt-3 max-w-xs">
          Se enviará un nuevo email de invitación a la dirección proporcionada
        </p>
      )}
    </div>
  );
}
