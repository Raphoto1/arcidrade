import { deleteInstitutionSpeciality, getInstitutionSpeciality, updateInstitutionSpeciality } from "@/controller/institutionData.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const speciality = await getInstitutionSpeciality(id);
    return NextResponse.json({ message: "Profesional speciality data success", payload: speciality }, { status: 200 });
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
    const update = await updateInstitutionSpeciality(id, body);
    return NextResponse.json({ message: `especializacion con ID ${id} actualizado` }, { status: 200 });
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
    const deleteResult = await deleteInstitutionSpeciality(id);
    return NextResponse.json({ message: `especializacion con ID ${id} eliminado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
