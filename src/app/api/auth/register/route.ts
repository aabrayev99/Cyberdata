import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail, generateId } from '@/lib/db-simple'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Create user
    const userId = generateId()
    const user = await createUser({
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'STUDENT' // Default role
    })
    
    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}