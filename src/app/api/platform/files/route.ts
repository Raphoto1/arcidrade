import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const blobUrl = req.nextUrl.searchParams.get("url");
  if (!blobUrl) {
    return NextResponse.json({ error: "Falta parámetro url" }, { status: 400 });
  }

  // Validar que la URL pertenece a nuestro Blob store
  if (!blobUrl.includes(".blob.vercel-storage.com/")) {
    return NextResponse.json({ error: "URL no permitida" }, { status: 400 });
  }

  // Extraer el user_id del path: usersData/{user_id}/{folder}/{filename}
  const match = blobUrl.match(/usersData\/([^/]+)\//);
  const fileOwnerId = match?.[1];

  const canAccess =
    !fileOwnerId ||
    session.user.id === fileOwnerId ||
    ["victor", "admin", "colab", "institution", "manager"].includes(
      session.user.area as string
    );

  if (!canAccess) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const response = await fetch(blobUrl, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Error al obtener archivo" },
      { status: response.status }
    );
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": "inline",
    },
  });
}
