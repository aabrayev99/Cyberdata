import { NextRequest, NextResponse } from 'next/server'
import { getAllCourses } from '@/lib/db-simple'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published') !== 'false'
    
    const courses = await getAllCourses(published)
    
    return NextResponse.json({
      success: true,
      courses
    })
    
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}