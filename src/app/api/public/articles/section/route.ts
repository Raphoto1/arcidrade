import { NextResponse } from "next/server";
import { getArticlesSectionVisibilityService } from "@/service/Articles.service";

export async function GET() {
  try {
    const isActive = await getArticlesSectionVisibilityService();

    return NextResponse.json({
      success: true,
      payload: {
        sectionKey: "articles",
        isActive,
      },
    });
  } catch (error) {
    console.error("Error al obtener estado publico de la seccion articulos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
