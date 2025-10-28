
import { getProcessById, getProfesionalsSelectedByProcessId, updateProcessById } from "@/controller/process.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
      // const process = await getProcessById(id);
      console.log(id);
      const selected = await getProfesionalsSelectedByProcessId(id);
      console.log("selected", selected);
      
    return NextResponse.json({ message: "process data success", payload: selected }, { status: 200 });
  } catch (error) {
    console.error("Error in process API: getprocess", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};