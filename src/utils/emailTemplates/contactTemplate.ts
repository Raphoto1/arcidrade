/**
 * Plantillas HTML para emails de contacto
 * Migrado desde sendMail.ts - sendContactMail()
 */

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Plantilla para notificación al administrador
 */
export function getContactAdminNotificationTemplate(contactData: ContactFormData, subjectText: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Mensaje de Contacto</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(56, 76, 155, 0.15);
            overflow: hidden;
        }
        .header {
            background-color: #384c9b;
            color: #ffffff;
            padding: 32px 20px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('https://arcidrade.com/logo-white.png') no-repeat center;
            background-size: 120px auto;
            opacity: 0.1;
        }
        .header h2 {
            margin: 0 0 8px 0;
            font-size: 26px;
            font-weight: 600;
            position: relative;
            z-index: 1;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            color: #ffffff;
        }
        .content {
            padding: 40px 30px;
        }
        .field {
            margin-bottom: 24px;
            padding: 20px;
            background-color: #f8f9fc;
            border-radius: 10px;
            border-left: 4px solid #384c9b;
            box-shadow: 0 2px 8px rgba(56, 76, 155, 0.08);
        }
        .field:last-child {
            margin-bottom: 0;
        }
        .label {
            font-weight: 600;
            color: #384c9b;
            display: block;
            margin-bottom: 8px;
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            color: #2c3e50;
            line-height: 1.6;
            font-size: 16px;
        }
        .message-box {
            background-color: #e8f0ff;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #d0ddf7;
            margin-top: 10px;
        }
        .footer {
            background-color: #e8f0ff;
            padding: 24px;
            text-align: center;
            color: #5a6c7d;
            font-size: 14px;
            border-top: 1px solid #e8f0ff;
        }
        .footer p {
            margin: 8px 0;
        }
        .priority-high {
            background-color: #fff5f5;
            border-left-color: #e94936;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 Nuevo Mensaje de Contacto</h2>
            <p>Formulario de contacto - ARCIDRADE</p>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">👤 Nombre:</span>
                <span class="value">${contactData.name}</span>
            </div>
            
            <div class="field">
                <span class="label">📧 Email:</span>
                <span class="value">${contactData.email}</span>
            </div>
            
            ${
              contactData.phone
                ? `
            <div class="field">
                <span class="label">📱 Teléfono:</span>
                <span class="value">${contactData.phone}</span>
            </div>
            `
                : ""
            }
            
            <div class="field ${subjectText.includes("Técnico") ? "priority-high" : ""}">
                <span class="label">📋 Asunto:</span>
                <span class="value">${subjectText}</span>
            </div>
            
            <div class="field">
                <span class="label">💬 Mensaje:</span>
                <div class="message-box">
                    <span class="value">${contactData.message.replace(/\n/g, "<br>")}</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <p><strong>📧 Mensaje enviado desde ARCIDRADE</strong></p>
            <p>🕒 Recibido el ${new Date().toLocaleString("es-ES", {
              timeZone: "America/New_York",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p style="margin-top: 16px; color: #384c9b; font-weight: 600;">
                Responder directamente a: ${contactData.email}
            </p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Plantilla para confirmación al usuario
 */
export function getContactTemplate(contactData: ContactFormData, subjectText: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Contacto</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(56, 76, 155, 0.15);
            overflow: hidden;
        }
        .header {
            background-color: #384c9b;
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('https://arcidrade.com/logo-white.png') no-repeat center top;
            background-size: 100px auto;
            opacity: 0.1;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
            position: relative;
            z-index: 1;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            color: #ffffff;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #2c3e50;
            margin: 16px 0;
        }
        .message-summary {
            background-color: #e8f0ff;
            padding: 24px;
            border-radius: 12px;
            margin: 24px 0;
            border: 1px solid #d0ddf7;
            box-shadow: 0 2px 8px rgba(56, 76, 155, 0.08);
        }
        .message-summary h3 {
            margin: 0 0 16px 0;
            color: #384c9b;
            font-size: 18px;
            font-weight: 600;
        }
        .message-summary p {
            margin: 8px 0;
            color: #2c3e50;
        }
        .info-box {
            background-color: #f8f9fc;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #e94936;
            margin: 20px 0;
            text-align: left;
        }
        .info-box p {
            margin: 8px 0;
            color: #2c3e50;
        }
        .btn {
            display: inline-block;
            background-color: #e94936;
            color: white !important;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 10px;
            margin: 24px 0;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(233, 73, 54, 0.3);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(233, 73, 54, 0.4);
        }
        .footer {
            background-color: #384c9b;
            color: #ffffff;
            padding: 32px 20px;
            text-align: center;
        }
        .footer p {
            margin: 8px 0;
            color: #ffffff !important;
        }
        .footer .logo-text {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .contact-info {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ ¡Gracias por contactarnos!</h1>
            <p>Tu mensaje ha sido recibido exitosamente</p>
        </div>
        <div class="content">
            <p>Hola <strong>${contactData.name}</strong>,</p>
            <p>Gracias por ponerte en contacto con <strong>ARCIDRADE</strong>. Hemos recibido tu mensaje sobre <strong>"${subjectText}"</strong> y nuestro equipo te responderá lo antes posible.</p>
            
            <div class="message-summary">
                <h3>📋 Resumen de tu consulta</h3>
                <p><strong>Asunto:</strong> ${subjectText}</p>
                <p><strong>Fecha de envío:</strong> ${new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
            </div>
            
            <div class="info-box">
                <p>⏱️ <strong>Tiempo de respuesta habitual:</strong> 24-48 horas laborables</p>
                <p>📧 <strong>Para consultas urgentes:</strong> contacto@arcidrade.com</p>
                <p>🔄 <strong>Seguimiento:</strong> Te notificaremos por este mismo email cuando tengamos una respuesta</p>
            </div>
            
            <a href="${process.env.PLAT_URL || "https://arcidrade.com"}" class="btn">🏠 Visitar ARCIDRADE</a>
        </div>
        <div class="footer">
            <div class="logo-text">ARCIDRADE</div>
            <p>Conectando talento médico con oportunidades excepcionales</p>
            <div class="contact-info">
                <p>📧 contacto@arcidrade.com</p>
                <p>🌐 www.arcidrade.com</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}
