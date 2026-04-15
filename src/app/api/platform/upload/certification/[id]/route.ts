//imports de app
import { NextResponse, NextRequest } from "next/server";
//imports propios
import { uploadSpecialityLink, uploadUserSpecialityFile, updateSpecialization, uploadUserCertificationLink, uploadUserCertificationFile } from "@/controller/userData.controller";



export const POST = async (req: NextRequest, { params }: any) => {
  try {
    //capturo el id
    const param = await params;
    const id: number = parseInt(param.id);
    const formData = await req.formData();
    const file = formData.get("file");
    const link = formData.get("link");
    //verificar si es archivo o es link
    if (link) {
      const linkUpload = await uploadUserCertificationLink(id, link);
      return NextResponse.json(linkUpload);
    } else if (file) {
        if (!file || !(file instanceof File)) {    
        return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
      }
        const blob = await uploadUserCertificationFile(id, file);
      return NextResponse.json(blob);
    } else {
      return NextResponse.json({ error: "Error al agregar cv" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al guardar respaldo de certificación";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};