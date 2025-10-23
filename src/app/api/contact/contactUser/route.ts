import { NextRequest, NextResponse } from "next/server";
import { sendContactAdminMail } from "@/utils/sendMail";
import { getUserEmailByRefferCodeDao } from "@/dao/dao";

interface ContactUserData {
  userId: string;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validar que el request tenga contenido
    const body = await request.json();
    
    // Validar campos requeridos
    const { userId, name } = body;
    
    if (!userId || !name) {
      return NextResponse.json(
        { 
          error: "Campos requeridos faltantes", 
          message: "userId y name son requeridos" 
        },
        { status: 400 }
      );
    }

    // Validar formato de userId (debe ser un UUID válido)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { 
          error: "userId inválido", 
          message: "Por favor proporciona un userId válido" 
        },
        { status: 400 }
      );
    }

    // Validar longitud del name
    if (name.length > 100) {
      return NextResponse.json(
        { 
          error: "Name demasiado largo", 
          message: "El nombre excede la longitud máxima permitida (100 caracteres)" 
        },
        { status: 400 }
      );
    }

    // Obtener información del usuario desde la base de datos usando DAO
    const userMail = await getUserEmailByRefferCodeDao(userId);

    if (!userMail) {
      return NextResponse.json(
        { 
          error: "Usuario no encontrado", 
          message: "No se encontró un usuario con el ID proporcionado o no tiene email registrado" 
        },
        { status: 404 }
      );
    }

    // Validar longitud del email obtenido
    if (userMail.length > 100) {
      return NextResponse.json(
        { 
          error: "Email inválido", 
          message: "El email del usuario excede la longitud permitida" 
        },
        { status: 400 }
      );
    }

    // Preparar datos para el email
    const userData = {
      userId: userId,
      name: name.trim(), // Usar el name recibido en lugar de genérico
      email: userMail
    };

    // Enviar email de contacto con administrador (formato estándar)
    const standardContactData = {
      ...userData,
      subject: "Contacto requerido con administrador",
      message: "Se requiere contacto directo con el administrador para completar el proceso."
    };
    
    const result = await sendContactAdminMail(standardContactData);
    
    return NextResponse.json(
      { 
        success: true,
        message: "Email de contacto con administrador enviado exitosamente",
        data: {
          messageId: result.messageId,
          sentTo: userData.email,
          userName: userData.name,
          userId: userData.userId,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error en endpoint contactUser:", error);
    
    // Manejar diferentes tipos de errores
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: "JSON inválido", 
          message: "El formato de los datos enviados es incorrecto" 
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("SMTP")) {
      return NextResponse.json(
        { 
          error: "Error del servidor de correo", 
          message: "Problema temporal con el envío de emails. Inténtalo más tarde." 
        },
        { status: 503 }
      );
    }

    // Error de base de datos
    if (error instanceof Error && (error.message.includes("Prisma") || error.message.includes("database"))) {
      return NextResponse.json(
        { 
          error: "Error de base de datos", 
          message: "Problema temporal con la base de datos. Inténtalo más tarde." 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: "Error interno del servidor", 
        message: "Ha ocurrido un error inesperado. Por favor contacta al soporte.",
        details: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
}

// Método GET para verificar que el endpoint está disponible
export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/contact/contactUser",
      method: "POST",
      description: "Envía un email estándar al usuario solicitándole contactar con el administrador usando userId y name",
      requiredFields: ["userId", "name"],
      optionalFields: [],
      status: "active"
    },
    { status: 200 }
  );
}
