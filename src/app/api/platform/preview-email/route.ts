import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  getInvitationTemplate,
  getMassInvitationTemplate,
  getWebsiteInvitationTemplate,
  getResetPasswordTemplate,
  getContactTemplate,
  getContactAdminNotificationTemplate,
  getContactAdminTemplate,
  getErrorLogTemplate
} from '@/utils/emailTemplates';

export async function GET(request: Request) {
  // Check authentication
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login to access email previews.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'invitation';

  let html = '';

  switch (template) {
    case 'invitation':
      html = getInvitationTemplate('https://arcidrade.com/completeInvitation?code=ABC123XYZ');
      break;

    case 'mass-invitation':
      html = getMassInvitationTemplate(
        'https://arcidrade.com/completeInvitation?code=DEF456UVW',
        '¡Hola Dr. Juan Pérez!',
        'del Hospital General de México'
      );
      break;

    case 'website-invitation':
      html = getWebsiteInvitationTemplate(
        'https://arcidrade.com/auth/register',
        '¡Hola Dra. María González!',
        'la Clínica Santa Fe ha decidido confiar en nosotros'
      );
      break;

    case 'reset-password':
      html = getResetPasswordTemplate('https://arcidrade.com/resetPassword?code=RST789PQR');
      break;

    case 'contact':
      html = getContactTemplate(
        {
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@ejemplo.com',
          phone: '+52 55 9876 5432',
          subject: 'soporte-tecnico',
          message: 'Necesito ayuda con mi perfil profesional'
        },
        'Soporte Técnico'
      );
      break;

    case 'contact-admin-notification':
      html = getContactAdminNotificationTemplate(
        {
          name: 'María López',
          email: 'maria.lopez@ejemplo.com',
          phone: '+52 55 1111 2222',
          subject: 'consulta-general',
          message: '¿Cómo puedo destacar mi perfil en la plataforma?'
        },
        'Consulta General'
      );
      break;

    case 'contact-admin':
      html = getContactAdminTemplate({
        name: 'Laura Martínez',
        email: 'laura.martinez@ejemplo.com',
        phone: '+52 55 1234 5678',
        subject: 'colaboracion',
        message: 'Estamos interesados en establecer una colaboración estratégica para el reclutamiento de profesionales de la salud especializados en investigación clínica.'
      });
      break;

    case 'error-log':
      html = getErrorLogTemplate({
        errorType: 'DatabaseConnectionError',
        errorMessage: 'Failed to connect to PostgreSQL',
        errorStack: `Error: DatabaseConnectionError: Failed to connect to PostgreSQL
    at PrismaClient.connect (/app/node_modules/@prisma/client/runtime/library.js:123:15)
    at async getUserData (/app/controller/userData.controller.ts:45:12)
    at async GET (/app/api/platform/profesional/route.ts:8:24)`,
        timestamp: new Date().toISOString(),
        endpoint: '/api/platform/profesional',
        userEmail: session?.user?.email || 'anonymous@example.com',
        userName: session?.user?.email || 'Anonymous User'
      });
      break;

    default:
      return NextResponse.json(
        { error: 'Invalid template name. Available templates: invitation, mass-invitation, website-invitation, reset-password, contact, contact-admin-notification, contact-admin, error-log' },
        { status: 400 }
      );
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
