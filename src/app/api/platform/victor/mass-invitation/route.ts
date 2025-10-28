import { NextRequest, NextResponse } from 'next/server';
import { sendWebsiteInvitationMail } from '@/utils/sendMail';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { email, nombre, segundoNombre, apellido, institucion } = body;

    // Validar que el email sea requerido
    if (!email) {
      return NextResponse.json(
        { message: 'El email es requerido' },
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

    // Enviar email invitando a visitar la página (SIN registrar en BD)
    try {
      const emailSent = await sendWebsiteInvitationMail({
        sendTo: email,
        nombre: nombre || undefined,
        apellido: apellido || undefined,
        institucion: institucion || undefined,
      });
      
      if (!emailSent) {
        console.error(`Failed to send website invitation email to: ${email}`);
        return NextResponse.json(
          { message: 'Error al enviar el email de invitación' },
          { status: 500 }
        );
      }

      // Crear un mensaje personalizado basado en los datos disponibles
      let displayName = 'Usuario';
      if (nombre || apellido) {
        const nameParts = [nombre, segundoNombre, apellido].filter(Boolean);
        displayName = nameParts.join(' ');
      }

      return NextResponse.json({
        message: 'Invitación enviada exitosamente',
        recipient: {
          email: email,
          displayName,
          institucion: institucion || 'Sin institución'
        }
      });

    } catch (emailError) {
      console.error('Error sending website invitation email:', emailError);
      
      return NextResponse.json(
        { message: 'Error al enviar el email de invitación' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in website invitation API:', error);
    
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para validar emails en lote (sin cambios)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { emails } = body;

    if (!Array.isArray(emails)) {
      return NextResponse.json(
        { message: 'Se requiere un array de emails' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validationResults = emails.map((email: string) => ({
      email,
      isValid: emailRegex.test(email),
      error: !emailRegex.test(email) ? 'Formato de email inválido' : null
    }));

    return NextResponse.json({
      results: validationResults,
      summary: {
        total: emails.length,
        valid: validationResults.filter(r => r.isValid).length,
        invalid: validationResults.filter(r => !r.isValid).length
      }
    });

  } catch (error) {
    console.error('Error in email validation API:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}