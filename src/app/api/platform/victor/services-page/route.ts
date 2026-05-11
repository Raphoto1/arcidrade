import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/db";
import { withPrismaRetry } from "@/utils/retryUtils";

function isVictor(session: any) {
  return session?.user?.area === "victor";
}

function getServicesDelegate() {
  const delegate = (prisma as any).servicesPageData;
  if (!delegate) {
    throw new Error("Prisma delegate servicesPageData no disponible");
  }
  return delegate;
}

function normalizeServicesLink(link: unknown): { value?: string; error?: string } {
  const rawLink = typeof link === "string" ? link.trim() : "";
  if (!rawLink) return { value: "" };

  if (rawLink.startsWith("/")) {
    return { value: rawLink };
  }

  try {
    const url = new URL(rawLink);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { error: "El enlace debe ser ruta interna (/services) o URL http(s)" };
    }
    return { value: rawLink };
  } catch {
    return { error: "El enlace no es valido" };
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (!isVictor(session)) return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });

    const servicesPageData = getServicesDelegate();

    const items = await withPrismaRetry(() =>
      servicesPageData.findMany({
        orderBy: [{ order: "asc" }, { created_at: "asc" }],
      })
    );

    return NextResponse.json({ success: true, payload: items });
  } catch (error: any) {
    if (error?.code === "P2021") {
      return NextResponse.json(
        { error: "La tabla de cards de Services aun no existe en la base de datos." },
        { status: 503 }
      );
    }
    console.error("Error al obtener cards de Services:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (!isVictor(session)) return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });

    const body = await request.json();
    const { title, extraText, description, image, link, order, contact } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "El titulo es requerido" }, { status: 400 });
    }

    if (!extraText || typeof extraText !== "string" || !extraText.trim()) {
      return NextResponse.json({ error: "El texto sobre imagen es requerido" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "La descripcion es requerida" }, { status: 400 });
    }

    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json({ error: "La imagen es requerida" }, { status: 400 });
    }

    try {
      const parsed = new URL(image.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "La URL de imagen debe iniciar con http:// o https://" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "La URL de imagen no es valida" }, { status: 400 });
    }

    const normalizedLink = normalizeServicesLink(link);
    if (normalizedLink.error) {
      return NextResponse.json({ error: normalizedLink.error }, { status: 400 });
    }

    const servicesPageData = getServicesDelegate();

    const created = await withPrismaRetry(() =>
      servicesPageData.create({
        data: {
          title: title.trim(),
          extraText: extraText.trim(),
          description: description.trim(),
          image: image.trim(),
          link: normalizedLink.value || null,
          order: order != null && order !== "" ? Number(order) : null,
          contact: contact === true,
        },
      })
    );

    return NextResponse.json({ success: true, payload: created }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2021") {
      return NextResponse.json(
        { error: "La tabla de cards de Services aun no existe en la base de datos." },
        { status: 503 }
      );
    }
    console.error("Error al crear card de Services:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
