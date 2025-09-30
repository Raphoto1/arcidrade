import { getUserData, getUserFull } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const mainUserData = await getUserFull();
    return NextResponse.json({ message: "Profesional data success", payload: mainUserData });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
