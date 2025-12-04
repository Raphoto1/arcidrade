"use server";
import nodemailer from "nodemailer";
import { 
  getInvitationTemplate, 
  getMassInvitationTemplate,
  getWebsiteInvitationTemplate,
  getResetPasswordTemplate,
  getContactTemplate,
  getContactAdminNotificationTemplate,
  getContactAdminTemplate,
  getErrorLogTemplate
} from './emailTemplates';

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
  secure: Number(MAIL_PORT) === 465,
  auth: {
    user: NO_REPLY_MAIL,
    pass: NO_REPLY_MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
});

export async function sendInvitationMail({ sendTo, referCode }: { sendTo?: string; referCode: string }) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error('SMTP transporter verification failed');
    }

    // Construir URL de manera más robusta
    const baseUrl = process.env.PLAT_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const completeRegistrationUrl = `${baseUrl}/completeInvitation/${referCode}`;

    const info = await transporter.sendMail({
      from: `"ARCIDRADE" <${NO_REPLY_MAIL}>`,
      replyTo: 'contacto@arcidrade.com',
      to: sendTo,
      subject: SubjectInvitation,
      text: `Hola,\n\nHas recibido una invitación para unirte a ARCIDRADE.\n\nPara completar tu registro, por favor visita el siguiente enlace:\n${completeRegistrationUrl}\n\nEste enlace es seguro y te permitirá crear tu cuenta en nuestra plataforma.\n\nSi no solicitaste esta invitación, puedes ignorar este mensaje.\n\nSaludos,\nEquipo ARCIDRADE\ncontacto@arcidrade.com\nhttps://arcidrade.com`,
      headers: {
        'X-Priority': '3',
        'Importance': 'Normal',
        'X-Entity-Ref-ID': `inv-${referCode}`,
        'List-Unsubscribe': '<mailto:contacto@arcidrade.com?subject=unsubscribe>',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
        'Message-ID': `<inv-${referCode}-${Date.now()}@arcidrade.com>`,
      },
      html: getInvitationTemplate(completeRegistrationUrl),
    });
    
    return info;
  } catch (error) {
    console.error("Error sending invitation email:", error);
    return null;
  }
}

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
      from: `"ARCIDRADE Platform" <${NO_REPLY_MAIL}>`,
      replyTo: 'contacto@arcidrade.com',
      to: sendTo,
      subject: "Te han invitado a unirte a Arcidrade - Completa tu registro",
      text: `${greeting}\n\nHas recibido una invitación especial para formar parte de ARCIDRADE, la plataforma líder que conecta profesionales, instituciones y oportunidades de desarrollo.\n\nPara completar tu registro, visita:\n${completeRegistrationUrl}\n\nEste enlace es seguro y personalizado para ti.\n\n¿Por qué unirte a ARCIDRADE?\n- Descubre oportunidades profesionales\n- Conecta con otros profesionales\n- Impulsa tu carrera\n- Obtén reconocimiento\n\nSi tienes alguna pregunta, contáctanos en contacto@arcidrade.com\n\nSaludos,\nEquipo ARCIDRADE\nhttps://arcidrade.com`,
      headers: {
        'X-Entity-Ref-ID': `mass-inv-${referCode}`,
        'List-Unsubscribe': '<mailto:contacto@arcidrade.com?subject=unsubscribe>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
        'Message-ID': `<mass-inv-${referCode}-${Date.now()}@arcidrade.com>`,
        'X-Campaign-ID': 'invitation-mass',
      },
      html: getMassInvitationTemplate(completeRegistrationUrl, greeting, institutionMention),
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
    from: `"ARCIDRADE" <${NO_REPLY_MAIL}>`,
    replyTo: 'contacto@arcidrade.com',
    to: sendTo,
    subject: "Descubre ARCIDRADE - Plataforma para profesionales de la salud",
    text: `Te invitamos a conocer ARCIDRADE, la plataforma que conecta profesionales de la salud con las mejores oportunidades. Visita: ${websiteUrl}`,
    headers: {
      'List-Unsubscribe': '<mailto:contacto@arcidrade.com?subject=unsubscribe>',
      'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
    },
    html: getWebsiteInvitationTemplate(websiteUrl, greeting, institutionMessage),
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
    from: `"ARCIDRADE Seguridad" <${NO_REPLY_MAIL}>`,
    replyTo: 'contacto@arcidrade.com',
    to: sendTo,
    subject: "Recuperación de Contraseña - ARCIDRADE",
    text: `Use este enlace para restablecer su contraseña: ${resetPasswordUrl}`,
    headers: {
      'X-Entity-Ref-ID': `pwd-reset-${referCode}`,
      'X-Priority': '1',
      'Importance': 'high',
      'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
    },
    html: getResetPasswordTemplate(resetPasswordUrl),
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
      from: `"${contactData.name}" <${NO_REPLY_MAIL}>`,
      replyTo: contactData.email,
      to: "contacto@arcidrade.com",
      subject: `[CONTACTO] ${subjectText} - ${contactData.name}`,
      text: `Nuevo mensaje de contacto recibido de ${contactData.name} (${contactData.email})`,
      headers: {
        'X-Entity-Ref-ID': `contact-${Date.now()}`,
        'X-Priority': '2',
      },
      html: getContactAdminNotificationTemplate(contactData, subjectText),
    });

    // Email de confirmación para el usuario
    const userInfo = await transporter.sendMail({
      from: `"ARCIDRADE" <${NO_REPLY_MAIL}>`,
      replyTo: 'contacto@arcidrade.com',
      to: contactData.email,
      subject: `Gracias por contactarnos - ${subjectText}`,
      text: `Hola ${contactData.name}, hemos recibido tu mensaje y te responderemos pronto.`,
      headers: {
        'X-Entity-Ref-ID': `contact-confirm-${Date.now()}`,
        'List-Unsubscribe': '<mailto:contacto@arcidrade.com?subject=unsubscribe>',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
      },
      html: getContactTemplate(contactData, subjectText),
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
            from: `"ARCIDRADE" <${NO_REPLY_MAIL}>`,
            replyTo: 'contacto@arcidrade.com',
            to: contactData.email,
            subject: "Contacto requerido con Administrador - ARCIDRADE",
            text: `Hola ${contactData.name}, necesitas contactarte con nuestro administrador para completar tu solicitud. Contáctanos en: contacto@arcidrade.com`,
            headers: {
              'X-Entity-Ref-ID': `contact-admin-${Date.now()}`,
              'X-Priority': '2',
              'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
            },
            html: getContactAdminTemplate(contactData),
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

// Nueva función para enviar logs de errores al administrador
interface ErrorLogData {
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  userEmail?: string;
  userName?: string;
  endpoint: string;
  requestBody?: any;
  timestamp: string;
  userAgent?: string;
}

export async function sendErrorLogMail(errorData: ErrorLogData) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      console.error('SMTP transporter verification failed for error log');
      return { success: false, error: 'SMTP verification failed' };
    }
  } catch (error) {
    console.error("Error verifying SMTP for error log:", error);
    return { success: false, error: 'SMTP verification error' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"ARCIDRADE Error Monitor" <${NO_REPLY_MAIL}>`,
      replyTo: errorData.userEmail || 'contacto@arcidrade.com',
      to: "info@creativerafa.com",
      subject: `🚨 Error en ${errorData.endpoint} - ARCIDRADE`,
      text: `Error detectado en ARCIDRADE\n\nTipo: ${errorData.errorType}\nMensaje: ${errorData.errorMessage}\nEndpoint: ${errorData.endpoint}\nFecha: ${errorData.timestamp}`,
      headers: {
        'X-Entity-Ref-ID': `error-log-${Date.now()}`,
        'X-Priority': '1',
        'Importance': 'high',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
      },
      html: getErrorLogTemplate(errorData),
    });
    
    return {
      success: true,
      messageId: info.messageId,
      message: "Log de error enviado exitosamente"
    };
  } catch (error) {
    console.error('Error sending error log email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
