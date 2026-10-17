import 'server-only'

import { getToken } from 'next-auth/jwt'

export const getBackendAccessToken = (token) => token?.accessToken || null

export async function getAuthTokenFromRequest(request) {
  return getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
}
