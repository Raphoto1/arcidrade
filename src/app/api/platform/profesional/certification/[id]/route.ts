import { deleteUserCertification, deleteUserSpecialitie, getCertificationById, makeFavoriteSpeciality, updateCertification, updateSpecialization } from "@/controller/userData.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const certification = await getCertificationById(id);
    console.log("llama cert con id:", id);
    return NextResponse.json({ message: "Profesional speciality data success", payload: certification }, { status: 200 });
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
    console.log("recibo en post la actualizacion");
    //envio a actualizar
    const body = await req.json();
    console.log("body en la pet", body);
    const update = await updateCertification(id, body);
    console.log("update", update);
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
    console.log('delete cart', id);
    //envio a controller directo
    const deleteResult = await deleteUserCertification(id);
    return NextResponse.json({ message: `especializacion con ID ${id} eliminado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

