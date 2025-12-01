import { createUserData, getUserData } from "@/controller/userData.controller";
import { NextResponse } from "next/server";
import { sendErrorLogMail } from "@/utils/sendMail";
import { getServerSession } from "next-auth";

export const GET = async (request: Request) => {
  try {
    const mainUserData = await getUserData();    
    return NextResponse.json({ message: "Profesional data success" , payload:mainUserData});
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  const startTime = Date.now();
  console.log('[POST /api/platform/profesional] Iniciando petición...');
  
  try {
    const body = await request.json();
    console.log('[POST /api/platform/profesional] Datos recibidos:', JSON.stringify(body, null, 2));
    
    const response = await createUserData(body);
    
    const duration = Date.now() - startTime;
    console.log(`[POST /api/platform/profesional] ✓ Éxito - Completado en ${duration}ms`);
    
    return NextResponse.json({ 
      message: "Profesional API Post!",
      success: true 
    }, {status:201});
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[POST /api/platform/profesional] ✗ Error después de ${duration}ms:`, error);
    console.error('[POST /api/platform/profesional] Stack trace:', error instanceof Error ? error.stack : 'No stack available');
    
    // Enviar email con el log del error
    try {
      const body = await request.clone().json().catch(() => ({}));
      const session = await getServerSession();
      
      await sendErrorLogMail({
        errorType: error instanceof Error ? error.constructor.name : 'Unknown Error',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        userEmail: session?.user?.email || body?.email || undefined,
        userName: session?.user?.name || body?.name || undefined,
        endpoint: 'POST /api/platform/profesional',
        requestBody: body,
        timestamp: new Date().toLocaleString('es-ES', { 
          timeZone: 'America/New_York',
          dateStyle: 'full',
          timeStyle: 'long'
        }),
        userAgent: request.headers.get('user-agent') || undefined,
      });
      console.log('[POST /api/platform/profesional] ✓ Email de error enviado a info@creativerafa.com');
    } catch (emailError) {
      console.error('[POST /api/platform/profesional] ✗ Error al enviar email de log:', emailError);
    }
    
    return NextResponse.json({ 
      error: "Error al guardar los datos del profesional",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};
