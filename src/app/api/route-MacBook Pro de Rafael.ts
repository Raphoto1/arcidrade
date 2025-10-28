
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = 'Successfully connected to api route';
    return NextResponse.json(await response);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const response = 'Successfully connected to api route Post';
    return NextResponse.json(await response);
}