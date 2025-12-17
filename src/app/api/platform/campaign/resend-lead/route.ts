import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { sendWebsiteInvitationMail, sendInvitationMail } from '@/utils/sendMail';
import { registerUser } from '@/service/register.service';
import prisma from '@/utils/db';
import { withPrismaRetry } from '@/utils/retryUtils';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y que sea usuario Campaign
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario pertenezca al área Campaign
    if (session.user.area !== 'campaign') {
      return NextResponse.json(
        { message: 'Acceso denegado. Solo usuarios Campaign pueden reenviar invitaciones.' },
        { status: 403 }
      );
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { leadId, email, nombre, apellido, status } = body;

    // Validar que el email y status sean requeridos
    if (!email || !leadId || !status) {
      return NextResponse.json(
        { message: 'Email, ID del lead y status son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Decidir qué tipo de reenvío hacer según el status del lead
    try {
      let emailSent = false;
      let displayName = 'Usuario';
      if (nombre || apellido) {
        const nameParts = [nombre, apellido].filter(Boolean);
        displayName = nameParts.join(' ');
      }

      if (status === 'sent_subscription') {
        // Para suscripciones completas: crear usuario en BD y enviar email con link de registro
        try {
          // Verificar si el usuario ya existe con retry logic
          const existingUser = await withPrismaRetry(() =>
            prisma.auth.findFirst({
              where: { 
                email: email.toLowerCase() 
              }
            })
          );

          let userToUse;
          
          if (existingUser) {
            // Si el usuario ya existe, usar su referCode existente
            userToUse = existingUser;
          } else {
            // Crear usuario en la base de datos solo si no existe con retry logic
            userToUse = await withPrismaRetry(() =>
              registerUser(
                email,
                'professional', // área por defecto para Campaign
                session.user.email,
                session.user.referCode
              )
            );

            if (!userToUse) {
              return NextResponse.json(
                { message: 'Error al crear el registro del usuario' },
                { status: 500 }
              );
            }
          }

          // Enviar email de invitación con registro (igual que Victor)
          const invitationResult = await sendInvitationMail({
            sendTo: email,
            referCode: userToUse.referCode,
          });

          emailSent = !!invitationResult;

          if (!emailSent) {
            console.error(`Failed to send subscription invitation email to: ${email}`);
            return NextResponse.json(
              { message: 'Error al reenviar el email de suscripción completa' },
              { status: 500 }
            );
          }

          return NextResponse.json({
            message: 'Invitación de suscripción completa reenviada exitosamente',
            recipient: {
              email,
              name: displayName,
              leadId,
              type: 'complete_subscription',
              referCode: userToUse.referCode,
              userExists: !!existingUser
            },
            timestamp: new Date().toISOString()
          });

        } catch (registrationError) {
          console.error('Error creating user for subscription:', registrationError);
          return NextResponse.json(
            { message: 'Error al crear el registro para suscripción completa' },
            { status: 500 }
          );
        }

      } else {
        // Para invitaciones al sitio: usar el email simple (sin registro)
        const websiteInvitationResult = await sendWebsiteInvitationMail({
          sendTo: email,
          nombre: nombre || undefined,
          apellido: apellido || undefined,
          institucion: undefined, // Para Campaign no tenemos institución
        });
        
        emailSent = !!websiteInvitationResult;
        
        if (!emailSent) {
          console.error(`Failed to resend website invitation email to: ${email}`);
          return NextResponse.json(
            { message: 'Error al reenviar el email de invitación' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: 'Invitación al sitio reenviada exitosamente',
          recipient: {
            email,
            name: displayName,
            leadId,
            type: 'website_invitation'
          },
          timestamp: new Date().toISOString()
        });
      }

    } catch (emailError) {
      console.error('Error sending resend email:', emailError);
      return NextResponse.json(
        { message: 'Error interno al enviar el email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in resend lead endpoint:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}