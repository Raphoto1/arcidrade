"use server";
import nodemailer from "nodemailer";
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
const NO_REPLY_MAIL = process.env.NO_REPLY_MAIL;
const NO_REPLY_MAIL_PASSWORD = process.env.NO_REPLY_MAIL_PASSWORD;
const MAIL_PORT = process.env.MAIL_PORT;

const SubjectInvitation = "Le han invitado a ARCIDRADE";

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: Number(MAIL_PORT) || 587,
  secure: Number(MAIL_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: NO_REPLY_MAIL,
    pass: NO_REPLY_MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendInvitationMail({ sendTo, referCode }: { sendTo?: string; referCode: string }) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error('SMTP transporter verification failed');
    }
  } catch (error) {
    console.error("Something Went Wrong", error);
    return;
  }

  // Construir URL de manera más robusta
  const baseUrl = process.env.PLAT_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const completeRegistrationUrl = `${baseUrl}/completeInvitation/${referCode}`;
  


  const info = await transporter.sendMail({
    from: NO_REPLY_MAIL,
    to: sendTo,
    subject: SubjectInvitation,
    text: `Con este Link podras continuar con tu registro`,
    html: `<!DOCTYPE html>
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
            background: linear-gradient(135deg, #384c9b 0%, #bcceec 100%);
            color: #ffffff;
            padding: 30px 20px;
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
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #384c9b 0%, #e94936 100%); background-color: #384c9b;">
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
            </div>
        </div>
    </div>
</body>
</html>`,
  });
  return info;
}

// Nueva función para invitaciones masivas CON registro - crea cuenta y envía invitación personalizada
export async function sendMassInvitationMail({ 
  sendTo, 
  referCode, 
  nombre, 
  apellido, 
  institucion 
}: { 
  sendTo: string; 
  referCode: string; 
  nombre?: string; 
  apellido?: string; 
  institucion?: string; 
}) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error('SMTP transporter verification failed');
    }
  } catch (error) {
    console.error("Something Went Wrong", error);
    return false;
  }

  // Construir URL de manera más robusta
  const baseUrl = process.env.PLAT_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const completeRegistrationUrl = `${baseUrl}/completeInvitation/${referCode}`;
  
  // Crear saludo personalizado
  let greeting = '¡Hola!';
  if (nombre || apellido) {
    const nameParts = [nombre, apellido].filter(Boolean);
    if (nameParts.length > 0) {
      greeting = `¡Hola ${nameParts.join(' ')}!`;
    }
  }

  // Crear mención de institución si está disponible
  let institutionMention = '';
  if (institucion) {
    institutionMention = `<p>Vemos que formas parte de <strong>${institucion}</strong>, y creemos que Arcidrade puede ser una herramienta valiosa para ti y tu institución.</p>`;
  }

  try {
    const info = await transporter.sendMail({
      from: NO_REPLY_MAIL,
      to: sendTo,
      subject: "🎯 Te han invitado a unirte a Arcidrade - Completa tu registro",
      text: `${greeting} Te han invitado a unirte a Arcidrade. Completa tu registro en: ${completeRegistrationUrl}`,
      html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitación a Arcidrade</title>
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
            background: linear-gradient(135deg, #384c9b 0%, #bcceec 100%);
            color: #ffffff;
            padding: 30px 20px;
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
        .highlight-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
            border-left: 4px solid #384c9b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .benefit-item {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #e9ecef;
        }
        .benefit-icon {
            font-size: 24px;
            margin-bottom: 8px;
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
        @media (max-width: 600px) {
            .benefits-grid {
                grid-template-columns: 1fr;
            }
        }
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
                    <div class="benefit-item">
                        <div class="benefit-icon">🎯</div>
                        <strong>Oportunidades</strong><br>
                        <small>Descubre proyectos y colaboraciones</small>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">🤝</div>
                        <strong>Networking</strong><br>
                        <small>Conecta con profesionales</small>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">📈</div>
                        <strong>Crecimiento</strong><br>
                        <small>Impulsa tu carrera profesional</small>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">🏆</div>
                        <strong>Reconocimiento</strong><br>
                        <small>Destaca tus logros</small>
                    </div>
                </div>
            </div>
            
            <p><strong>✨ Completa tu registro ahora mismo:</strong></p>
            
            <!-- Botón compatible con todos los clientes de email -->
            <div style="text-align: center; margin: 25px 0;">
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                    <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #384c9b 0%, #e94936 100%); background-color: #384c9b;">
                            <a href="${completeRegistrationUrl}" target="_blank" style="
                                display: inline-block;
                                padding: 18px 35px;
                                color: #ffffff !important;
                                text-decoration: none;
                                font-weight: 700;
                                font-size: 18px;
                                font-family: Arial, sans-serif;
                                text-align: center;
                                border-radius: 8px;
                                mso-padding-alt: 0;
                            ">
                                <span style="color: #ffffff !important; text-decoration: none; font-weight: 700;">
                                    🚀 Completar Mi Registro
                                </span>
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Fallback para clientes que no soporten el botón -->
            <div style="text-align: center; margin: 15px 0; font-size: 14px; color: #666;">
                <p>¿No puedes ver el botón? Copia y pega este enlace en tu navegador:</p>
                <a href="${completeRegistrationUrl}" style="color: #384c9b; font-weight: bold; text-decoration: underline; word-break: break-all;" target="_blank">
                    ${completeRegistrationUrl}
                </a>
            </div>
            
            <p>Este enlace es <strong>seguro y personalizado</strong> para ti. Te llevará directamente a completar tu perfil en nuestra plataforma.</p>
            <p><strong>¡No pierdas esta oportunidad de formar parte de nuestra comunidad!</strong></p>
        </div>
        <div class="footer">
            <p><strong>🎉 ¡Bienvenido a Arcidrade!</strong></p>
            <p>Tu futuro profesional comienza aquí. Si tienes alguna pregunta, estamos aquí para ayudarte.</p>
            <div class="contact-info">
                <p>📧 contacto@arcidrade.com | 🌐 www.arcidrade.com</p>
            </div>
        </div>
    </div>
</body>
</html>`,
    });
    
    return info ? true : false;
  } catch (error) {
    console.error('Error sending mass invitation email:', error);
    return false;
  }
}

// Nueva función para invitaciones masivas SIN registro - solo invita a visitar la página
export async function sendWebsiteInvitationMail({ 
  sendTo, 
  nombre, 
  apellido, 
  institucion 
}: { 
  sendTo?: string; 
  nombre?: string;
  apellido?: string;
  institucion?: string;
}) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error('SMTP transporter verification failed');
    }
  } catch (error) {
    console.error("Something Went Wrong", error);
    return;
  }

  // URL directa a la página principal
  const websiteUrl = process.env.PLAT_URL || 'https://arcidrade.com';
  
  // Generar saludo personalizado
  let greeting = "¡Hola!";
  if (nombre || apellido) {
    const fullName = [nombre, apellido].filter(Boolean).join(' ');
    greeting = `¡Hola ${fullName}!`;
  }

  // Mensaje personalizado según la institución
  let institutionMessage = "";
  if (institucion) {
    institutionMessage = `<p>Sabemos que trabajas en <strong>${institucion}</strong>, y creemos que ARCIDRADE puede ser de gran valor para tu desarrollo profesional y el de tu organización.</p>`;
  }

  const info = await transporter.sendMail({
    from: NO_REPLY_MAIL,
    to: sendTo,
    subject: "Descubre ARCIDRADE - La plataforma para profesionales de la salud",
    text: `Te invitamos a conocer ARCIDRADE, la plataforma que conecta profesionales de la salud con las mejores oportunidades. Visita: ${websiteUrl}`,
    html: `<!DOCTYPE html>
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
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(56, 76, 155, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #384c9b 0%, #bcceec 100%);
            color: #ffffff;
            padding: 30px 20px;
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
        .highlight-box {
            background-color: #f0f4ff;
            border-left: 4px solid #384c9b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .benefits-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .benefit-item {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .benefit-item .icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .benefit-item .text {
            font-size: 14px;
            font-weight: 600;
            color: #384c9b;
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
        @media (max-width: 480px) {
            .benefits-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://arcidrade.com/logos/Logo Arcidrade Full.png" alt="Arcidrade Logo" class="logo" />
            <h2>🌟 Descubre ARCIDRADE</h2>
        </div>
        <div class="content">
            <p><strong>${greeting}</strong></p>
            <p>Te invitamos a conocer <strong>ARCIDRADE</strong>, la plataforma innovadora que está transformando la manera en que los profesionales de la salud conectan con oportunidades excepcionales.</p>
            
            ${institutionMessage}
            
            <div class="highlight-box">
                <p><strong>🎯 ¿Qué hace especial a ARCIDRADE?</strong></p>
                <p>Somos una plataforma especializada que conecta el talento médico con las mejores oportunidades del sector salud, creando un ecosistema donde profesionales e instituciones pueden crecer juntos.</p>
            </div>
            
            <div class="benefits-grid">
                <div class="benefit-item">
                    <div class="icon">🏥</div>
                    <div class="text">Oportunidades Exclusivas</div>
                </div>
                <div class="benefit-item">
                    <div class="icon">🤝</div>
                    <div class="text">Red Profesional</div>
                </div>
                <div class="benefit-item">
                    <div class="icon">📈</div>
                    <div class="text">Desarrollo de Carrera</div>
                </div>
                <div class="benefit-item">
                    <div class="icon">🎓</div>
                    <div class="text">Instituciones de Prestigio</div>
                </div>
            </div>
            
            <p>Explora todas nuestras funcionalidades, conoce casos de éxito y descubre cómo ARCIDRADE puede impulsar tu carrera profesional.</p>
            
            <!-- Botón principal -->
            <div style="text-align: center; margin: 25px 0;">
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                    <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #384c9b 0%, #e94936 100%); background-color: #384c9b;">
                            <a href="${websiteUrl}" target="_blank" style="
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
                                    🚀 Visitar ARCIDRADE
                                </span>
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Fallback para clientes que no soporten el botón -->
            <div style="text-align: center; margin: 10px 0; font-size: 14px; color: #666;">
                <p>¿No puedes ver el botón? Visita directamente:</p>
                <a href="${websiteUrl}" style="color: #384c9b; font-weight: bold; text-decoration: underline;" target="_blank">
                    ${websiteUrl}
                </a>
            </div>
            
            <p>¡No te pierdas la oportunidad de ser parte de la comunidad profesional más dinámica del sector salud!</p>
        </div>
        <div class="footer">
            <p><strong>🏥 ARCIDRADE - Conectando talento con oportunidades</strong></p>
            <p>La plataforma líder para profesionales de la salud en Latinoamérica</p>
            <div class="contact-info">
                <p>📧 contacto@arcidrade.com | 🌐 www.arcidrade.com</p>
            </div>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                Has recibido este email porque creemos que ARCIDRADE puede ser de tu interés. Si no deseas recibir más comunicaciones, puedes ignorar este mensaje.
            </p>
        </div>
    </div>
</body>
</html>`,
  });
  return info;
}

export async function sendResetPasswordMail({ sendTo, referCode }: { sendTo?: string; referCode: string }) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error('SMTP transporter verification failed');
    }
  } catch (error) {
    console.error("Something Went Wrong", error);
    return;
  }

  // Construir URL de manera más robusta
  const baseUrl = process.env.PLAT_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetPasswordUrl = `${baseUrl}/resetPassword/${referCode}`;

  const info = await transporter.sendMail({
    from: NO_REPLY_MAIL,
    to: sendTo,
    subject: "Recuperación de Contraseña - ARCIDRADE",
    text: `Use este enlace para restablecer su contraseña`,
    html: `<!DOCTYPE html>
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
            background: linear-gradient(135deg, #e94936 0%, #d63384 100%);
            color: #ffffff;
            padding: 30px 20px;
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
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #e94936 0%, #d63384 100%); background-color: #e94936;">
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
</html>`,
  });
  return info;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactMail(contactData: ContactFormData) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error("SMTP configuration error");
    }
  } catch (error) {
    console.error("SMTP verification failed:", error);
    throw new Error("Error de configuración del servidor de correo");
  }

  const subjectMapping: { [key: string]: string } = {
    "informacion-general": "Información General",
    "soporte-tecnico": "Soporte Técnico",
    "registro-profesional": "Registro como Profesional",
    "registro-institucion": "Registro como Institución",
    colaboracion: "Oportunidades de Colaboración",
    otro: "Consulta General",
  };

  const subjectText = subjectMapping[contactData.subject] || "Consulta General";

  try {
    // Email de notificación para el equipo de ARCIDRADE
    const adminInfo = await transporter.sendMail({
      from: NO_REPLY_MAIL,
      to: "contacto@arcidrade.com",
      subject: `[CONTACTO] ${subjectText} - ${contactData.name}`,
      text: `Nuevo mensaje de contacto recibido`,
      html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Mensaje de Contacto</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #bcceec 0%, #f5f7fa 100%);
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
            background: linear-gradient(135deg, #384c9b 0%, #2c3e87 100%);
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
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        .content {
            padding: 40px 30px;
        }
        .field {
            margin-bottom: 24px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%);
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
            background: linear-gradient(135deg, #bcceec 0%, #e8f0ff 100%);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #d0ddf7;
            margin-top: 10px;
        }
        .footer {
            background: linear-gradient(135deg, #f8f9fc 0%, #e8f0ff 100%);
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
            background: linear-gradient(135deg, #fff5f5 0%, #fee);
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
</html>`,
    });

    // Email de confirmación para el usuario
    const userInfo = await transporter.sendMail({
      from: NO_REPLY_MAIL,
      to: contactData.email,
      subject: `Gracias por contactarnos - ${subjectText}`,
      text: `Hemos recibido tu mensaje y te responderemos pronto.`,
      html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Contacto</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #bcceec 0%, #f5f7fa 100%);
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
            background: linear-gradient(135deg, #384c9b 0%, #2c3e87 100%);
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
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
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
            background: linear-gradient(135deg, #bcceec 0%, #e8f0ff 100%);
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
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%);
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
            background: linear-gradient(135deg, #e94936 0%, #d63384 100%);
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
            background: linear-gradient(135deg, #384c9b 0%, #2c3e87 100%);
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
                <p>� <strong>Para consultas urgentes:</strong> contacto@arcidrade.com</p>
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
</html>`,
    });

    return {
      success: true,
      adminMessageId: adminInfo.messageId,
      userMessageId: userInfo.messageId,
      message: "Emails enviados exitosamente",
    };
  } catch (error) {
    console.error("Error sending contact emails:", error);
    throw new Error("Error al enviar los emails de contacto");
  }
}

export async function sendContactAdminMail(contactData: ContactFormData) {
    try {
        const isVerified = await transporter.verify();
        if (!isVerified) {
            throw new Error("SMTP configuration error");
        }

        // Email al usuario solicitando que contacte al administrador
        const userNotificationInfo = await transporter.sendMail({
            from: NO_REPLY_MAIL,
            to: contactData.email,
            subject: "Contacto requerido con Administrador - ARCIDRADE",
            text: `Hola ${contactData.name}, necesitas contactarte con nuestro administrador para completar tu solicitud.`,
            html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contacto con Administrador</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #bcceec 0%, #f5f7fa 100%);
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
            background: linear-gradient(135deg, #e94936 0%, #d63384 100%);
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
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
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
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
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
            background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%);
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
            background: linear-gradient(135deg, #e8f0ff 0%, #bcceec 100%);
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
            background: linear-gradient(135deg, #384c9b 0%, #2c3e87 100%);
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
</html>`
        });

        return {
            success: true,
            messageId: userNotificationInfo.messageId,
            message: "Email de contacto con administrador enviado exitosamente"
        };
        
    } catch (error) {
        console.error("SMTP verification failed:", error);
        throw new Error("Error de configuración del servidor de correo");
    }
}
