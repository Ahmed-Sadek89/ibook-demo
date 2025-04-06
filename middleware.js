import { NextResponse } from 'next/server'

export function middleware (request) {
  const cookies = request.cookies

  const studentRoutes = [
    '/home',
    '/levels',
    '/levels/books',
    '/quizzes-reports',
    '/reports',
    '/book'
  ]
  const parentRoutes = ['/parent', '/student', '/add-student']

  const token = cookies.get('ibook-auth')
  let role = cookies.get('ibook-role')
  if (role && typeof role === 'object' && 'value' in role) {
    role = role.value
  } else {
    role = ''
  }

  const currentPath = request.nextUrl.pathname

  // Redirect unauthenticated users trying to access protected routes
  if (
    !token &&
    (studentRoutes.some(route => currentPath.startsWith(route)) ||
      parentRoutes.some(route => currentPath.startsWith(route)))
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Handle redirection for the root path `/`
  if (currentPath === '/') {
    if (token) {
      if (role === 'student') {
        return NextResponse.redirect(new URL('/home', request.url))
      } else if (role === 'parent') {
        return NextResponse.redirect(new URL('/parent', request.url))
      }
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users based on their roles
  if (token) {
    if (
      role === 'student' &&
      !studentRoutes.some(route => currentPath.startsWith(route))
    ) {
      return NextResponse.redirect(new URL('/home', request.url))
    } else if (
      role === 'parent' &&
      !parentRoutes.some(route => currentPath.startsWith(route))
    ) {
      return NextResponse.redirect(new URL('/parent', request.url))
    }
  }

  // Allow the request to proceed if no redirect is needed
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/parent',
    '/student/:path*',
    '/add-student',
    '/home',
    '/levels',
    '/levels/books',
    '/quizzes-reports',
    '/reports',
    '/book/:path*'
  ]
}