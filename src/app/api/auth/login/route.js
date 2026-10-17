import { NextResponse } from 'next/server'

import { parseJsonSafely } from '@/functions/http/body'
import { BackendApiError } from '@/services/backend/server-client'
import { loginWithBackendCredentials } from '@/services/auth/backend-auth'

export const runtime = 'nodejs'

export async function POST(request) {
  const payload = await parseJsonSafely(request)
  const username = payload?.username?.trim() || ''
  const password = payload?.password || ''

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    )
  }

  try {
    const authPayload = await loginWithBackendCredentials({ username, password })

    return NextResponse.json(authPayload)
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        {
          error: error.data?.message || error.data?.error || 'Authentication failed',
        },
        { status: error.status }
      )
    }

    console.error('Auth login route error:', error)

    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
