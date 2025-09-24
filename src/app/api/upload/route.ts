import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contentType = req.headers.get('content-type') || 'application/octet-stream'
  const filename = req.nextUrl.searchParams.get('filename')

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 })
  }
    
  const blob = await put(filename, req.body!, {
    access: 'public',
    contentType,
  })

  return NextResponse.json(blob)
}