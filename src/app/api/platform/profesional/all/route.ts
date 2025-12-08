import { createUserCertification, getAllProfesionals, getUserCertifications } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const profesionals = await getAllProfesionals();
    return NextResponse.json({ message: "Profesional data success", payload: profesionals });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
