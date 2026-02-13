import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `${type}-${timestamp}-${Math.random().toString(36).substr(2)}${fileExtension}`

    // Create directory structure
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Return URL
    const fileUrl = `/uploads/${type}/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
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