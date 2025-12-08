
import { NextRequest, NextResponse } from "next/server";
import { sendContactMail } from "@/utils/sendMail";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Función para validar el formato de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

// Función para sanitizar texto (prevenir inyección)
function sanitizeText(text: string): string {
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
             .replace(/<[^>]*>/g, '')
             .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();


    // Validación de campos requeridos
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !body[field as keyof ContactFormData]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Campos requeridos faltantes", 
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validación de formato de email
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Formato de email inválido" 
        },
        { status: 400 }
      );
    }

    // Validación de longitud de campos
    if (body.name.length < 2 || body.name.length > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: "El nombre debe tener entre 2 y 100 caracteres" 
        },
        { status: 400 }
      );
    }

    if (body.message.length < 10 || body.message.length > 2000) {
      return NextResponse.json(
        { 
          success: false, 
          error: "El mensaje debe tener entre 10 y 2000 caracteres" 
        },
        { status: 400 }
      );
    }

    // Validación de asuntos permitidos
    const validSubjects = [
      'informacion-general',
      'soporte-tecnico', 
      'registro-profesional',
      'registro-institucion',
      'colaboracion',
      'otro'
    ];

    if (!validSubjects.includes(body.subject)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Asunto no válido" 
        },
        { status: 400 }
      );
    }

    // Sanitizar los datos de entrada
    const sanitizedData: ContactFormData = {
      name: sanitizeText(body.name),
      email: body.email.toLowerCase().trim(),
      phone: body.phone ? sanitizeText(body.phone) : undefined,
      subject: body.subject,
      message: sanitizeText(body.message)
    };

    // Validación adicional del teléfono si se proporciona
    if (sanitizedData.phone && sanitizedData.phone.length > 20) {
      return NextResponse.json(
        { 
          success: false, 
          error: "El número de teléfono es demasiado largo" 
        },
        { status: 400 }
      );
    }

    // Enviar emails usando la función sendContactMail
    const emailResult = await sendContactMail(sanitizedData);



    return NextResponse.json({
      success: true,
      message: "Mensaje de contacto enviado exitosamente",
      data: {
        adminMessageId: emailResult.adminMessageId,
        userMessageId: emailResult.userMessageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error in contact form endpoint:", error);

    // Manejo específico de errores de email
    if (error instanceof Error) {
      if (error.message.includes("configuración del servidor")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Error de configuración del servidor de correo. Por favor, inténtalo más tarde." 
          },
          { status: 503 }
        );
      }
      
      if (error.message.includes("emails de contacto")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Error al enviar el mensaje. Por favor, inténtalo más tarde." 
          },
          { status: 500 }
        );
      }
    }

    // Error genérico
    return NextResponse.json(
      { 
        success: false, 
        error: "Error interno del servidor. Por favor, inténtalo más tarde." 
      },
      { status: 500 }
    );
  }
}

// Método GET para verificar que el endpoint funciona
export async function GET() {
  return NextResponse.json({
    message: "Contact API endpoint is working",
    timestamp: new Date().toISOString()
  });
}
