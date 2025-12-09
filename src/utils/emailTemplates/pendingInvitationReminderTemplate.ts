/**
 * Plantilla HTML para email de recordatorio de invitación pendiente
 */
export function getPendingInvitationReminderTemplate(
  completeRegistrationUrl: string,
  topProcesses: Array<{ id: number; position: string }>
): string {
  const processesHTML = topProcesses
    .map(
      (process, index) =>
        `<li style="margin: 8px 0; color: #333;">${index + 1}. ${process.position}</li>`
    )
    .join('');

  return `<!DOCTYPE html>
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
        .section p {
            margin: 10px 0;
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
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #384c9b 0%, #5a6dbd 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(56, 76, 155, 0.3);
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            margin: 5px 0;
        }
        strong {
            color: #384c9b;
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
                        ${processesHTML}
                    </ul>
                </div>
                <p style="text-align: center; color: #666; font-size: 14px; margin-top: 15px;">
                    <em>Estas son solo algunas de las ofertas disponibles. Ingresa para ver todas las oportunidades.</em>
                </p>
            </div>

            <div class="section">
                <p>Completa tu registro ahora y accede a todas las oportunidades laborales que te esperan.</p>
                <center>
                    <a href="${completeRegistrationUrl}" class="cta-button">Completar Suscripción</a>
                </center>
            </div>

            <div class="section">
                <p>Si tienes preguntas, no dudes en contactarnos a <strong>contacto@arcidrade.com</strong></p>
            </div>
        </div>

        <div class="footer">
            <p>© 2025 ARCIDRADE. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder directamente.</p>
        </div>
    </div>
</body>
</html>`;
}
