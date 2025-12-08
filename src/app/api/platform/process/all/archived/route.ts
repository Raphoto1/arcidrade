import { NextRequest, NextResponse } from "next/server";
import { getAllArchivedProcesses, getAllPausedProcesses } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
  const response = "Successfully connected to api route";
  const allProcessList = await getAllArchivedProcesses();
  return NextResponse.json({ message: "Process data success", payload: allProcessList });
}
