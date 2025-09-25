import { createUserCertification, getUserCertifications } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const userCertifications = await getUserCertifications();
    return NextResponse.json({ message: "Profesional data success", payload: userCertifications });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
      const body = await request.json();
      console.log('POST body:',body);
      const response = await createUserCertification(body);
    return NextResponse.json({ message: "Profesional API Post!" }, { status: 201 });
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 401 });
  }
};


