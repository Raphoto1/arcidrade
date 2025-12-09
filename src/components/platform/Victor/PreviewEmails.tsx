'use client';

import React, { useState } from 'react';

export default function PreviewEmails() {
  const [selectedEmail, setSelectedEmail] = useState<'invitation' | 'mass' | 'reminder'>('invitation');
  const [showPreview, setShowPreview] = useState(false);

  const getMockData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const referCode = 'example-refer-code-123';
    const completeRegistrationUrl = `${baseUrl}/completeInvitation/${referCode}`;
    
    return { completeRegistrationUrl, referCode };
  };

  const { completeRegistrationUrl } = getMockData();

  // Template de invitación simple
  const invitationTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Cuenta</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(56, 76, 155, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #384c9b;
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 20px;
        }
        .section {
            margin: 20px 0;
            line-height: 1.6;
            color: #333;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #384c9b 0%, #5a6dbd 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invitación a ARCIDRADE</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            
            <div class="section">
                <p>Has recibido una invitación para unirte a <strong>ARCIDRADE</strong>, la plataforma líder que conecta profesionales, instituciones y oportunidades de desarrollo.</p>
            </div>

            <div class="section">
                <p>Para completar tu registro y acceder a todas las oportunidades, haz clic en el botón de abajo:</p>
                <center><a href="${completeRegistrationUrl}" class="cta-button">Completar mi Registro</a></center>
            </div>

            <div class="section">
                <p><strong>¿Por qué unirte a ARCIDRADE?</strong></p>
                <ul>
                    <li>Descubre oportunidades profesionales exclusivas</li>
                    <li>Conecta con otros profesionales y expande tu red</li>
                    <li>Impulsa tu carrera al siguiente nivel</li>
                    <li>Obtén reconocimiento en tu área</li>
                </ul>
            </div>

            <div class="footer">
                <p>© 2025 ARCIDRADE. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;

  // Template de invitación masiva
  const massInvitationTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitación Especial</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(56, 76, 155, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #384c9b 0%, #5a6dbd 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 20px;
        }
        .section {
            margin: 20px 0;
            line-height: 1.6;
            color: #333;
        }
        .highlight {
            background: #f0f3ff;
            padding: 15px;
            border-left: 4px solid #384c9b;
            border-radius: 4px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #384c9b 0%, #5a6dbd 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Te Han Invitado a Unirte a ARCIDRADE!</h1>
        </div>
        <div class="content">
            <p>¡Hola Juan!</p>
            
            <div class="section">
                <p>Tenemos el placer de invitarte a unirte a <strong>ARCIDRADE</strong>. Sabemos que formas parte de <strong>Universidad Nacional</strong>, y creemos que nuestra plataforma puede ser una herramienta valiosa para ti y tu institución.</p>
            </div>

            <div class="highlight">
                <p><strong>¿Qué obtendrás?</strong></p>
                <ul style="margin: 10px 0;">
                    <li>Acceso a oportunidades laborales exclusivas</li>
                    <li>Networking con profesionales de tu área</li>
                    <li>Desarrollo profesional continuo</li>
                    <li>Visibilidad en el mercado laboral</li>
                </ul>
            </div>

            <div class="section">
                <p>Completa tu registro ahora y comienza a explorar las oportunidades que te esperan:</p>
                <center><a href="${completeRegistrationUrl}" class="cta-button">Crear mi Cuenta</a></center>
            </div>

            <div class="footer">
                <p>© 2025 ARCIDRADE. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;

  // Template de recordatorio de invitación pendiente
  const reminderTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Completa tu Suscripción - ARCIDRADE</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(56, 76, 155, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #384c9b 0%, #5a6dbd 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 20px;
        }
        .section {
            margin: 20px 0;
            line-height: 1.6;
            color: #333;
        }
        .section h2 {
            color: #384c9b;
            font-size: 18px;
            margin: 20px 0 10px 0;
        }
        .processes-list {
            background: #f0f3ff;
            padding: 15px;
            border-left: 4px solid #384c9b;
            border-radius: 4px;
            margin: 15px 0;
        }
        .processes-list ul {
            margin: 0;
            padding-left: 20px;
            list-style-type: none;
        }
        .processes-list li {
            margin: 8px 0;
            color: #333;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #384c9b 0%, #5a6dbd 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Completa tu Suscripción!</h1>
        </div>
        <div class="content">
            <div class="section">
                <p>Hola,</p>
                <p>Notamos que aún no has completado tu suscripción en <strong>ARCIDRADE</strong>. Te invitamos a finalizar el proceso para acceder a todas las oportunidades disponibles.</p>
            </div>

            <div class="section">
                <h2>📋 Procesos Disponibles</h2>
                <p>Aquí están algunas de las oportunidades más destacadas:</p>
                <div class="processes-list">
                    <ul>
                        <li>1. Desarrollador Full Stack Senior</li>
                        <li>2. Especialista en DevOps</li>
                        <li>3. Arquitecto de Soluciones</li>
                    </ul>
                </div>
                <p style="text-align: center; color: #666; font-size: 14px; margin-top: 15px;">
                    <em>Estas son solo algunas de las ofertas disponibles. Ingresa para ver todas las oportunidades.</em>
                </p>
            </div>

            <div class="section">
                <p>Completa tu registro ahora y accede a todas las oportunidades laborales que te esperan.</p>
                <center><a href="${completeRegistrationUrl}" class="cta-button">Completar Suscripción</a></center>
            </div>

            <div class="footer">
                <p>© 2025 ARCIDRADE. Todos los derechos reservados.</p>
                <p>Este es un correo automático, por favor no responder directamente.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;

  const renderPreview = () => {
    if (selectedEmail === 'invitation') {
      return invitationTemplate;
    } else if (selectedEmail === 'mass') {
      return massInvitationTemplate;
    } else {
      return reminderTemplate;
    }
  };

  return (
    <div className='flex flex-col gap-4 p-4 w-full'>
      <div>
        <h3 className='text-lg font-semibold mb-3 text-gray-800'>Selecciona un Email para Previsualizar</h3>
        
        <div className='flex flex-col gap-2 mb-4'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              value='invitation'
              checked={selectedEmail === 'invitation'}
              onChange={(e) => setSelectedEmail(e.target.value as any)}
              className='w-4 h-4'
            />
            <span className='text-gray-700'>Invitación Simple</span>
          </label>
          
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              value='mass'
              checked={selectedEmail === 'mass'}
              onChange={(e) => setSelectedEmail(e.target.value as any)}
              className='w-4 h-4'
            />
            <span className='text-gray-700'>Invitación Masiva</span>
          </label>

          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              value='reminder'
              checked={selectedEmail === 'reminder'}
              onChange={(e) => setSelectedEmail(e.target.value as any)}
              className='w-4 h-4'
            />
            <span className='text-gray-700'>Recordatorio de Invitación Pendiente</span>
          </label>
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200'
        >
          {showPreview ? 'Ocultar Previsualización' : 'Ver Previsualización'}
        </button>
      </div>

      {showPreview && (
        <div className='bg-white border-2 border-gray-300 rounded-lg overflow-hidden'>
          <div className='bg-gray-100 p-2 border-b border-gray-300 text-sm text-gray-600'>
            <p>Previsualización del Email: <span className='font-semibold'>{selectedEmail === 'invitation' ? 'Invitación Simple' : selectedEmail === 'mass' ? 'Invitación Masiva' : 'Recordatorio Pendiente'}</span></p>
          </div>
          <iframe
            srcDoc={renderPreview()}
            className='w-full border-0'
            style={{ height: '600px' }}
            title='Email Preview'
          />
        </div>
      )}
    </div>
  );
}
