import { NextRequest, NextResponse } from "next/server";
import { getAllActiveProcesses } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    try {
        const allProcessList = await getAllActiveProcesses();
        return NextResponse.json({ message: "Process data success", payload: allProcessList });
    } catch (error) {
        console.error("Error fetching active processes:", error);
        return NextResponse.json(
            { message: "Error fetching active processes", payload: [] },
            { status: 500 }
        );
    }
}
