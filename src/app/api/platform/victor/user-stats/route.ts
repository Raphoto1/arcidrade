import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getUserStatsService } from "@/service/userData.service";
import { withPrismaRetry } from "@/utils/retryUtils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Victor y Manager tienen acceso completo sobre toda la plataforma
    // Solo permitir acceso a usuarios con area 'manager' o 'victor'
    if (session.user.area !== 'manager' && session.user.area !== 'victor') {
      return NextResponse.json(
        { error: `Acceso denegado - Area actual: ${session.user.area}` },
        { status: 403 }
      );
    }

    const stats = await withPrismaRetry(() => getUserStatsService());

    return NextResponse.json({
      success: true,
      payload: stats
    });

  } catch (error) {
    console.error("Error getting user stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}