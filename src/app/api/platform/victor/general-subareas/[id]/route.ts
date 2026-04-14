import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";

function isVictor(session: any) {
  return session?.user?.area === "victor";
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isVictor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { sub_area, description } = body;

    if (!sub_area || typeof sub_area !== "string" || !sub_area.trim()) {
      return NextResponse.json({ error: "El nombre de la sub-área es requerido" }, { status: 400 });
    }

    const trimmed = sub_area.trim();

    if (trimmed.length > 100) {
      return NextResponse.json({ error: "El nombre no puede superar 100 caracteres" }, { status: 400 });
    }

    const updated = await withPrismaRetry(() =>
      prisma.generalProfesionalSubAreas.update({
        where: { id: numId },
        data: {
          sub_area: trimmed,
          description: description?.trim() || null,
        },
      })
    );

    return NextResponse.json({ success: true, payload: updated });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Sub-área no encontrada" }, { status: 404 });
    }
    console.error("Error al actualizar sub-área general:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isVictor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await withPrismaRetry(() =>
      prisma.generalProfesionalSubAreas.delete({
        where: { id: numId },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Sub-área no encontrada" }, { status: 404 });
    }
    console.error("Error al eliminar sub-área general:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
