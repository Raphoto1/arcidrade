import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";

interface ConfirmResendLeadInvitationProps {
  leadId: string;
  email: string;
  nombre?: string;
  apellido?: string;
  status: string;
  onResendSuccess?: () => void;
}

export default function ConfirmResendLeadInvitation({
  leadId,
  email,
  nombre,
  apellido,
  status,
  onResendSuccess
}: ConfirmResendLeadInvitationProps) {
  const { closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/platform/campaign/resend-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          email,
          nombre,
          apellido,
          status
        }),
      });
      
      const result = await response.json();

      if (!response.ok) {
        // Manejar diferentes tipos de error
        let errorMessage = result.message || "Error al reenviar la invitación";
        
        if (response.status === 409) {
          errorMessage = "Este email ya tiene una invitación activa";
        } else if (response.status === 500) {
          errorMessage = result.message || "Error interno del servidor";
        }
        
        throw new Error(errorMessage);
      }
      
      setSuccess(true);
      
      // Mostrar información adicional en caso de que el usuario ya existiera
      if (result.recipient?.userExists) {
        console.log(`Usuario ${email} ya tenía cuenta activa, se reenvió invitación con referCode existente`);
      }
      
      // Llamar al callback si existe
      if (onResendSuccess) {
        onResendSuccess();
      }

      // Pequeña pausa para mostrar el éxito antes de cerrar
      setTimeout(() => {
        closeModal();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error al reenviar invitación:', error);
      setError(error.message || 'Error al reenviar la invitación');
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = [nombre, apellido].filter(Boolean).join(' ') || email;
  
  // Función para obtener información del tipo de reenvío
  const getResendInfo = () => {
    if (status === 'sent_subscription') {
      return {
        title: 'Reenvío de Suscripción Completa',
        description: 'Se creará un nuevo registro en la plataforma y se enviará un email con link para completar el perfil',
        icon: '✅',
        type: 'Suscripción Completa'
      };
    } else {
      return {
        title: 'Reenvío de Invitación al Sitio',
        description: 'Se enviará un email invitando a visitar la página web (sin registro automático)',
        icon: '🌐',
        type: 'Invitación al Sitio'
      };
    }
  };

  const resendInfo = getResendInfo();

  return (
    <div className='flex flex-col justify-center align-middle items-center p-4'>
      <h1 className='text-xl fontArci text-center pb-4 text-[var(--main-arci)]'>
        {resendInfo.title}
      </h1>
      
      {/* Información del tipo de reenvío */}
      <div className="bg-[var(--main-arci)]/10 p-4 rounded-lg mb-4 text-center border border-[var(--main-arci)]/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{resendInfo.icon}</span>
          <span className="font-semibold text-[var(--main-arci)] fontArci">{resendInfo.type}</span>
        </div>
        <p className="text-xs text-[var(--dark-gray)] fontRoboto">{resendInfo.description}</p>
      </div>
      
      {/* Información del lead */}
      <div className="bg-[var(--soft-arci)]/30 p-4 rounded-lg mb-4 text-center">
        <p className="text-sm text-[var(--dark-gray)] mb-1 fontRoboto">Se reenviará a:</p>
        <p className="font-semibold text-[var(--main-arci)] fontRoboto">{displayName}</p>
        <p className="text-sm text-[var(--dark-gray)] fontRoboto">{email}</p>
      </div>
      
      {/* Mostrar mensaje de éxito */}
      {success && (
        <div className="alert alert-success max-w-md mb-4 bg-[var(--green-arci)]/20 border-[var(--green-arci)] text-[var(--main-arci)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--green-arci)]">✅</span>
            <p className="text-sm fontRoboto">¡Invitación reenviada exitosamente!</p>
          </div>
        </div>
      )}
      
      {/* Mostrar error si existe */}
      {error && (
        <div className="alert alert-error max-w-md mb-4 bg-[var(--orange-arci)]/20 border-[var(--orange-arci)] text-[var(--main-arci)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--orange-arci)]">⚠️</span>
            <p className="text-sm fontRoboto">{error}</p>
          </div>
        </div>
      )}
      
      {/* Estado de loading */}
      {isLoading && (
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="loading loading-spinner loading-lg text-[var(--main-arci)]"></div>
          <p className="text-sm text-[var(--dark-gray)] fontRoboto">Reenviando invitación...</p>
        </div>
      )}
      
      {/* Botones de acción */}
      {!success && (
        <div className="flex gap-3 mt-2">
          <button 
            className={`btn h-8 px-4 text-white text-center justify-center fontRoboto text-sm ${
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
              'Reenviar'
            )}
          </button>
          
          <button 
            className="btn btn-outline h-8 px-4 text-center justify-center fontRoboto text-sm border-[var(--main-arci)] text-[var(--main-arci)] hover:bg-[var(--main-arci)] hover:text-white"
            onClick={closeModal}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      )}
      
      {/* Mensaje de información */}
      {!isLoading && !error && !success && (
        <p className="text-xs text-[var(--dark-gray)] text-center mt-4 max-w-xs fontRoboto">
          {status === 'sent_subscription' 
            ? 'Se creará un nuevo usuario y se enviará email de registro completo'
            : 'Se enviará un email de invitación al sitio web'
          }
        </p>
      )}
    </div>
  );
}