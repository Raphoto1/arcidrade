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
    const { title, description, image, link, order } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
    }

    if (title.trim().length > 200) {
      return NextResponse.json({ error: "El título no puede superar 200 caracteres" }, { status: 400 });
    }

    const updated = await withPrismaRetry(() =>
      prisma.homePageDataCarousel.update({
        where: { id: numId },
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          image: image?.trim() || null,
          link: link?.trim() || null,
          order: order != null && order !== "" ? Number(order) : null,
        },
      })
    );

    return NextResponse.json({ success: true, payload: updated });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Slide no encontrado" }, { status: 404 });
    }
    console.error("Error al actualizar slide del carousel:", error);
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
      prisma.homePageDataCarousel.delete({ where: { id: numId } })
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Slide no encontrado" }, { status: 404 });
    }
    console.error("Error al eliminar slide del carousel:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
