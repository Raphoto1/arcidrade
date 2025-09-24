import { deleteUserSpecialitie, getSpeciality, makeFavoriteSpeciality, updateSpecialization } from "@/controller/userData.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const speciality = await getSpeciality(id);
    console.log("llama especialitycon id:", id);

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
    console.log("recibo en post la actualizacion");
    //envio a actualizar
    const body = await req.json();
    console.log("body en la pet", body);
    //normalizar la data para enviar directo a update
    const data = body;
    //aajuste de enddate
    let endDateFix = data.endDate;
    if (endDateFix === "") {
      endDateFix = null;
    } else {
      endDateFix = new Date(data.endDate);
    }
    //ajuste de startdate
    let startDateFix = data.startDate;
    if (startDateFix === "") {
      startDateFix = null;
    } else {
      startDateFix = new Date(data.startDate);
    }
    const specialPack = {
      institution: data.titleInstitution,
      title: data.title,
      title_category: data.title_category,
      status: data.titleStatus,
      country: data.country,
      start_date: startDateFix,
      end_date: endDateFix,
    };
    const update = await updateSpecialization(id, specialPack);
    console.log("update", update);

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
    const deleteResult = await deleteUserSpecialitie(id);
    return NextResponse.json({ message: `especializacion con ID ${id} eliminado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
//DESARROLLO FUTURO
export const PUT = async (req: NextRequest, { params }: any) => {
  try {
    //capturo el id
    const param = await params;
    const id: number = parseInt(param.id);
    const result = await makeFavoriteSpeciality(id);
    console.log(result);   
    return NextResponse.json({ message: `especializacion con ID ${id} maarcado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: put", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
