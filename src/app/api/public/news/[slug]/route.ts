import { NextRequest, NextResponse } from "next/server";
import { getNewsArticleBySlug } from "@/static/data/newsData";

export async function GET(_request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;

    const payload = getNewsArticleBySlug(slug) ?? null;

    return NextResponse.json({ success: true, payload });
  } catch (error) {
    console.error("Error al obtener detalle de novedad:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
