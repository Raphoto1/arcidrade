import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { desactivateUser } from "../../../../../../controller/victor.controller";
import { updateUserDescription } from "../../../../../../controller/victor.controller";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Solo Victor, Manager y Colab pueden actualizar descripciones
    if (!['victor', 'manager', 'colab'].includes(session.user.area || '')) {
      return NextResponse.json(
        { error: "Acceso denegado. Solo Victor, Manager y Colab pueden acceder." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const userId = body.userId;
    const area = body.area;
    const description = body.description;
    const response = await updateUserDescription(userId, area, description);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in PUT api route:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
