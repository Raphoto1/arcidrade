import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";
import { ensureArticleSlugAvailableService } from "@/service/Articles.service";

const DEFAULT_ARTICLE_IMAGE = "https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg";

function canManageArticles(session: any) {
  return ["victor", "colab"].includes(session?.user?.area);
}

function createSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function validatePayload(body: any) {
  const title = String(body?.title ?? "").trim();
  const shortText = String(body?.shortText ?? "").trim();
  const image = String(body?.image ?? "").trim();
  const contentHtml = String(body?.contentHtml ?? "").trim();
  const sourceSlug = String(body?.slug ?? body?.title ?? "");
  const slug = createSlug(sourceSlug);

  if (!title) return { error: "El titulo es obligatorio" };
  if (title.length > 180) return { error: "El titulo no puede superar 180 caracteres" };

  if (!slug) return { error: "El slug es obligatorio" };

  if (!shortText) return { error: "El texto corto es obligatorio" };
  if (shortText.length > 320) return { error: "El texto corto no puede superar 320 caracteres" };

  if (image) {
    try {
      const imageUrl = new URL(image);
      if (!imageUrl.protocol.startsWith("http")) {
        return { error: "La URL de imagen debe usar http o https" };
      }
    } catch {
      return { error: "La URL de imagen no es valida" };
    }
  }

  if (!contentHtml) return { error: "El contenido enriquecido es obligatorio" };

  const publishedAt = String(body?.publishedAt ?? "").trim();
  if (!publishedAt) return { error: "La fecha de publicacion es obligatoria" };

  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) {
    return { error: "La fecha de publicacion no es valida" };
  }

  return {
    payload: {
      title,
      slug,
      shortText,
      image: image || DEFAULT_ARTICLE_IMAGE,
      contentHtml,
      publishedAt: date,
      isActive: body?.isActive !== false,
    },
  };
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
    const validated = validatePayload(body);

    if ("error" in validated) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const slugAvailable = await ensureArticleSlugAvailableService(validated.payload.slug, numId);
    if (!slugAvailable) {
      return NextResponse.json({ error: "Ya existe un articulo con ese slug" }, { status: 400 });
    }

    const updated = await withPrismaRetry(() =>
      (prisma as any).article.update({
        where: { id: numId },
        data: validated.payload,
      })
    );

    return NextResponse.json({ success: true, payload: updated });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Articulo no encontrado" }, { status: 404 });
    }
    console.error("Error al actualizar articulo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    await withPrismaRetry(() =>
      (prisma as any).article.delete({
        where: { id: numId },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Articulo no encontrado" }, { status: 404 });
    }
    console.error("Error al eliminar articulo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
