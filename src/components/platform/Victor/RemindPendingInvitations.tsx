'use client';

import React, { useState } from 'react';

export default function RemindPendingInvitations() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendReminders = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/platform/victor/remind-pending-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar recordatorios');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-4 md:justify-center md:h-auto'>
      <div className='pb-2'>
        <h2 className='text-2xl fontArci text-center'>Recordar Invitaciones Pendientes</h2>
      </div>

      <div className='w-full max-w-lg mx-auto'>
        <p className='text-gray-700 text-center mb-4'>
          Envía recordatorios a los usuarios que aún no han completado su suscripción, 
          mostrando los 3 procesos más recientes disponibles.
        </p>

        <button
          onClick={handleSendReminders}
          disabled={isLoading}
          className='btn bg-[var(--main-arci)] text-white w-full mb-4 disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <span className='loading loading-spinner loading-sm'></span>
              Enviando...
            </>
          ) : (
            'Enviar Recordatorios'
          )}
        </button>

        {error && (
          <div className='alert alert-error mb-4'>
            <svg className='stroke-current shrink-0 h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2' />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className='alert alert-success mb-4'>
            <svg className='stroke-current shrink-0 h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <div>
              <h3 className='font-bold'>{result.message}</h3>
              <div className='text-xs mt-2'>
                <p>Enviados: <strong>{result.sent}</strong> de <strong>{result.total}</strong></p>
                {result.failed && result.failed.length > 0 && (
                  <p className='text-red-600 mt-2'>Errores: {result.failed.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='bg-white p-4 rounded border border-gray-300'>
          <h3 className='font-bold mb-2 text-gray-700'>Información:</h3>
          <ul className='text-sm text-gray-600 space-y-1'>
            <li>✓ Se enviarán correos a usuarios con status "invited"</li>
            <li>✓ Se mostrarán los 3 procesos más recientes</li>
            <li>✓ Incluye enlace directo para completar suscripción</li>
            <li>✓ Plantilla responsiva con marca ARCIDRADE</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
