// src/lib/adminAuth.ts
// Server and client authentication utilities for Admin access control

export const ADMIN_COOKIE_NAME = 'hinumdom_admin_session'
export const ADMIN_TOKEN_VALUE = 'hinumdom_authorized_admin_token_2026'

/**
 * Checks if the request comes from an authenticated admin.
 * Evaluates both the HTTP cookie and authorization header.
 */
export function isAdminRequest(request: Request): boolean {
  // 1. Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader === `Bearer ${ADMIN_TOKEN_VALUE}`) {
    return true
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parseCookies(cookieHeader)
  if (cookies[ADMIN_COOKIE_NAME] === 'true' || cookies[ADMIN_COOKIE_NAME] === ADMIN_TOKEN_VALUE) {
    return true
  }

  // 3. Check custom admin header
  const adminHeader = request.headers.get('x-admin-token')
  if (adminHeader === ADMIN_TOKEN_VALUE) {
    return true
  }

  return false
}

function parseCookies(cookieString: string): Record<string, string> {
  const result: Record<string, string> = {}
  if (!cookieString) return result

  const pairs = cookieString.split(';')
  for (const pair of pairs) {
    const [key, value] = pair.trim().split('=')
    if (key && value) {
      result[key] = decodeURIComponent(value)
    }
  }
  return result
}
