import { getUserDataGeneral, createUserData } from "@/controller/userData.controller";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado - Sesión inválida" }, { status: 401 });
    }

    const data = await getUserDataGeneral();
    return NextResponse.json({
      message: "Profesional General data success",
      success: true,
      payload: data,
    });
  } catch (error) {
    console.error("Error in Profesional General GET:", error);
    return NextResponse.json(
      {
        error: "Error al obtener datos del profesional general",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado - Sesión inválida" }, { status: 401 });
    }

    const body = await request.json();
    await createUserData(body);

    return NextResponse.json({ message: "Datos guardados correctamente", success: true }, { status: 201 });
  } catch (error) {
    console.error("Error in Profesional General POST:", error);
    return NextResponse.json(
      {
        error: "Error al guardar los datos",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};
