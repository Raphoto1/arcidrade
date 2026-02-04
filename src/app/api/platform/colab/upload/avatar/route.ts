import { uploadUserAvatar } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }

  const blob = uploadUserAvatar(file);

  return NextResponse.json(blob);
}
