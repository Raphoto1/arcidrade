import { NextRequest, NextResponse } from "next/server";
import { getAllCompletedProcesses } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    try {
        const allProcessList = await getAllCompletedProcesses();
        return NextResponse.json({ message: "Process data success", payload: allProcessList });
    } catch (error) {
        console.error("Error fetching completed processes:", error);
        return NextResponse.json(
            { message: "Error fetching completed processes", payload: [] },
            { status: 500 }
        );
    }
}
