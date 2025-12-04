/**
 * Plantilla HTML para email de contacto con administrador
 * Migrado desde sendMail.ts - sendContactAdminMail()
 */

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function getContactAdminTemplate(contactData: ContactFormData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contacto con Administrador</title>
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
            background-color: #e94936;
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
            background: url('https://arcidrade.com/logos/Logo Arcidrade Full.png') no-repeat center top;
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
        }
        .content p {
            font-size: 16px;
            color: #2c3e50;
            margin: 16px 0;
            line-height: 1.6;
        }
        .alert-box {
            background-color: #fff3cd;
            padding: 24px;
            border-radius: 12px;
            margin: 24px 0;
            border-left: 4px solid #e94936;
            box-shadow: 0 2px 8px rgba(233, 73, 54, 0.08);
        }
        .alert-box h3 {
            margin: 0 0 16px 0;
            color: #e94936;
            font-size: 18px;
            font-weight: 600;
        }
        .contact-info {
            background-color: #f8f9fc;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #d0ddf7;
            margin: 24px 0;
            text-align: center;
        }
        .contact-info h3 {
            margin: 0 0 20px 0;
            color: #384c9b;
            font-size: 20px;
            font-weight: 600;
        }
        .contact-item {
            background: #384c9b;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 10px 0;
            display: inline-block;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        .contact-item:hover {
            background: #2c3e87;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(56, 76, 155, 0.3);
        }
        .instructions {
            background-color: #e8f0ff;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .instructions h4 {
            margin: 0 0 12px 0;
            color: #384c9b;
            font-size: 16px;
            font-weight: 600;
        }
        .instructions ul {
            margin: 0;
            padding-left: 20px;
            color: #2c3e50;
        }
        .instructions li {
            margin: 8px 0;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📞 Contacto Requerido</h1>
            <p>Necesitamos hablar contigo personalmente</p>
        </div>
        <div class="content">
            <p>Hola <strong>${contactData.name}</strong>,</p>
            <p>Gracias por tu interés en <strong>ARCIDRADE</strong>. Hemos revisado tu solicitud y necesitamos hablar contigo personalmente para poder avanzar con el proceso.</p>
            
            <div class="alert-box">
                <h3>⚠️ Acción Requerida</h3>
                <p>Para completar tu solicitud y brindarte la mejor atención personalizada, necesitamos que te pongas en contacto directamente con nuestro administrador.</p>
            </div>
            
            <div class="contact-info">
                <h3>📧 Información de Contacto</h3>
                <p>Por favor, comunícate con nuestro administrador a través de:</p>
                <div style="margin: 20px 0;">
                    <a href="mailto:info@arcidrade.com" class="contact-item">
                        📧 info@arcidrade.com
                    </a>
                </div>
                <div style="margin: 20px 0;">
                    <a href="mailto:contacto@arcidrade.com" class="contact-item">
                        📧 contacto@arcidrade.com
                    </a>
                </div>
            </div>
            
            <div class="instructions">
                <h4>📋 Al contactarte, por favor incluye:</h4>
                <ul>
                    <li>Tu nombre completo: <strong>${contactData.name}</strong></li>
                    <li>Tu email: <strong>${contactData.email}</strong></li>
                    ${contactData.phone ? `<li>Tu teléfono: <strong>${contactData.phone}</strong></li>` : ''}
                    <li>Referencia: "Solicitud de contacto desde ARCIDRADE"</li>
                    <li>Una breve descripción de tu consulta o solicitud</li>
                </ul>
            </div>
            
            <p>Nuestro administrador se encargará de revisar tu caso personalmente y te proporcionará toda la información que necesitas para continuar con el proceso.</p>
            
            <p><strong>Tiempo de respuesta:</strong> Normalmente respondemos en 24-48 horas laborables.</p>
        </div>
        <div class="footer">
            <div class="logo-text">ARCIDRADE</div>
            <p>Conectando talento médico con oportunidades excepcionales</p>
            <p>📧 contacto@arcidrade.com | 🌐 www.arcidrade.com</p>
        </div>
    </div>
</body>
</html>`;
}
