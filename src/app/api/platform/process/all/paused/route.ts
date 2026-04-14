import { NextRequest, NextResponse } from "next/server";
import { getAllPausedProcesses } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
  try {
    const allProcessList = await getAllPausedProcesses();
    return NextResponse.json({ message: "Process data success", payload: allProcessList });
  } catch (error) {
    console.error("Error fetching paused processes:", error);
    return NextResponse.json(
      { message: "Error fetching paused processes", payload: [] },
      { status: 500 }
    );
  }
}
