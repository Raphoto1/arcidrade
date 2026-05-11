import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";
import { servicesItems as staticServicesItems } from "@/static/data/staticData";

type ServicesPageDelegate = {
  findMany: (args: { orderBy: Array<Record<string, "asc" | "desc">> }) => Promise<unknown[]>;
};

function getServicesDelegate() {
  const delegate = (prisma as any).servicesPageData as ServicesPageDelegate | undefined;
  if (!delegate) {
    throw new Error("Prisma delegate servicesPageData no disponible");
  }
  return delegate;
}

function buildStaticPayload() {
  return staticServicesItems.map((item: any, index: number) => ({
    id: -(index + 1),
    title: item.title,
    extraText: item.extraText ?? null,
    description: item.longText ?? item.description ?? null,
    image: item.image ?? null,
    link: item.link ?? null,
    order: index + 1,
    contact: item.contact ?? false,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const servicesPageData = getServicesDelegate();

    const items = await withPrismaRetry(() =>
      servicesPageData.findMany({
        orderBy: [{ order: "asc" }, { created_at: "asc" }],
      })
    );

    const payload = items.length ? items : buildStaticPayload();

    return NextResponse.json({ success: true, payload });
  } catch (error: any) {
    if (error?.code === "P2021") {
      return NextResponse.json({ success: true, payload: buildStaticPayload() });
    }
    console.error("Error al obtener Services publico:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
