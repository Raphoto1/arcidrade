import { NextRequest, NextResponse } from "next/server";
import { getPublicHomeStructureService } from "@/service/Home.service";

export async function GET(request: NextRequest) {
	try {
		const payload = await getPublicHomeStructureService();

		return NextResponse.json(
			{
				success: true,
				message: "Public home structure loaded",
				payload,
			},
			{ status: 200 }
		);
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		console.error("Error in publicStructure API:", {
			message: errorMsg,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json(
			{
				success: false,
				error: "Internal Server Error",
				message:
					errorMsg.includes("connect") || errorMsg.includes("timeout")
						? "Database connection error"
						: "Failed to fetch home structure",
			},
			{ status: 500 }
		);
	}
}
