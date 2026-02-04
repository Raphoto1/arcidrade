'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trackInvitationSent } from '@/utils/analytics';

interface ContactData {
  nombre: string;
  email: string;
}

export default function GenerateSingleInvitationColab() {
  const { data: session } = useSession();
  const [contact, setContact] = useState<ContactData>({ nombre: '', email: '' });
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!contact.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!contact.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!isValidEmail(contact.email)) {
      newErrors.email = 'El email no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendInvitation = async () => {
    if (!validateForm()) return;
    setIsSending(true);
    setLastResult(null);

    try {
      const response = await fetch('/api/platform/colab/mass-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contact.email, nombre: contact.nombre }),
      });

      if (response.ok) {
        setLastResult({ success: true, message: `✅ Invitación enviada exitosamente a ${contact.email}` });
        trackInvitationSent('colab_website_invitation');
        setContact({ nombre: '', email: '' });
      } else {
        const errorData = await response.json();
        setLastResult({ success: false, message: `❌ Error: ${errorData.message || 'Error desconocido'}` });
      }
    } catch (error) {
      setLastResult({ success: false, message: '❌ Error de conexión. Por favor intenta de nuevo.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">📧 Enviar Invitación Individual</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              value={contact.nombre}
              onChange={(e) => setContact(prev => ({ ...prev, nombre: e.target.value }))}
              className={`input input-bordered w-full ${errors.nombre ? 'input-error' : ''}`}
              placeholder="Juan Pérez"
            />
            {errors.nombre && <p className="text-error text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              id="email"
              value={contact.email}
              onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
          </div>

          <button 
            onClick={sendInvitation}
            disabled={isSending}
            className="btn bg-(--soft-arci) text-white w-full"
          >
            {isSending ? 'Enviando...' : 'Enviar Invitación'}
          </button>

          {lastResult && (
            <div className={`alert ${lastResult.success ? 'alert-success' : 'alert-error'}`}>
              {lastResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
