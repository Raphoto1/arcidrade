import { uploadUserAvatar } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file");

  
//PRUEBA DE CAPTURA GENERAL NO USAR AUN
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }
//hacer blob upload a nuueva carpeta avatar
  const blob = uploadUserAvatar(file);

  return NextResponse.json(blob);
}
