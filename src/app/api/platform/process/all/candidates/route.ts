import { NextRequest, NextResponse } from "next/server";
import { createProcess, getAllPendingProcesses, getAllProcesses, getAllProfesionalsPostulatedByAddedBy, getProcessesByUserId } from "@/controller/process.controller";

export async function GET(request: NextRequest) {
    const response = 'Successfully connected to api route';
  const listOfProfesionals = await getAllProfesionalsPostulatedByAddedBy(null);
  return NextResponse.json({ message: "Process data success" , payload:listOfProfesionals});
}