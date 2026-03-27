import { deleteCv, deleteUserMainStudy, updateUserData, uploadUserCv, uploadUserCvLink, uploadUserMainStudyFile, uploadUserMainStudyLink } from "@/controller/userData.controller";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const link = formData.get("link");
    const isHomologatedValue = formData.get("isHomologated");
    const isHomologated =
      typeof isHomologatedValue === "string"
        ? isHomologatedValue === "true"
        : undefined;


    //verificar si es archivo o es link
    if (link) {
      const linkUpload = await uploadUserMainStudyLink(link, isHomologated)
      return NextResponse.json(linkUpload);
    } else if (file) {
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
      }
        const blob = await uploadUserMainStudyFile(file, isHomologated);
      return NextResponse.json(blob);
    } else if (typeof isHomologated === "boolean") {
      const updateHomologated = await uploadUserMainStudyLink(null, isHomologated);
      return NextResponse.json(updateHomologated);
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
