import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";

export async function GET() {
  try {
    const subAreas = await withPrismaRetry(() =>
      prisma.generalProfesionalSubAreas.findMany({
        select: { id: true, sub_area: true },
        orderBy: { sub_area: "asc" },
      })
    );

    return NextResponse.json({ success: true, payload: subAreas });
  } catch (error) {
    console.error("Error al obtener sub-áreas generales:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
