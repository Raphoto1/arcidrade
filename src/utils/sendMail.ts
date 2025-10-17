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
  
  console.log('Sending invitation email to:', sendTo);
  console.log('Registration URL:', completeRegistrationUrl);
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
            <img src="https://arcidrade.com/logos/Logo Arcidrade Cond.png" alt="Arcidrade Logo" class="logo" />
            <h2>Complete su registro en Arcidrade</h2>
        </div>
        <div class="content">
            <p><strong>¡Buen día!</strong></p>
            <p>Estamos emocionados de que esté interesado en unirse a nuestra comunidad profesional. Para completar el registro, por favor haga clic en el enlace siguiente:</p>
            
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
