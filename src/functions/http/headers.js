import {
  BACKEND_REQUEST_HEADERS,
  BACKEND_RESPONSE_HEADERS_TO_SKIP,
} from '@/constants/api'

export function createForwardRequestHeaders(headers, options = {}) {
  const { accessToken } = options
  const forwardedHeaders = new Headers()

  for (const headerName of BACKEND_REQUEST_HEADERS) {
    const value = headers.get(headerName)

    if (value) {
      forwardedHeaders.set(headerName, value)
    }
  }

  if (accessToken && !forwardedHeaders.has('authorization')) {
    forwardedHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  return forwardedHeaders
}

export function createProxyResponseHeaders(headers) {
  const responseHeaders = new Headers(headers)

  for (const headerName of BACKEND_RESPONSE_HEADERS_TO_SKIP) {
    responseHeaders.delete(headerName)
  }

  return responseHeaders
}
