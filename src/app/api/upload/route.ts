import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // El middleware ya valida la autenticación, pero obtenemos el token para info del usuario
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const contentType = req.headers.get('content-type') || 'application/octet-stream'
    const filename = req.nextUrl.searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'Falta el parámetro filename' }, { status: 400 })
    }

    // Validaciones adicionales de seguridad
    const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument']
    const isValidType = allowedTypes.some(type => contentType.startsWith(type))
    
    if (!isValidType) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes, PDFs y documentos de Word.' 
      }, { status: 400 })
    }

    // Crear nombre de archivo único con info del usuario
    const userFolder = token.sub || 'anonymous'
    const timestamp = Date.now()
    const uniqueFilename = `testing/${userFolder}/${timestamp}-${filename}`
    
    const blob = await put(uniqueFilename, req.body!, {
      access: 'public',
      contentType,
    })

    return NextResponse.json({
      success: true,
      blob,
      message: 'Archivo subido exitosamente (ruta de pruebas)',
      uploadedBy: token.email,
      uploadedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error en upload de pruebas:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor al subir archivo' 
    }, { status: 500 })
  }
}
