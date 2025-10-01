import { createInstitutionData, getInstitutionData } from "@/controller/institutionData.controller";
import { createUserData, getUserData } from "@/controller/userData.controller";
import { log } from "console";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const mainUserData = await getInstitutionData();
    console.log("mainUserData", mainUserData);

    return NextResponse.json({ message: "Profesional data success", payload: mainUserData });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log(body);
    const response = await createInstitutionData(body);
    //distribuir la data en las tablas, ajustar status
    return NextResponse.json({ message: "Profesional API Post!" }, { status: 201 });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
