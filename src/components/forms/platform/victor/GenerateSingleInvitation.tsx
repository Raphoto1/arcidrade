'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trackInvitationSent } from '@/utils/analytics';

interface ContactData {
  nombre: string;
  email: string;
}

export default function GenerateSingleInvitation() {
  const { data: session } = useSession();
  const [contact, setContact] = useState<ContactData>({ nombre: '', email: '' });
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Determinar si el usuario es Campaign
  const isCampaignUser = session?.user?.area === 'campaign';

  // Función para validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!contact.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!contact.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!isValidEmail(contact.email)) {
      newErrors.email = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (field: keyof ContactData, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }));
    // Limpiar el error de este campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Función para enviar la invitación
  const sendInvitation = async () => {
    if (!validateForm()) return;

    setIsSending(true);
    setLastResult(null);

    try {
      const response = await fetch('/api/platform/victor/mass-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contact.email,
          nombre: contact.nombre,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const successMessage = isCampaignUser && responseData.leadRegistered
          ? `✅ Invitación enviada y lead registrado exitosamente para ${contact.email}`
          : `✅ Invitación enviada exitosamente a ${contact.email}`;
          
        setLastResult({
          success: true,
          message: successMessage
        });
        
        // Track analytics
        trackInvitationSent(isCampaignUser ? 'campaign_website_invitation' : 'victor_website_invitation');
        
        // Limpiar el formulario después del envío exitoso
        setContact({ nombre: '', email: '' });
      } else {
        const errorData = await response.json();
        setLastResult({
          success: false,
          message: `❌ Error: ${errorData.message || 'Error desconocido'}`
        });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setLastResult({
        success: false,
        message: '❌ Error de conexión. Por favor intenta de nuevo.'
      });
    } finally {
      setIsSending(false);
    }
  };

  // Función para limpiar el formulario
  const resetForm = () => {
    setContact({ nombre: '', email: '' });
    setErrors({});
    setLastResult(null);
  };

  // Manejar envío con Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending) {
      sendInvitation();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 Enviar Invitación Individual
          </h1>
          <p className="text-gray-600">
            Envía una invitación personalizada a un usuario para unirse a la plataforma ARCIDRADE.
          </p>
          {session?.user?.email && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Enviando desde:</strong> no_reply@arcidrade.com ({session.user.area})
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-6">
            {/* Nombre Field */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                value={contact.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Juan Pérez García"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.nombre 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isSending}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                value={contact.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: juan.perez@empresa.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isSending}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={sendInvitation}
                disabled={isSending || !contact.nombre.trim() || !contact.email.trim()}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando invitación...</span>
                  </span>
                ) : (
                  '🚀 Enviar Invitación'
                )}
              </button>
              
              <button
                onClick={resetForm}
                disabled={isSending}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                🔄 Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Result Message */}
        {lastResult && (
          <div className={`rounded-lg shadow-sm border p-6 mb-6 ${
            lastResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-medium ${
              lastResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastResult.message}
            </p>
            
            {lastResult.success && (
              <div className="mt-3 text-sm text-green-700">
                <p>La persona recibirá un correo con las instrucciones para acceder a la plataforma.</p>
                {isCampaignUser && (
                  <p>• El lead ha sido registrado automáticamente en tu campaña.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ ¿Qué sucede después?</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• El usuario recibirá un correo electrónico con las instrucciones de acceso</p>
            <p>• Podrá crear su cuenta y completar su perfil profesional</p>
            <p>• Tendrá acceso a todas las funcionalidades de la plataforma ARCIDRADE</p>
            {isCampaignUser ? (
              <>
                <p>• <strong>Lead automático:</strong> Se registrará en tu campaña para seguimiento</p>
                <p>• <strong>Panel Campaign:</strong> Podrás ver el progreso desde tu dashboard</p>
              </>
            ) : (
              <p>• Podrás rastrear su progreso desde el panel de administración</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">⚡ Acciones rápidas</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Enter:</strong> Enviar invitación</p>
            <p>• <strong>Campos obligatorios:</strong> Nombre y Email</p>
            <p>• <strong>Validación automática:</strong> Formato de email verificado</p>
          </div>
        </div>
      </div>
    </div>
  );
}