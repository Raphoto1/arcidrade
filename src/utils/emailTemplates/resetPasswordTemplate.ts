/**
 * Plantilla HTML para email de reset de contraseña
 * Migrado desde sendMail.ts - sendResetPasswordMail()
 */
export function getResetPasswordTemplate(resetPasswordUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña</title>
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
            background-color: #e94936;
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
        .warning-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #e94936;
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
            <h2>🔒 Recuperación de Contraseña</h2>
        </div>
        <div class="content">
            <p><strong>¡Hola!</strong></p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en ARCIDRADE. Si no fuiste tú quien realizó esta solicitud, puedes ignorar este email.</p>
            
            <!-- Botón compatible con todos los clientes de email -->
            <div style="text-align: center; margin: 25px 0;">
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                    <tr>
                        <td style="border-radius: 8px; background-color: #e94936;">
                            <a href="${resetPasswordUrl}" target="_blank" style="
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
                                    🔑 Restablecer Contraseña
                                </span>
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Fallback para clientes que no soporten el botón -->
            <div style="text-align: center; margin: 10px 0; font-size: 14px; color: #666;">
                <p>¿No ve el botón? Use este enlace:</p>
                <a href="${resetPasswordUrl}" style="color: #e94936; font-weight: bold; text-decoration: underline;" target="_blank">
                    ${resetPasswordUrl}
                </a>
            </div>

            <div class="warning-box">
                <p><strong>⚠️ Importante:</strong></p>
                <ul>
                    <li>Este enlace es válido por tiempo limitado</li>
                    <li>Solo puede usarse una vez</li>
                    <li>Si no solicitaste este cambio, contacta a soporte inmediatamente</li>
                </ul>
            </div>
            
            <p>Este enlace te dirigirá a una página segura donde podrás establecer una nueva contraseña para tu cuenta.</p>
        </div>
        <div class="footer">
            <p><strong>🔐 Seguridad en ARCIDRADE</strong></p>
            <p>Si tienes alguna pregunta sobre la seguridad de tu cuenta, no dudes en contactarnos.</p>
            <div class="contact-info">
                <p>📧 contacto@arcidrade.com</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}
