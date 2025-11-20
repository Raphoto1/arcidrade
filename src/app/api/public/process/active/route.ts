import { NextRequest, NextResponse } from "next/server";
import { getPublicProcessesByStatusService } from "@/service/process.service";

export async function GET(request: NextRequest) {
  try {
    // Llamar directamente al servicio público que incluye datos de institución
    const allProcessList = await getPublicProcessesByStatusService("active");
    return NextResponse.json({ message: "Public process data success", payload: allProcessList });
  } catch (error) {
    console.error("Error in Public Process API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
