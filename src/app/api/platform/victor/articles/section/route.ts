import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  getArticlesCountService,
  getArticlesSectionVisibilityService,
  upsertArticlesSectionVisibilityService,
} from "@/service/Articles.service";

function canManageArticles(session: any) {
  return ["victor", "colab"].includes(session?.user?.area);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!canManageArticles(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const isActive = await getArticlesSectionVisibilityService();
    return NextResponse.json({
      success: true,
      payload: {
        sectionKey: "articles",
        isActive,
      },
    });
  } catch (error) {
    console.error("Error al obtener visibilidad de articulos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!canManageArticles(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const body = await request.json();
    if (typeof body?.isActive !== "boolean") {
      return NextResponse.json({ error: "isActive debe ser boolean" }, { status: 400 });
    }

    if (body.isActive) {
      const articleCount = await getArticlesCountService();
      if (articleCount === 0) {
        return NextResponse.json(
          { error: "No puedes activar la seccion sin articulos cargados" },
          { status: 409 }
        );
      }
    }

    const updated = await upsertArticlesSectionVisibilityService(body.isActive);

    return NextResponse.json({
      success: true,
      payload: {
        sectionKey: updated.sectionKey,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error("Error al actualizar visibilidad de articulos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
