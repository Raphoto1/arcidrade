import { NextRequest, NextResponse } from "next/server";
import { getPublicProcessesByStatusService } from "@/service/process.service";
import { withPrismaRetry } from "@/utils/retryUtils";

export async function GET(request: NextRequest) {
  try {
    // Llamar al servicio con retry logic para manejar errores transientes
    const allProcessList = await withPrismaRetry(() => 
      getPublicProcessesByStatusService("active")
    );
    return NextResponse.json({ message: "Public process data success", payload: allProcessList });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error in Public Process API:", {
      message: errorMsg,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Retornar error más específico (pero sin exponer detalles internos)
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: errorMsg.includes('connect') || errorMsg.includes('timeout') 
          ? "Database connection error" 
          : "Failed to fetch processes"
      }, 
      { status: 500 }
    );
  }
}
