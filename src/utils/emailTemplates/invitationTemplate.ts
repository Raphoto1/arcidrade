/**
 * Plantilla HTML para email de invitación individual
 */
export function getInvitationTemplate(completeRegistrationUrl: string): string {
  return `<!DOCTYPE html>
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
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 15px;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 8px;
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .content {
            padding: 30px 25px;
            line-height: 1.6;
            color: #333333;
        }
        .content p {
            margin-bottom: 16px;
            font-size: 16px;
        }
        .footer {
            background-color: #384c9b;
            color: #ffffff;
            padding: 25px 20px;
            text-align: center;
            border-top: 3px solid #e94936;
        }
        .footer p {
            margin: 8px 0;
        }
        .contact-info {
            background-color: #bcceec;
            color: #384c9b;
            padding: 10px;
            border-radius: 6px;
            margin: 10px 0;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://arcidrade.com/logos/Logo Arcidrade Full.png" alt="Arcidrade Logo" class="logo" />
            <h2>Complete su registro en Arcidrade</h2>
        </div>
        <div class="content">
            <p><strong>¡Buen día!</strong></p>
            <p>Estamos emocionados de que esté interesado en unirse a nuestra comunidad profesional. Para completar el registro, por favor haga clic en el siguiente enlace:</p>
            
            <!-- Botón compatible con todos los clientes de email -->
            <div style="text-align: center; margin: 25px 0;">
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                    <tr>
                        <td style="border-radius: 8px; background-color: #384c9b;">
                            <a href="${completeRegistrationUrl}" target="_blank" style="
                                display: inline-block;
                                padding: 15px 30px;
                                color: #ffffff !important;
                                text-decoration: none;
                                font-weight: 600;
                                font-size: 16px;
                                font-family: Arial, sans-serif;
                                text-align: center;
                                border-radius: 8px;
                                mso-padding-alt: 0;
                            ">
                                <span style="color: #ffffff !important; text-decoration: none; font-weight: 600;">
                                    🔗 Completar Registro
                                </span>
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Fallback para clientes que no soporten el botón -->
            <div style="text-align: center; margin: 10px 0; font-size: 14px; color: #666;">
                <p>¿No ve el botón? Use este enlace:</p>
                <a href="${completeRegistrationUrl}" style="color: #384c9b; font-weight: bold; text-decoration: underline;" target="_blank">
                    ${completeRegistrationUrl}
                </a>
            </div>
            <p>Este enlace es seguro y lo dirigirá directamente a nuestro formulario de registro.</p>
        </div>
        <div class="footer">
            <p><strong>¡Bienvenido a Arcidrade!</strong></p>
            <p>Gracias por tu interés en nuestra comunidad. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            <div class="contact-info">
                <p>📧 contacto@arcidrade.com</p>
                <p>🌐 www.arcidrade.com</p>
            </div>
            <p style="font-size: 11px; margin-top: 16px; opacity: 0.7; color: #ffffff;">ARCIDRADE - Plataforma de conexión profesional</p>
            <p style="font-size: 11px; margin-top: 8px; opacity: 0.7; color: #ffffff;">Si no deseas recibir estos correos, <a href="mailto:contacto@arcidrade.com?subject=Unsubscribe" style="color: #bcceec; text-decoration: underline;">haz clic aquí</a></p>
        </div>
    </div>
</body>
</html>`;
}
