/**
 * Script de prueba para verificar configuración de email
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas
 * 2. Ejecuta: node test-email-config.js
 * 3. Ingresa el email de destino cuando se solicite
 */

const nodemailer = require('nodemailer');
const readline = require('readline');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}${'='.repeat(60)}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`),
};

// Interfaz para entrada de usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const NO_REPLY_MAIL = process.env.NO_REPLY_MAIL;
const NO_REPLY_MAIL_PASSWORD = process.env.NO_REPLY_MAIL_PASSWORD;
const MAIL_PORT = process.env.MAIL_PORT;

async function testEmailConfiguration() {
  log.header();
  log.title('🧪 TEST DE CONFIGURACIÓN DE EMAIL - ARCIDRADE');
  log.header();

  // 1. Verificar variables de entorno
  console.log('\n📋 Verificando variables de entorno...\n');
  
  const requiredVars = {
    'SMTP_SERVER_HOST': SMTP_SERVER_HOST,
    'NO_REPLY_MAIL': NO_REPLY_MAIL,
    'NO_REPLY_MAIL_PASSWORD': NO_REPLY_MAIL_PASSWORD ? '***' : undefined,
    'MAIL_PORT': MAIL_PORT,
  };

  let allVarsPresent = true;
  for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
      log.success(`${key}: ${value}`);
    } else {
      log.error(`${key}: NO CONFIGURADO`);
      allVarsPresent = false;
    }
  }

  if (!allVarsPresent) {
    log.error('\nFaltan variables de entorno requeridas. Por favor configura el archivo .env.local');
    rl.close();
    process.exit(1);
  }

  // 2. Crear transporter
  console.log('\n🔧 Configurando transporter...\n');
  
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

  // 3. Verificar conexión SMTP
  console.log('🔌 Verificando conexión con servidor SMTP...\n');
  
  try {
    await transporter.verify();
    log.success('Conexión SMTP exitosa');
  } catch (error) {
    log.error('Error de conexión SMTP:');
    console.error(error.message);
    rl.close();
    process.exit(1);
  }

  // 4. Solicitar email de destino
  console.log('\n📧 Prueba de envío de email');
  log.warning('Este email se enviará al destinatario que especifiques\n');
  
  const testEmail = await question('Ingresa el email de destino (o presiona Enter para mail-tester.com): ');
  const destinationEmail = testEmail.trim() || 'test-' + Date.now() + '@srv1.mail-tester.com';

  if (!testEmail.trim()) {
    log.info(`Usando mail-tester temporal: ${destinationEmail}`);
    log.info('Visita https://www.mail-tester.com para ver el resultado');
  }

  // 5. Enviar email de prueba
  console.log('\n📤 Enviando email de prueba...\n');
  
  const testTime = new Date().toLocaleString('es-ES');
  
  try {
    const info = await transporter.sendMail({
      from: `"ARCIDRADE Platform Test" <${NO_REPLY_MAIL}>`,
      replyTo: 'contacto@arcidrade.com',
      to: destinationEmail,
      subject: 'Test de Configuración ARCIDRADE - ' + testTime,
      text: `Este es un email de prueba enviado desde ARCIDRADE.

Hora de envío: ${testTime}
Servidor SMTP: ${SMTP_SERVER_HOST}
Puerto: ${MAIL_PORT}

Si estás recibiendo este email, significa que la configuración básica está funcionando correctamente.

Próximos pasos:
1. Verifica que el email NO esté en spam
2. Revisa los headers del email
3. Usa mail-tester.com para obtener un score completo

Saludos,
Equipo ARCIDRADE
contacto@arcidrade.com
https://arcidrade.com`,
      html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #384c9b 0%, #bcceec 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
            line-height: 1.6;
            color: #333;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #384c9b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .success-icon {
            font-size: 48px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background-color: #384c9b;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .checklist {
            list-style: none;
            padding: 0;
        }
        .checklist li {
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .checklist li:before {
            content: "✅ ";
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test de Configuración</h1>
            <p>ARCIDRADE Email System</p>
        </div>
        <div class="content">
            <div class="success-icon">✅</div>
            <h2 style="color: #384c9b; text-align: center;">¡Configuración Exitosa!</h2>
            
            <p>Este es un email de prueba para verificar la configuración del sistema de emails de ARCIDRADE.</p>
            
            <div class="info-box">
                <h3 style="margin-top: 0;">📊 Detalles del Test</h3>
                <p><strong>Hora de envío:</strong> ${testTime}</p>
                <p><strong>Servidor SMTP:</strong> ${SMTP_SERVER_HOST}</p>
                <p><strong>Puerto:</strong> ${MAIL_PORT}</p>
                <p><strong>Encriptación:</strong> ${Number(MAIL_PORT) === 465 ? 'SSL/TLS' : 'STARTTLS'}</p>
            </div>
            
            <h3 style="color: #384c9b;">✅ Verificaciones a realizar:</h3>
            <ul class="checklist">
                <li>Este email NO está en la carpeta de spam</li>
                <li>El remitente aparece como "ARCIDRADE Platform Test"</li>
                <li>Las imágenes y estilos se cargan correctamente</li>
                <li>Los links son seguros (HTTPS)</li>
            </ul>
            
            <h3 style="color: #384c9b;">🔍 Próximos pasos:</h3>
            <ol>
                <li>Verifica los <strong>headers del email</strong> para confirmar SPF/DKIM</li>
                <li>Usa <a href="https://www.mail-tester.com" style="color: #384c9b;">mail-tester.com</a> para obtener un score completo</li>
                <li>Revisa que la configuración DNS esté correcta (SPF, DKIM, DMARC)</li>
                <li>Monitorea la tasa de entrega en producción</li>
            </ol>
            
            <div class="info-box" style="background-color: #fff3cd; border-left-color: #ffc107;">
                <h4 style="margin-top: 0;">⚠️ Recordatorio Importante</h4>
                <p>Si este email llegó a spam, revisa el documento <strong>EMAIL-DELIVERY-SETUP.md</strong> para configurar correctamente:</p>
                <ul style="margin: 10px 0;">
                    <li>SPF Record</li>
                    <li>DKIM Signature</li>
                    <li>DMARC Policy</li>
                    <li>PTR/Reverse DNS</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p><strong>ARCIDRADE Platform</strong></p>
            <p>📧 contacto@arcidrade.com | 🌐 www.arcidrade.com</p>
            <p style="font-size: 11px; margin-top: 10px; opacity: 0.8;">
                Este es un email de prueba del sistema. Si no esperabas recibirlo, puedes ignorarlo.
            </p>
        </div>
    </div>
</body>
</html>`,
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'ARCIDRADE Platform v1.0',
        'Importance': 'Normal',
        'X-Entity-Ref-ID': `test-${Date.now()}`,
        'Message-ID': `<test-${Date.now()}@arcidrade.com>`,
        'List-Unsubscribe': '<mailto:contacto@arcidrade.com?subject=unsubscribe>',
        'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
      },
    });

    log.success('Email enviado exitosamente!');
    console.log('\n📨 Detalles del envío:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Destino: ${destinationEmail}`);
    console.log(`   Response: ${info.response}`);
    
    log.header();
    log.title('📋 PRÓXIMOS PASOS:');
    log.header();
    console.log(`
1. 📬 Revisa el buzón de entrada de: ${destinationEmail}
2. 🔍 Verifica que NO esté en spam
3. 📊 Si usaste mail-tester.com, visita https://www.mail-tester.com
4. 🔧 Si el score es bajo, revisa EMAIL-DELIVERY-SETUP.md
5. ✅ Configura SPF, DKIM y DMARC en tu DNS
    `);
    
  } catch (error) {
    log.error('Error al enviar email:');
    console.error(error);
    
    log.header();
    log.title('🆘 SOLUCIONES POSIBLES:');
    log.header();
    console.log(`
1. ❌ Verifica que las credenciales SMTP sean correctas
2. ❌ Confirma que el puerto ${MAIL_PORT} no esté bloqueado por firewall
3. ❌ Revisa que el servidor SMTP permita el envío desde tu IP
4. ❌ Contacta al soporte de tu proveedor SMTP (MailChannels)
5. ❌ Revisa los logs completos arriba para más detalles
    `);
  }

  rl.close();
}

// Ejecutar el test
testEmailConfiguration().catch((error) => {
  log.error('Error fatal:');
  console.error(error);
  rl.close();
  process.exit(1);
});
