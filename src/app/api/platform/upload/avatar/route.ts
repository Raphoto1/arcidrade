import { uploadUserAvatar } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
    }
    const blob = await uploadUserAvatar(file);
    return NextResponse.json(blob);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar imagen de perfil";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
