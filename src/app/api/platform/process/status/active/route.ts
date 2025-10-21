import { NextRequest, NextResponse } from "next/server";
import { getAllActiveProcesses } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    const processList = await getAllActiveProcesses();
    // console.log(processList);
    return NextResponse.json({ message: "Process data success" , payload:processList});
}
