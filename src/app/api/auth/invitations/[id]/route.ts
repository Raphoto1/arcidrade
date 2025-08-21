import { getInvitationById } from "@/service/invitations.service"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id
    const response = id
    console.log(id);
    
    // Fetch the invitation details from your database or service
    const invitation = await getInvitationById(id)
    if (!invitation) {
        return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }
    return NextResponse.json(invitation, { status: 200 })
}
