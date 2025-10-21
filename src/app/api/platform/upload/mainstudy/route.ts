import { deleteCv, deleteUserMainStudy, updateUserData, uploadUserCv, uploadUserCvLink, uploadUserMainStudyFile, uploadUserMainStudyLink } from "@/controller/userData.controller";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const link = formData.get("link");


    //verificar si es archivo o es link
    if (link) {
      const linkUpload = await uploadUserMainStudyLink(link)
      return NextResponse.json(linkUpload);
    } else if (file) {
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
      }
        const blob = await uploadUserMainStudyFile(file);
      return NextResponse.json(blob);
    } else {
      return NextResponse.json({ error: "Error al agregar cv" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error al agregar cv" }, { status: 400 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const deleteCvResponse = await deleteUserMainStudy();
    return NextResponse.json({message:'deletemainResponse confirm'});
  } catch (error) {
    return NextResponse.json({ error: "Error al agregar cv" }, { status: 400 });
  }
}
