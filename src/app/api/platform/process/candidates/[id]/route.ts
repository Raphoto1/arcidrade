import { getProfesionalsSelectedByProcessId, updateProfesionalFromProcessVictor, deleteProfesionalFromProcessVictor } from "@/controller/process.controller";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const selected = await getProfesionalsSelectedByProcessId(id);
    return NextResponse.json({ message: "process data success", payload: selected }, { status: 200 });
  } catch (error) {
    console.error("Error in process API: getprocess", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const body = await req.json();
    const updated = await updateProfesionalFromProcessVictor(id, body);
    return NextResponse.json({ message: "process data success", payload: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in process API: getprocess", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const id: number = parseInt(param.id);
    const body = await req.json();
    const deleted = await deleteProfesionalFromProcessVictor(id, body);
    return NextResponse.json({ message: "process data success", payload: deleted }, { status: 200 });
  } catch (error) {
    console.error("Error in process API: getprocess", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
