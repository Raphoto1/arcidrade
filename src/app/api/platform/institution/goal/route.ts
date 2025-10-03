import { createInstitutionGoal, getInstitutionGoals } from "@/controller/institutionData.controller";
import { createUserExperience, getUserExperiences } from "@/controller/userData.controller";
import { createSpeciality } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const userGoals = await getInstitutionGoals();
    console.log("logros del usuario:", userGoals);

    return NextResponse.json({ message: "Logros obtenidos con éxito", payload: userGoals });
  } catch (error) {
    console.error("Error en la API de Logros:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log("form desde endpoint goal", body);
    const response = await createInstitutionGoal(body);
    return NextResponse.json({ message: "Profesional API Post!" }, { status: 201 });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 401 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Profesional API Post!" }, { status: 201 });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 401 });
  }
};
