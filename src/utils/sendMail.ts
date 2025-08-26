'use server';
import nodemailer from 'nodemailer';
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
const NO_REPLY_MAIL = process.env.NO_REPLY_MAIL;
const MAIL_PORT = process.env.MAIL_PORT;


const transporter = nodemailer.createTransport({
    service: "hostinger",
    host: SMTP_SERVER_HOST,
    port: 558,
    auth: {
        user: NO_REPLY_MAIL,
        pass: SMTP_SERVER_PASSWORD
    },
    secure: true,
    tls: {
        ciphers:"SSLv3"
    },
    requireTLS: true,
    debug: true,
    connectionTimeout:10000,
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return;
  }
  const info = await transporter.sendMail({
    from: email,
    to: sendTo || SITE_MAIL_RECIEVER,
    subject: subject,
    text: text,
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', SITE_MAIL_RECIEVER);
  return info;
}