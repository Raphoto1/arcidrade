import { createColabData, getColabData } from "@/controller/colab.controller";

import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const mainUserData = await getColabData();
    return NextResponse.json({ message: "Colaborador data success", payload: mainUserData });
  } catch (error: any) {
    console.error("Error in Colaborador API:", error);

    if (error.message === "No autenticado") {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const response = await createColabData(body);
    return NextResponse.json({ message: "Colaborador data guardado exitosamente", payload: response }, { status: 200 });
  } catch (error: any) {
    console.error("Error in Colaborador API POST:", error);

    if (error.message === "No autenticado") {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (error.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
