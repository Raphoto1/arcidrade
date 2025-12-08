import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getAllCampaignLeads, getCampaignLeadsStats } from "@/controller/victor.controller";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar que el usuario es Victor
    if (session.user.area !== "victor") {
      return NextResponse.json(
        { success: false, message: "Acceso denegado. Solo Victor puede acceder." },
        { status: 403 }
      );
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "recent"; // recent, stats, all
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 5;

    if (type === "stats") {
      // Retornar estadísticas de leads
      const stats = await getCampaignLeadsStats();
      return NextResponse.json({
        success: true,
        payload: stats
      });
    }

    // Retornar leads (recent o all)
    const result = await getAllCampaignLeads({
      status,
      limit: type === "recent" ? limit : undefined,
      page: 1,
      orderBy: type === "recent" ? "created_at" : undefined,
      order: type === "recent" ? "desc" : undefined
    });

    return NextResponse.json({
      success: true,
      payload: result.leads,
      total: result.total,
      type
    });

  } catch (error) {
    console.error("Error en GET /api/platform/victor/campaign/leads:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}