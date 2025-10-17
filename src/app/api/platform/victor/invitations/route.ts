import { NextRequest, NextResponse } from "next/server";

import { getInvitationsByStatus } from "@/controller/victor.controller";

export async function GET(request: NextRequest) {
    const invitationStatus = request.nextUrl.searchParams.get("status");
    const invitationsList = await getInvitationsByStatus(invitationStatus || '');
    return NextResponse.json({ message: 'Successfully fetched invitations', payload: invitationsList });
}