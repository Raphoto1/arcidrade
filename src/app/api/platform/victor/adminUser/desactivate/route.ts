
import { NextRequest, NextResponse } from "next/server";
import { desactivateUser } from "../../../../../../controller/victor.controller";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const userId = body.userId;
        const response = await desactivateUser(userId);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in PUT api route:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}
