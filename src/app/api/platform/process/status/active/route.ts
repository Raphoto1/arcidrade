import { NextRequest, NextResponse } from "next/server";
import { getProcessesByStatus } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    const processList = await getProcessesByStatus("active");
    // console.log(processList);
    return NextResponse.json({ message: "Process data success" , payload:processList});
}
