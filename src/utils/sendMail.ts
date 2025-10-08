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
