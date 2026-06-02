import { NextResponse } from "next/server";
import {
  getArticlesSectionVisibilityService,
  getPublicArticlesService,
} from "@/service/Articles.service";

export async function GET() {
  try {
    const isSectionActive = await getArticlesSectionVisibilityService();

    if (!isSectionActive) {
      return NextResponse.json({ success: true, payload: [] });
    }

    const payload = await getPublicArticlesService();
    return NextResponse.json({ success: true, payload });
  } catch (error) {
    console.error("Error al obtener articulos publicos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
