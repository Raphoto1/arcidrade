import { getAllActiveInstitutions, getAllInstitutions, getAllPausedInstitutions } from "@/controller/institutionData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const institutions = await getAllPausedInstitutions();
    return NextResponse.json({ message: "Institution data success", payload: institutions });
  } catch (error) {
    console.error("Error in Institution API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};