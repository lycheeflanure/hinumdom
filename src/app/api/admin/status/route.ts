import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/adminAuth'

export async function GET(request: Request) {
  const authenticated = isAdminRequest(request)
  return NextResponse.json({
    authenticated,
    role: authenticated ? 'admin' : 'guest',
  })
}
