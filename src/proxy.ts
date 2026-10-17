import { NextResponse } from 'next/server'

import { AUTH_PAGES } from '@/constants/auth'
import {
  DEFAULT_AUTHENTICATED_REDIRECT,
  isAuthRoute,
  isProtectedRoute,
} from '@/constants/routes'
import { getAuthTokenFromRequest } from '@/services/auth/token'

const getSafeCallbackUrl = (request) => {
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')

  if (callbackUrl && callbackUrl.startsWith('/')) {
    return callbackUrl
  }

  return DEFAULT_AUTHENTICATED_REDIRECT
}

const createSignInUrl = (request) => {
  const signInUrl = new URL(AUTH_PAGES.signIn, request.url)
  const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`

  signInUrl.searchParams.set('callbackUrl', callbackUrl)

  return signInUrl
}

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const token = await getAuthTokenFromRequest(request)
  const isAuthenticated = Boolean(token)

  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(getSafeCallbackUrl(request), request.url))
  }

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return NextResponse.redirect(createSignInUrl(request))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
