/**
 * Script para generar previews HTML de los templates de email
 * Ejecutar: node generate-email-previews.js
 */

const fs = require('fs');
const path = require('path');

// Crear carpeta de previews si no existe
const previewDir = path.join(__dirname, 'preview-templates');
if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir);
}

// Datos de ejemplo para los templates
const sampleData = {
    invitation: {
        url: 'https://arcidrade.com/completeInvitation/ABC123XYZ',
    },
    massInvitation: {
        url: 'https://arcidrade.com/completeInvitation/DEF456UVW',
        greeting: '¡Hola Dr. Juan Pérez!',
        institutionMention: '<p>Vemos que formas parte de <strong>Hospital General de México</strong>, y creemos que Arcidrade puede ser una herramienta valiosa para ti y tu institución.</p>',
    },
    websiteInvitation: {
        url: 'https://arcidrade.com',
        greeting: '¡Hola Dra. María González!',
        institutionMessage: '<p>Sabemos que trabajas en <strong>Clínica Santa Fe</strong>, y creemos que ARCIDRADE puede ser de gran valor para tu desarrollo profesional y el de tu organización.</p>',
    },
    resetPassword: {
        url: 'https://arcidrade.com/resetPassword/RST789PQR',
    },
    contact: {
        contactData: {
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com',
            phone: '+52 55 1234 5678',
            subject: 'soporte-tecnico',
            message: 'Necesito ayuda con mi cuenta, no puedo acceder después de cambiar mi contraseña.',
        },
        subjectText: 'Soporte Técnico',
    },
    contactAdmin: {
        contactData: {
            name: 'Laura Martínez',
            email: 'laura.martinez@example.com',
            phone: '+52 55 9876 5432',
            subject: 'colaboracion',
            message: 'Estoy interesada en establecer una colaboración con mi institución.',
        },
    },
    errorLog: {
        errorType: 'DatabaseConnectionError',
        errorMessage: 'Connection timeout after 30 seconds',
        errorStack: 'Error: Connection timeout\\n    at Database.connect (/app/db.ts:45:12)\\n    at processTicksAndRejections (node:internal/process:123:45)',
        userEmail: 'user@example.com',
        userName: 'Test User',
        endpoint: '/api/auth/register',
        requestBody: { email: 'test@example.com', area: 'professional' },
        timestamp: new Date().toLocaleString('es-MX'),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
};

// Importar y ejecutar los templates
async function generatePreviews() {
    console.log('🎨 Generando previews de templates de email...\n');

    try {
        // Para TypeScript, necesitamos compilar primero o usar ts-node
        // Alternativa: copiar manualmente el HTML de cada template
        
        const templates = [
            {
                name: 'invitation',
                filename: 'invitation.html',
                description: 'Invitación Simple',
            },
            {
                name: 'mass-invitation',
                filename: 'mass-invitation.html',
                description: 'Invitación Masiva',
            },
            {
                name: 'website-invitation',
                filename: 'website-invitation.html',
                description: 'Invitación a Website',
            },
            {
                name: 'reset-password',
                filename: 'reset-password.html',
                description: 'Reset Password',
            },
            {
                name: 'contact',
                filename: 'contact.html',
                description: 'Contacto Usuario',
            },
            {
                name: 'contact-admin',
                filename: 'contact-admin.html',
                description: 'Contacto Admin',
            },
            {
                name: 'error-log',
                filename: 'error-log.html',
                description: 'Error Log',
            },
        ];

        console.log('📝 Para generar los previews, necesitas ejecutar las funciones de template.');
        console.log('📋 Alternativa rápida: Copia el HTML generado directamente desde los archivos .ts\n');
        
        templates.forEach(template => {
            console.log(`✅ ${template.description}: preview-templates/${template.filename}`);
        });

        console.log('\n💡 Tip: Puedes abrir preview-email-templates.html en tu navegador');
        console.log('   después de copiar los HTMLs generados a la carpeta preview-templates/\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

generatePreviews();
