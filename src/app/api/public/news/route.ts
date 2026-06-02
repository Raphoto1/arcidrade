import { NextResponse } from "next/server";
import { getSortedNewsArticles } from "@/static/data/newsData";

export async function GET() {
  try {
    const payload = getSortedNewsArticles();

    return NextResponse.json({ success: true, payload });
  } catch (error) {
    console.error("Error al obtener novedades publicas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
