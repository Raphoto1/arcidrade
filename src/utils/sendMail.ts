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
  } catch (error) {
    console.error("Something Went Wrong", error);
    return;
  }
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
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
        }
        .container {
            width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #333;
            color: #fff;
            padding: 10px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #333;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Complete su registro en Arcidrade</h2>
        </div>
        <div class="content">
            <p>Buen dia,</b>,</p>
            <p>estamos emocionados de que este interesado en unirse a nuestra comunidad. Para completar el registro, por favor haga click en el enlace siguiente:</p>
            <a href="${process.env.PLAT_URL}/completeInvitation/${referCode}" target="_blank">Completar Registro</a>
            <p></p>
        </div>
        <div class="footer">
            <p>Gracias por tu interés en nuestra comunidad. Si tienes alguna pregunta o necesitas ayuda, no dudes en hacérlo saber.</p>
            <p>contacto@arcidrade.com</p>
            <p>¡Bienvenido a Arcidrade!</p>
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
    "colaboracion": "Oportunidades de Colaboración",
    "otro": "Consulta General"
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
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #2c5aa0;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .field {
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .field:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .label {
            font-weight: bold;
            color: #333;
            display: block;
            margin-bottom: 5px;
        }
        .value {
            color: #666;
            line-height: 1.5;
        }
        .message-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #2c5aa0;
            border-radius: 4px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
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
            
            ${contactData.phone ? `
            <div class="field">
                <span class="label">📱 Teléfono:</span>
                <span class="value">${contactData.phone}</span>
            </div>
            ` : ''}
            
            <div class="field">
                <span class="label">📋 Asunto:</span>
                <span class="value">${subjectText}</span>
            </div>
            
            <div class="field">
                <span class="label">💬 Mensaje:</span>
                <div class="message-box">
                    <span class="value">${contactData.message.replace(/\n/g, '<br>')}</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de ARCIDRADE</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES', { 
              timeZone: 'America/New_York',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
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
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #2c5aa0;
            color: #fff;
            padding: 30px 20px;
            text-align: center;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .message-summary {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2c5aa0;
        }
        .footer {
            background-color: #2c5aa0;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .btn {
            display: inline-block;
            background-color: #ff6b35;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Gracias por contactarnos!</h1>
            <p>Hemos recibido tu mensaje</p>
        </div>
        <div class="content">
            <p>Hola <strong>${contactData.name}</strong>,</p>
            <p>Gracias por ponerte en contacto con ARCIDRADE. Hemos recibido tu mensaje sobre <strong>"${subjectText}"</strong> y nuestro equipo te responderá lo antes posible.</p>
            
            <div class="message-summary">
                <h3>Resumen de tu consulta:</h3>
                <p><strong>Asunto:</strong> ${subjectText}</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            
            <p>📧 <strong>Tiempo de respuesta habitual:</strong> 24-48 horas</p>
            <p>📞 <strong>Para consultas urgentes:</strong> contacto@arcidrade.com</p>
            
            <a href="${process.env.PLAT_URL}" class="btn">Visitar ARCIDRADE</a>
        </div>
        <div class="footer">
            <p><strong>ARCIDRADE</strong></p>
            <p>Conectando talento médico con oportunidades</p>
            <p>📧 contacto@arcidrade.com | 📱 +1 (555) 123-4567</p>
        </div>
    </div>
</body>
</html>`,
    });

    return {
      success: true,
      adminMessageId: adminInfo.messageId,
      userMessageId: userInfo.messageId,
      message: "Emails enviados exitosamente"
    };

  } catch (error) {
    console.error("Error sending contact emails:", error);
    throw new Error("Error al enviar los emails de contacto");
  }
}


