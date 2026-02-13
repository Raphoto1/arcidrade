import { NextRequest, NextResponse } from "next/server";
import { getPublicProcessByIdService } from "@/service/process.service";
import { withPrismaRetry } from "@/utils/retryUtils";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const processId = Number(params.id);
    if (!processId || Number.isNaN(processId)) {
      return NextResponse.json({ error: "Invalid process id" }, { status: 400 });
    }

    const process = await withPrismaRetry(() => getPublicProcessByIdService(processId));

    if (!process) {
      return NextResponse.json({ error: "Process not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Public process data success", payload: process }, { status: 200 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error in Public Process API:", {
      message: errorMsg,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: errorMsg.includes("connect") || errorMsg.includes("timeout")
          ? "Database connection error"
          : "Failed to fetch process",
      },
      { status: 500 }
    );
  }
}
