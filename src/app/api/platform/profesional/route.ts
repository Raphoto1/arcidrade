import { createUserData, getUserData } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const mainUserData = await getUserData();
    console.log('mainUserData',mainUserData);
    
    return NextResponse.json({ message: "Profesional API is working!" , paylaod:mainUserData});
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const response = await createUserData(body);
    //distribuir la data en las tablas, ajustar status
    return NextResponse.json({ message: "Profesional API is working!" });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
