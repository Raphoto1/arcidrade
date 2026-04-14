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

    const items = await withPrismaRetry(() =>
      prisma.homePageDataCarousel.findMany({
        orderBy: [{ order: "asc" }, { created_at: "asc" }],
      })
    );

    return NextResponse.json({ success: true, payload: items });
  } catch (error) {
    console.error("Error al obtener carousel:", error);
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
    const { title, description, image, link, order } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
    }

    if (title.trim().length > 200) {
      return NextResponse.json({ error: "El título no puede superar 200 caracteres" }, { status: 400 });
    }

    const created = await withPrismaRetry(() =>
      prisma.homePageDataCarousel.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          image: image?.trim() || null,
          link: link?.trim() || null,
          order: order != null && order !== "" ? Number(order) : null,
        },
      })
    );

    return NextResponse.json({ success: true, payload: created }, { status: 201 });
  } catch (error) {
    console.error("Error al crear slide del carousel:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
