import { NextRequest, NextResponse } from "next/server";
import { createProcess, getAllActiveProcesses, getAllPendingProcesses, getAllProcesses, getProcessesByUserId } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    const response = 'Successfully connected to api route';
    const allProcessList = await getAllActiveProcesses();
    console.log('Procesos activos desde API:', allProcessList?.length || 'sin datos');
    return NextResponse.json({ message: "Process data success" , payload:allProcessList});
}
