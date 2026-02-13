import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const pathname = req.nextUrl.pathname

    // Admin routes
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Instructor routes
    if (pathname.startsWith('/instructor') || 
        (pathname.startsWith('/courses/create') || pathname.includes('/edit'))) {
      if (token?.role !== 'ADMIN' && token?.role !== 'INSTRUCTOR') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Protected routes requiring authentication
    if (pathname.startsWith('/profile') || 
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/courses/') && pathname.includes('/lesson/')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        
        // Allow access to public routes
        if (pathname === '/' || 
            pathname.startsWith('/auth/') ||
            pathname.startsWith('/api/auth/') ||
            pathname === '/courses' ||
            pathname.startsWith('/courses/') && !pathname.includes('/lesson/')) {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/instructor/:path*',
    '/courses/create/:path*',
    '/courses/:id/edit/:path*',
    '/courses/:id/lesson/:path*'
  ]
}