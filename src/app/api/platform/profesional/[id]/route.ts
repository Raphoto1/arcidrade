import { getProfesionalByReferCode } from "@/controller/userData.controller";
import { authOptions } from "@/utils/authOptions";
import { canViewProfessionalProfileById } from "@/utils/platformPermissions";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const param = await params;
    const id: string = param.id;

    if (!canViewProfessionalProfileById(session.user.area, id, session.user.referCode)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const user = await getProfesionalByReferCode(id);
    return NextResponse.json({ message: "Profesional user data success", payload: user }, { status: 200 });
  } catch (error) {
    console.error("Error in Profesional API: getspprofesionalbyrefercode", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};