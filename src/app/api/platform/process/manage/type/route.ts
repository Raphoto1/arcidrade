import { NextRequest, NextResponse } from "next/server";
import { updateTypeOfProcessById } from "@/controller/process.controller";

export const PUT = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const processId = Number(body.id);
        const type = body.type;
        if (!processId || !type) {
            return NextResponse.json({ error: "Missing required fields: id or type" }, { status: 400 });
        }
        const response = await updateTypeOfProcessById(processId, type);
        return NextResponse.json({ message: `process manage type updated` }, { status: 200 });
    } catch (error) {
        console.error("Error in process manage type API: put", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}