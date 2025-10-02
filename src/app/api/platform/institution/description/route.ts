import { updateInstitutionData } from "@/controller/institutionData.controller";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log(body);
    const response = await updateInstitutionData({ description: body.description });
    console.log(response);
    return NextResponse.json({ message: "Institución API Post!" }, { status: 201 });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
