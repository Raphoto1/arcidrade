import { NextRequest, NextResponse } from "next/server";
import { updateProcessStatusByManagerById  } from "@/controller/process.controller";

// export async function GET(request: NextRequest) {
//   const status = request.nextUrl.pathname.split("/").pop();
//   const processList = await getProcessesByStatus(status);
//   // console.log(processList);
//   return NextResponse.json({ message: "Process data success", payload: processList });
// }

export async function PUT(request: NextRequest) {
  const status = request.nextUrl.pathname.split("/").pop() ?? "";
  if (!status) {
    return NextResponse.json({ message: "Status parameter missing", payload: {} }, { status: 400 });
  }
  const body = await request.json();
  const idNumber = parseInt(body.id);
  const result = await updateProcessStatusByManagerById (idNumber, status);
  return NextResponse.json({ message: "Process updated successfully", payload: result });
}
