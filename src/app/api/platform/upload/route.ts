import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file");
  const link = formData.get("link");
//PRUEBA DE CAPTURA GENERAL NO USAR AUN
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }

  const blob = await put(`/cv/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  console.log("blob en back", blob);
  console.log("url to save", blob.url);

  return NextResponse.json(blob);
}
