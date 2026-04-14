import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";

function isVictor(session: any) {
  return session?.user?.area === "victor";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isVictor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const subAreas = await withPrismaRetry(() =>
      prisma.generalProfesionalSubAreas.findMany({
        orderBy: { created_at: "asc" },
      })
    );

    return NextResponse.json({ success: true, payload: subAreas });
  } catch (error) {
    console.error("Error al obtener sub-áreas generales:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isVictor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
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

    const existing = await prisma.generalProfesionalSubAreas.findFirst({
      where: { sub_area: { equals: trimmed, mode: "insensitive" } },
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe una sub-área con ese nombre" }, { status: 409 });
    }

    const created = await withPrismaRetry(() =>
      prisma.generalProfesionalSubAreas.create({
        data: {
          sub_area: trimmed,
          description: description?.trim() || null,
        },
      })
    );

    return NextResponse.json({ success: true, payload: created }, { status: 201 });
  } catch (error) {
    console.error("Error al crear sub-área general:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
