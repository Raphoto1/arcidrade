import { deleteInstitutionCertification, getInstitutionCertification, updateInstitutionCertification } from "@/controller/institutionData.controller";
import { deleteUserCertification, getCertificationById, updateCertification } from "@/controller/userData.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const certification = await getInstitutionCertification(id);
    return NextResponse.json({ message: "Profesional Certification data success", payload: certification }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: getspeciality", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: any) => {
  try {
    //capturo el id
    const param = await params;
    const id: number = parseInt(param.id);
    //envio a actualizar
    const body = await req.json();
    const update = await updateInstitutionCertification(id, body);
    return NextResponse.json({ message: `certificación  con ID ${id} actualizado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    //capturo el id
    const param = await params;
    const id: number = parseInt(param.id);
    //envio a controller directo
    const deleteResult = await deleteInstitutionCertification(id);
    return NextResponse.json({ message: `especializacion con ID ${id} eliminado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

