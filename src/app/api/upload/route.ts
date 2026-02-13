import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type = data.get('type') as string // 'profile', 'course', 'video'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type based on upload type
    const allowedTypes: Record<string, string[]> = {
      profile: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      course: ['image/jpeg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    }

    const validTypes = allowedTypes[type] || allowedTypes.course

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Check file size (10MB for images, 100MB for videos)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size too large. Maximum size: ${type === 'video' ? '100MB' : '10MB'}` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Convert to base64 for temporary storage solution
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    // For now, return the data URL (this is a temporary solution)
    // In production, you would upload to a cloud storage service like:
    // - Vercel Blob Storage
    // - AWS S3
    // - Cloudinary
    // - etc.
    
    const fileUrl = dataUrl

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}