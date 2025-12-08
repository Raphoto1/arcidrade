import { createUserData, getUserData } from "@/controller/userData.controller";
import { NextResponse } from "next/server";
import { sendErrorLogMail } from "@/utils/sendMail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export const GET = async (request: Request) => {
  try {
    // Verificar sesión antes de procesar
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado - Sesión inválida" },
        { status: 401 }
      );
    }
    
    const mainUserData = await getUserData();    
    return NextResponse.json({ 
      message: "Profesional data success",
      success: true,
      payload: mainUserData 
    });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json(
      { 
        error: "Error al obtener datos del profesional",
        message: error instanceof Error ? error.message : "Error desconocido"
      }, 
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    const response = await createUserData(body);
    
    const duration = Date.now() - startTime;
    
    return NextResponse.json({ 
      message: "Profesional API Post!",
      success: true 
    }, {status:201});
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Enviar email con el log del error
    try {
      const body = await request.clone().json().catch(() => ({}));
      const session = await getServerSession();
      
      await sendErrorLogMail({
        errorType: error instanceof Error ? error.constructor.name : 'Unknown Error',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        userEmail: session?.user?.email || body?.email || undefined,
        userName: body?.name || undefined,
        endpoint: 'POST /api/platform/profesional',
        requestBody: body,
        timestamp: new Date().toLocaleString('es-ES', { 
          timeZone: 'America/New_York',
          dateStyle: 'full',
          timeStyle: 'long'
        }),
        userAgent: request.headers.get('user-agent') || undefined,
      });
    } catch (emailError) {
      console.error('Error al enviar email de log:', emailError);
    }
    
    return NextResponse.json({ 
      error: "Error al guardar los datos del profesional",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};
