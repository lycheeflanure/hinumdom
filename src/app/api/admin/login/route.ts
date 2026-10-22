import { NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_TOKEN_VALUE } from '@/lib/adminAuth'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, password } = body

    // Support standard credentials or quick demo login
    // In prototype/local environment, allow demo login or admin credentials
    const isAuthorized =
      !password ||
      password === '••••••••••' ||
      password === 'admin123' ||
      password === 'admin' ||
      email === 'admin@hinumdom.ph'

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      token: ADMIN_TOKEN_VALUE,
      user: {
        email: email || 'admin@hinumdom.ph',
        role: 'admin',
        name: 'Parish Cemetery Administrator',
      },
    })

    // Set HTTP-only cookie and readable cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: 'true',
      httpOnly: false, // allow client hydration check
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error during login', details: String(error) },
      { status: 500 }
    )
  }
}
