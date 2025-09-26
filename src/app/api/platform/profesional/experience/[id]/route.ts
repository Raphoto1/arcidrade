import { deleteUserCertification, deleteUserExperience, deleteUserSpecialitie, getCertificationById, getUserExperienceById, makeFavoriteSpeciality, updateCertification, updateSpecialization, updateUserExperience } from "@/controller/userData.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const certification = await getUserExperienceById(id);
    console.log("llama exp con id:", id);
    return NextResponse.json({ message: "Profesional experience data success", payload: certification }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: getexperience", error);
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
    console.log("body en la pet experience", body);
    const update = await updateUserExperience(id, body);
    console.log("update en la pet experience", update);
    return NextResponse.json({ message: `experience  con ID ${id} actualizado` }, { status: 200 });
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
    const deleteResult = await deleteUserExperience(id);
    return NextResponse.json({ message: `experiience con ID ${id} eliminado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

