import { NextRequest, NextResponse } from "next/server";
import { getAllPendingProcesses } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    try {
        const allProcessList = await getAllPendingProcesses();
        return NextResponse.json({ message: "Process data success", payload: allProcessList });
    } catch (error) {
        console.error("Error fetching pending processes:", error);
        return NextResponse.json(
            { message: "Error fetching pending processes", payload: [] },
            { status: 500 }
        );
    }
}
