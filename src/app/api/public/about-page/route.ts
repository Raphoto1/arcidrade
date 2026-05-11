import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";
import { aboutItems as staticAboutItems } from "@/static/data/staticData";

type AboutPageDelegate = {
  findMany: (args: { orderBy: Array<Record<string, "asc" | "desc">> }) => Promise<unknown[]>;
};

function getAboutDelegate() {
  const delegate = (prisma as any).aboutPageData as AboutPageDelegate | undefined;
  if (!delegate) {
    throw new Error("Prisma delegate aboutPageData no disponible");
  }
  return delegate;
}

function buildStaticPayload() {
  return staticAboutItems.map((item: any, index: number) => ({
    id: -(index + 1),
    title: item.title,
    description: item.description ?? null,
    image: item.image ?? null,
    link: item.link ?? "/about",
    order: index + 1,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const aboutPageData = getAboutDelegate();

    const items = await withPrismaRetry(() =>
      aboutPageData.findMany({
        orderBy: [{ order: "asc" }, { created_at: "asc" }],
      })
    );

    const payload = items.length ? items : buildStaticPayload();

    return NextResponse.json({ success: true, payload });
  } catch (error: any) {
    if (error?.code === "P2021") {
      return NextResponse.json({ success: true, payload: buildStaticPayload() });
    }
    console.error("Error al obtener About publico:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
