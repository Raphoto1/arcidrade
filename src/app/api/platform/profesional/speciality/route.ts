import {  getUserData, getUserSpecialities } from "@/controller/userData.controller";
import { createSpeciality } from "@/controller/userData.controller";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
      const userSpecialities = await getUserSpecialities();
      console.log('endpoint specialities',userSpecialities);
    return NextResponse.json({ message: "Profesional data success" , payload:userSpecialities});
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
      const body = await request.json();
      console.log(body);
      const response = await createSpeciality(body);
    return NextResponse.json({ message: "Profesional API Post!" }, {status:201});
  } catch (error) {
    console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 401 });
  }
};

export const DELETE = async (request: Request) => {
    try {
        const body = await request.json();
            return NextResponse.json({ message: "Profesional API Post!" }, {status:201});
    } catch (error) {
           console.error("Error in Profesional API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 401 }); 
    }
}