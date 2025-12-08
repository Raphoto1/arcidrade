import { NextRequest, NextResponse } from "next/server";
import { createProcess, getAllCompletedProcesses, getAllProcesses, getProcessesByUserId } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    const response = 'Successfully connected to api route';
    const allProcessList = await getAllCompletedProcesses()
    return NextResponse.json({ message: "Process data success" , payload:allProcessList});
}
