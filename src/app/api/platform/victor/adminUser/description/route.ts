import { NextRequest, NextResponse } from "next/server";
import { desactivateUser } from "../../../../../../controller/victor.controller";
import { updateUserDescription } from "../../../../../../controller/victor.controller";
export async function POST(request: NextRequest) {
  try {
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
