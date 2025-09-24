import { deleteUserSpecialitie } from "@/controller/userData.controller";
import { NextResponse, NextRequest } from "next/server";

export const DELETE = async (req: NextRequest,{params}: any) => {
  try {
    //capturo el id
    const param = await params;
    const id:number = parseInt(param.id);
    //envio a controller directo
    const deleteResult = await deleteUserSpecialitie(id);
    return NextResponse.json({ message: `especializacion con ID ${id} eliminado` }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: delete", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};


