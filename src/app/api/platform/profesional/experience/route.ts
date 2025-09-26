import { createUserExperience, getUserExperiences } from "@/controller/userData.controller";
import { createSpeciality } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const userExperiences = await getUserExperiences();
    console.log("experiencias del usuario:", userExperiences);
    
    return NextResponse.json({ message: "Profesional experience success", payload: userExperiences });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log("form desde endpoint experience", body);
    const response = await createUserExperience(body);
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
