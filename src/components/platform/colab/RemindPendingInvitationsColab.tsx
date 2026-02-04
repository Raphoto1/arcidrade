'use client';
import React, { useState } from 'react';

export default function RemindPendingInvitationsColab() {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleRemind = async () => {
    setIsSending(true);
    setResult('');

    try {
      const response = await fetch('/api/platform/colab/remind-invitations', {
        method: 'POST',
      });

      const data = await response.json();
      if (response.ok) {
        setResult(`✅ ${data.message || 'Recordatorios enviados'}`);
      } else {
        setResult(`❌ Error: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      setResult('❌ Error de conexión');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">🔔 Recordar Invitaciones Pendientes</h1>
        <p className="text-gray-600 mb-4">Enviar recordatorios a usuarios con invitaciones pendientes</p>
        
        <button
          onClick={handleRemind}
          disabled={isSending}
          className="btn bg-[var(--soft-arci)] text-white w-full"
        >
          {isSending ? 'Enviando...' : 'Enviar Recordatorios'}
        </button>
        
        {result && (
          <div className={`alert mt-4 ${result.includes('✅') ? 'alert-success' : 'alert-error'}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
