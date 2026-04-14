import { NextRequest, NextResponse } from "next/server";
import { getAllArchivedProcesses } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
  try {
    const allProcessList = await getAllArchivedProcesses();
    return NextResponse.json({ message: "Process data success", payload: allProcessList });
  } catch (error) {
    console.error("Error fetching archived processes:", error);
    return NextResponse.json(
      { message: "Error fetching archived processes", payload: [] },
      { status: 500 }
    );
  }
}
