import { createUserData, getUserData, updateUserData } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log(body);
    const response = await updateUserData({ description: body.description });
    console.log(response);

    // const response = await createUserData(body);
    //distribuir la data en las tablas, ajustar status
    return NextResponse.json({ message: "Profesional API Post!" }, { status: 201 });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
