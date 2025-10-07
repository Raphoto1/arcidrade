import { NextRequest, NextResponse } from "next/server";
import { createProcess, getProcessesByStatus, getProcessesByUserId } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
const status = request.nextUrl.pathname.split('/').pop();
    const processList = await getProcessesByStatus(status);
    console.log(processList);
    return NextResponse.json({ message: "Process data success" , payload:processList});
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const processCreated = await createProcess(body);
    return NextResponse.json({ message: "Process created successfully", payload: processCreated });
}