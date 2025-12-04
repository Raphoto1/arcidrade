/**
 * Plantilla HTML para email de invitación masiva (con datos personalizados)
 */
export function getMassInvitationTemplate(
  completeRegistrationUrl: string,
  greeting: string = '¡Hola!',
  institutionMention: string = ''
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitación a Arcidrade</title>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(56, 76, 155, 0.1); overflow: hidden; }
        .header { background-color: #384c9b; color: #ffffff; padding: 30px 20px; text-align: center; }
        .logo { width: 120px; height: auto; margin-bottom: 15px; background-color: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 8px; }
        .header h2 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
        .content { padding: 30px 25px; line-height: 1.6; color: #333333; }
        .content p { margin-bottom: 16px; font-size: 16px; }
        .highlight-box { background-color: #e3f2fd; border-left: 4px solid #384c9b; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .benefits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .benefit-item { background-color: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #e9ecef; }
        .benefit-icon { font-size: 24px; margin-bottom: 8px; }
        .footer { background-color: #384c9b; color: #ffffff; padding: 25px 20px; text-align: center; border-top: 3px solid #e94936; }
        .footer p { margin: 8px 0; }
        .contact-info { background-color: #bcceec; color: #384c9b; padding: 10px; border-radius: 6px; margin: 10px 0; font-weight: 600; }
        @media (max-width: 600px) { .benefits-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://arcidrade.com/logos/Logo Arcidrade Full.png" alt="Arcidrade Logo" class="logo" />
            <h2>¡Te han invitado a Arcidrade!</h2>
        </div>
        <div class="content">
            <p><strong>${greeting}</strong></p>
            <p>Has recibido una invitación especial para formar parte de <strong>Arcidrade</strong>, la plataforma líder que conecta profesionales, instituciones y oportunidades de desarrollo.</p>
            ${institutionMention}
            <div class="highlight-box">
                <h3 style="margin-top: 0; color: #384c9b;">🚀 ¿Por qué unirte a Arcidrade?</h3>
                <div class="benefits-grid">
                    <div class="benefit-item"><div class="benefit-icon">🎯</div><strong>Oportunidades</strong><br><small>Descubre proyectos y colaboraciones</small></div>
                    <div class="benefit-item"><div class="benefit-icon">🤝</div><strong>Networking</strong><br><small>Conecta con profesionales</small></div>
                    <div class="benefit-item"><div class="benefit-icon">📈</div><strong>Crecimiento</strong><br><small>Impulsa tu carrera profesional</small></div>
                    <div class="benefit-item"><div class="benefit-icon">🏆</div><strong>Reconocimiento</strong><br><small>Destaca tus logros</small></div>
                </div>
            </div>
            <p><strong>✨ Completa tu registro ahora mismo:</strong></p>
            <div style="text-align: center; margin: 25px 0;">
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                    <tr>
                        <td style="border-radius: 8px; background-color: #384c9b;">
                            <a href="${completeRegistrationUrl}" target="_blank" style="display: inline-block; padding: 18px 35px; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 18px; font-family: Arial, sans-serif; text-align: center; border-radius: 8px; mso-padding-alt: 0;">
                                <span style="color: #ffffff !important; text-decoration: none; font-weight: 700;">🚀 Completar Mi Registro</span>
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            <div style="text-align: center; margin: 15px 0; font-size: 14px; color: #666;">
                <p>¿No puedes ver el botón? Copia y pega este enlace en tu navegador:</p>
                <a href="${completeRegistrationUrl}" style="color: #384c9b; font-weight: bold; text-decoration: underline; word-break: break-all;" target="_blank">${completeRegistrationUrl}</a>
            </div>
            <p>Este enlace es <strong>seguro y personalizado</strong> para ti. Te llevará directamente a completar tu perfil en nuestra plataforma.</p>
            <p><strong>¡No pierdas esta oportunidad de formar parte de nuestra comunidad!</strong></p>
        </div>
        <div class="footer">
            <p><strong>🎉 ¡Bienvenido a Arcidrade!</strong></p>
            <p>Tu futuro profesional comienza aquí. Si tienes alguna pregunta, estamos aquí para ayudarte.</p>
            <div class="contact-info"><p>📧 contacto@arcidrade.com | 🌐 www.arcidrade.com</p></div>
        </div>
    </div>
</body>
</html>`;
}
