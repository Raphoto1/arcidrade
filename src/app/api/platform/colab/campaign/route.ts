import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getAllCampaignLeads } from "@/controller/victor.controller";

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

    // Verificar que el usuario es Colab
    if (session.user.area !== "colab") {
      return NextResponse.json(
        { success: false, message: "Acceso denegado. Solo Colab puede acceder." },
        { status: 403 }
      );
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // Filtrar por estado
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

    const result = await getAllCampaignLeads({
      status,
      limit,
      page,
      orderBy: "created_at",
      order: "desc"
    });

    return NextResponse.json({
      success: true,
      payload: result.leads,
      pagination: {
        total: result.total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching campaign leads:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
