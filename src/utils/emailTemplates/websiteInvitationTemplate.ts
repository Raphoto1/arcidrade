/**
 * Plantilla HTML para email de invitación desde website (sin registro)
 */
export function getWebsiteInvitationTemplate(
  websiteUrl: string,
  greeting: string,
  institutionMessage: string
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Descubre ARCIDRADE</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #384c9b;
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
            border-bottom: 4px solid #e94936;
        }
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 15px;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 8px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.95;
            color: #ffffff;
        }
        .content {
            background-color: #ffffff;
            padding: 30px 25px;
            line-height: 1.6;
            color: #333333;
        }
        .content p {
            margin-bottom: 16px;
            font-size: 16px;
        }
        .cta-button {
            display: inline-block;
            background-color: #e94936;
            color: #ffffff;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: background-color 0.3s ease;
        }
        .cta-button:hover {
            background-color: #c93a29;
        }
        .benefits {
            background-color: #f8f9fa;
            border-left: 4px solid #384c9b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .benefits h3 {
            margin-top: 0;
            color: #384c9b;
            font-size: 18px;
        }
        .benefits ul {
            margin: 12px 0;
            padding-left: 20px;
        }
        .benefits li {
            margin-bottom: 10px;
            font-size: 15px;
            color: #555555;
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
            padding: 15px;
            border-radius: 4px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://arcidrade.com/logos/Logo Arcidrade Full.png" alt="Arcidrade Logo" class="logo" />
            <h1>🌐 Conoce ARCIDRADE</h1>
            <p>La plataforma que conecta profesionales y oportunidades</p>
        </div>
        
        <div class="content">
            <p><strong>${greeting},</strong></p>
            
            ${institutionMessage ? `<p>${institutionMessage}</p>` : ''}
            
            <p>Te invitamos a conocer <strong>ARCIDRADE</strong>, la plataforma líder que conecta profesionales, instituciones y oportunidades de desarrollo profesional.</p>
            
            <div class="benefits">
                <h3>¿Por qué ARCIDRADE?</h3>
                <ul>
                    <li>🎯 <strong>Descubre oportunidades profesionales</strong> adaptadas a tu perfil</li>
                    <li>🤝 <strong>Conecta con otros profesionales</strong> y expande tu red</li>
                    <li>📈 <strong>Impulsa tu carrera</strong> con herramientas especializadas</li>
                    <li>🏆 <strong>Obtén reconocimiento</strong> por tus logros</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="${websiteUrl}" class="cta-button">✨ Visitar ARCIDRADE</a>
            </div>
            
            <p>Únete a nuestra comunidad y explora todo lo que tenemos para ofrecerte.</p>
            
            <p style="color: #888888; font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Has recibido este email porque creemos que ARCIDRADE puede ser de tu interés. Si no deseas recibir más comunicaciones, puedes ignorar este mensaje.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>ARCIDRADE</strong> - Conectando Talento y Oportunidades</p>
            <div class="contact-info">
                <p>📧 contacto@arcidrade.com | 🌐 www.arcidrade.com</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}
