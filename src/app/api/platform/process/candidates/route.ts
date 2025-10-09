import { NextRequest, NextResponse } from "next/server";
import { addProfesionalToProcess, createProcess, deleteProfesionalFromProcess, getProcessesByUserId } from "@/controller/process.controller";
//llamar candidatos
// export async function GET(request: NextRequest) {
//   try {
//     const response = "Successfully connected to api route";
//     // const processList = await getProcessesByUserId();
//     console.log(processList);
//     return NextResponse.json({ message: "Process data success", payload: {} });
//   } catch (error) {
//     console.error("Error fetching process data:", error);
//     return NextResponse.json({ message: "Error fetching process data", payload: {} });
//   }
// }
//agregar candidatos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // const processCreated = await createProcess(body);
    const userId = body.userID;
    const processId = body.processId;
    const status = body.status || "listed";
    const is_arcidrade = body.isArcidrade || false;
    console.log("userID", userId);
    console.log("processId", processId);
    const addProfToProcess = await addProfesionalToProcess(processId, userId, status, is_arcidrade);
    console.log("addProfToProcess", addProfToProcess);
    // return NextResponse.json({ message: "Process created successfully", payload: processCreated });
    return NextResponse.json({ message: "Process created successfully", payload: addProfToProcess });
  } catch (error) {
    console.error("Error adding professional to process:", error);
    return NextResponse.json({ message: "Error adding professional to process", payload: {} });
  }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const userId = body.userID;
        const processId = body.processId;
        console.log("userID", userId);
        console.log("processId", processId);
        const deleteProfFromProcess = await deleteProfesionalFromProcess(processId, userId);
        console.log("deleteProfFromProcess", deleteProfFromProcess);
        return NextResponse.json({ message: "Professional removed from process successfully", payload: deleteProfFromProcess });
        
    } catch (error) {
        console.error("Error removing professional from process:", error);
        return NextResponse.json({ message: "Error removing professional from process", payload: {} });
    }
}
