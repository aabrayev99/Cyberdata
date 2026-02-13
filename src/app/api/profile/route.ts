import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { pool } from '@/lib/db-simple'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { name, bio, image } = await request.json()
    
    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      )
    }
    
    // Update user profile
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, bio = $2, image = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, role, bio, image',
      [name.trim(), bio?.trim() || null, image?.trim() || null, session.user.id]
    )
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const updatedUser = rows[0]
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    })
    
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get current user profile
    const { rows } = await pool.query(
      'SELECT id, name, email, role, bio, image, "createdAt" FROM users WHERE id = $1',
      [session.user.id]
    )
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: rows[0]
    })
    
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}