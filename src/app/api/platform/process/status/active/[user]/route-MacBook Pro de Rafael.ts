
import { NextResponse, NextRequest } from "next/server";

import { getProcessesWhereProfesionalIsListed} from "@/controller/process.controller";

export const GET = async (req: NextRequest, { params }: any) => {
  try {
    const param = await params;
    const userId: string = param.user;
    console.log('userId',userId);
    
    const process = await getProcessesWhereProfesionalIsListed(userId);
    return NextResponse.json({ message: "process data success", payload: process }, { status: 200 });
  } catch (error) {
    console.error("Error in process API: getprocess", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};