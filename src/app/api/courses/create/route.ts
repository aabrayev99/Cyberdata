import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { createCourse, generateId, generateSlug } from '@/lib/db-simple'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user can create courses
    if (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins and instructors can create courses' },
        { status: 403 }
      )
    }
    
    const {
      title,
      description,
      shortDescription,
      level,
      price,
      duration,
      image
    } = await request.json()
    
    // Validation
    if (!title || !description || !level) {
      return NextResponse.json(
        { error: 'Title, description, and level are required' },
        { status: 400 }
      )
    }
    
    // Generate unique ID and slug
    const courseId = generateId()
    const slug = generateSlug(title)
    
    // Create course
    const course = await createCourse({
      id: courseId,
      title,
      slug,
      description,
      shortDescription,
      image,
      level,
      price: price || 0,
      duration,
      instructorId: session.user.id
    })
    
    return NextResponse.json({
      success: true,
      course
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error creating course:', error)
    
    // Handle unique constraint violation (duplicate slug)
    if (error.constraint === 'courses_slug_key') {
      return NextResponse.json(
        { error: 'A course with this title already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}