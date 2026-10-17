import { NextResponse } from 'next/server'

import { forwardRequestToBackend } from '@/services/backend/server-client'

export const runtime = 'nodejs'

const proxyRequest = async (request, { params }) => {
  const { path = [] } = await params
  const targetPath = path.join('/')

  if (!targetPath) {
    return NextResponse.json({ error: 'Missing backend path' }, { status: 400 })
  }

  try {
    return await forwardRequestToBackend(targetPath, request)
  } catch (error) {
    console.error('Backend proxy error:', error)

    return NextResponse.json(
      { error: 'Unable to reach backend service' },
      { status: 502 }
    )
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
export const HEAD = proxyRequest
export const OPTIONS = proxyRequest
