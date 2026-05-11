import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";

function isVictor(session: any) {
  return session?.user?.area === "victor";
}

function getMainOffersDelegate() {
  const delegate = (prisma as any).homePageDataMainOffers;
  if (!delegate) {
    throw new Error("Prisma delegate homePageDataMainOffers no disponible");
  }
  return delegate;
}

function normalizeMainOfferLink(link: unknown): { value?: string; error?: string } {
  const rawLink = typeof link === "string" ? link.trim() : "";
  if (!rawLink) return { value: "/offers" };

  if (rawLink.startsWith("/")) {
    return { value: rawLink };
  }

  try {
    const url = new URL(rawLink);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { error: "El enlace debe ser ruta interna (/offers) o URL http(s)" };
    }
    return { value: rawLink };
  } catch {
    return { error: "El enlace no es valido" };
  }
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
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, image, link, order } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "El titulo es requerido" }, { status: 400 });
    }

    if (title.trim().length > 200) {
      return NextResponse.json({ error: "El titulo no puede superar 200 caracteres" }, { status: 400 });
    }

    const normalizedLink = normalizeMainOfferLink(link);
    if (normalizedLink.error) {
      return NextResponse.json({ error: normalizedLink.error }, { status: 400 });
    }

    const mainOffers = getMainOffersDelegate();

    const updated = await withPrismaRetry(() =>
      mainOffers.update({
        where: { id: numId },
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          image: image?.trim() || null,
          link: normalizedLink.value || "/offers",
          order: order != null && order !== "" ? Number(order) : null,
        },
      })
    );

    return NextResponse.json({ success: true, payload: updated });
  } catch (error: any) {
    if (error?.code === "P2021") {
      return NextResponse.json(
        { error: "La tabla de tarjetas principales aun no existe en la base de datos." },
        { status: 503 }
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Tarjeta no encontrada" }, { status: 404 });
    }
    console.error("Error al actualizar tarjeta del primer grid:", error);
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
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }

    const mainOffers = getMainOffersDelegate();

    await withPrismaRetry(() => mainOffers.delete({ where: { id: numId } }));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2021") {
      return NextResponse.json(
        { error: "La tabla de tarjetas principales aun no existe en la base de datos." },
        { status: 503 }
      );
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Tarjeta no encontrada" }, { status: 404 });
    }
    console.error("Error al eliminar tarjeta del primer grid:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
