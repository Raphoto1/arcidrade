
import { getInstitutionDataByReferCode, getInstitutionDataFullById } from "@/controller/institutionData.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
      const id: string = param.id
      console.log("id institution", id);
      
    const user = await getInstitutionDataFullById(id);
    return NextResponse.json({ message: "Profesional user data success", payload: user }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: getspprofesionalbyrefercode", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};