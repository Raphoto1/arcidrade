import { updatePeriodOfProcessById } from "@/controller/process.controller";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const id = body.id;
        const result = await updatePeriodOfProcessById(id, body);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error en la peticion:", error);
        return NextResponse.json({ error: "Error en la peticion" }, { status: 500 });
    }
}