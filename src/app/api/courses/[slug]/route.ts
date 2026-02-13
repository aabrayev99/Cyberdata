import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { pool } from '@/lib/db-simple'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    const { rows } = await pool.query(
      `SELECT c.*, u.name as instructor_name, u.bio as instructor_bio, u.image as instructor_image
       FROM courses c 
       JOIN users u ON c."instructorId" = u.id 
       WHERE c.slug = $1`,
      [slug]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const course = rows[0]

    return NextResponse.json({
      success: true,
      course: course
    })

  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const slug = params.slug
    const { title, shortDescription, description, level, price, duration, image } = await request.json()

    // Get current course to check permissions
    const { rows: courseRows } = await pool.query(
      'SELECT * FROM courses WHERE slug = $1',
      [slug]
    )

    if (courseRows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const course = courseRows[0]

    // Check if user can edit this course
    if (session.user.role !== 'ADMIN' && session.user.id !== course.instructorId) {
      return NextResponse.json(
        { error: 'Access denied. You can only edit your own courses.' },
        { status: 403 }
      )
    }

    // Validation
    if (!title || title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters long' },
        { status: 400 }
      )
    }

    if (!shortDescription || shortDescription.trim().length < 10) {
      return NextResponse.json(
        { error: 'Short description must be at least 10 characters long' },
        { status: 400 }
      )
    }

    if (!description || description.trim().length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters long' },
        { status: 400 }
      )
    }

    if (!['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(level)) {
      return NextResponse.json(
        { error: 'Invalid level' },
        { status: 400 }
      )
    }

    // Create new slug if title changed
    let newSlug = slug
    if (title.trim() !== course.title) {
      newSlug = title.toLowerCase()
        .replace(/[^a-z0-9а-я\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
    }

    // Update course
    const { rows } = await pool.query(
      `UPDATE courses SET 
        title = $1, 
        "shortDescription" = $2, 
        description = $3, 
        slug = $4,
        level = $5, 
        price = $6, 
        duration = $7, 
        image = $8,
        "updatedAt" = CURRENT_TIMESTAMP 
       WHERE id = $9 
       RETURNING *`,
      [
        title.trim(),
        shortDescription.trim(),
        description.trim(),
        newSlug,
        level,
        price || 0,
        duration || 1,
        image?.trim() || null,
        course.id
      ]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
      )
    }

    const updatedCourse = rows[0]

    return NextResponse.json({
      success: true,
      course: updatedCourse
    })

  } catch (error: any) {
    console.error('Error updating course:', error)
    
    // Handle unique constraint violation (slug already exists)
    if (error.code === '23505' && error.constraint?.includes('slug')) {
      return NextResponse.json(
        { error: 'A course with similar title already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}