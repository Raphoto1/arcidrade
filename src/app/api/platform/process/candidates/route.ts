import { NextRequest, NextResponse } from "next/server";
import {
  addProfesionalToProcess,
  createProcess,
  deleteProfesionalFromProcess,
  getProcessesByUserId,
  updateProfesionalFromProcessInstitution,
} from "@/controller/process.controller";
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
    const userId = body.profesional_id;
    const processId = body.process_id;
    const status = body.status || "listed";
    const is_arcidrade = body.isArcidrade || false;
    const added_by = body.added_by || "";
    const addProfToProcess = await addProfesionalToProcess(processId, userId, status, is_arcidrade, added_by);
    return NextResponse.json({ message: "Process created successfully", payload: addProfToProcess });
  } catch (error) {
    console.error("Error adding professional to process:", error);
    return NextResponse.json({ message: "Error adding professional to process", payload: {} });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.profesional_id;
    const processId = body.process_id;
    const status = body.status || "listed";
    const is_arcidrade = body.isArcidrade || false;
    const added_by = body.added_by || "";
    const dataPack = {
      profesional_id: userId,
      process_id: processId,
      process_status: status,
      is_arcidrade: is_arcidrade,
      added_by: added_by,
    };
    const updateProfInProcess = await updateProfesionalFromProcessInstitution(processId, userId, added_by, dataPack);

    return NextResponse.json({ message: "Process updated successfully", payload: updateProfInProcess });
  } catch (error) {
    console.error("Error updating professional in process:", error);
    return NextResponse.json({ message: "Error updating professional in process", payload: {} });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userID;
    const processId = body.processId;
    const deleteProfFromProcess = await deleteProfesionalFromProcess(processId, userId);

    return NextResponse.json({ message: "Professional removed from process successfully", payload: deleteProfFromProcess });
  } catch (error) {
    console.error("Error removing professional from process:", error);
    return NextResponse.json({ message: "Error removing professional from process", payload: {} });
  }
}
