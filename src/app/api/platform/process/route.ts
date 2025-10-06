import { NextRequest, NextResponse } from "next/server";
import { createProcess, getProcessesByUserId } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    const response = 'Successfully connected to api route';
    const processList = await getProcessesByUserId();
    console.log(processList);
    
    return NextResponse.json({ message: "Process data success" , payload:processList});
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log(body);
    const processCreated = await createProcess(body);
    const response = 'Successfully connected to api route Post';
    return NextResponse.json(await response);
}