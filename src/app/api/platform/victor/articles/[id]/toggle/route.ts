import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";

function canManageArticles(session: any) {
  return ["victor", "colab"].includes(session?.user?.area);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!canManageArticles(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;
    const numId = parseInt(id, 10);

    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }

    const body = await request.json();
    if (typeof body?.isActive !== "boolean") {
      return NextResponse.json({ error: "isActive debe ser boolean" }, { status: 400 });
    }

    const updated = await withPrismaRetry(() =>
      (prisma as any).article.update({
        where: { id: numId },
        data: { isActive: body.isActive },
      })
    );

    return NextResponse.json({ success: true, payload: updated });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Articulo no encontrado" }, { status: 404 });
    }

    console.error("Error al actualizar estado del articulo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
