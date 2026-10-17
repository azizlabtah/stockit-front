import 'server-only'

import { createForwardRequestHeaders, createProxyResponseHeaders } from '@/functions/http/headers'
import { getRequestBody } from '@/functions/http/body'
import { joinPathSegments, trimLeadingSlash, trimTrailingSlash } from '@/functions/common/path'
import {
  getAuthTokenFromRequest,
  getBackendAccessToken,
} from '@/services/auth/token'

const canUseFormData = () => typeof FormData !== 'undefined'

const canUseBlob = () => typeof Blob !== 'undefined'

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value))

const isRequestBodyPassthrough = (body) =>
  typeof body === 'string' ||
  body instanceof URLSearchParams ||
  body instanceof ArrayBuffer ||
  ArrayBuffer.isView(body) ||
  (canUseFormData() && body instanceof FormData) ||
  (canUseBlob() && body instanceof Blob)

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  try {
    return await response.text()
  } catch {
    return null
  }
}

const getConfiguredBackendBaseUrl = () => {
  const configuredUrl = process.env.API_BASE_URL

  if (!configuredUrl) {
    throw new Error('Missing backend API url. Define API_BASE_URL in the environment.')
  }

  return trimTrailingSlash(configuredUrl)
}

export class BackendApiError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.name = 'BackendApiError'
    this.status = details.status || 500
    this.url = details.url || ''
    this.data = details.data ?? null
  }
}

export const buildBackendUrl = (endpoint = '', search = '') => {
  if (isAbsoluteUrl(endpoint)) {
    return `${endpoint}${search || ''}`
  }

  const baseUrl = getConfiguredBackendBaseUrl()
  const pathname = trimLeadingSlash(String(endpoint))

  return `${joinPathSegments(baseUrl, pathname)}${search || ''}`
}

export async function fetchBackend(endpoint, options = {}) {
  const {
    accessToken,
    body,
    headers,
    cache = 'no-store',
    search = '',
    ...rest
  } = options
  const url = buildBackendUrl(endpoint, search)
  const requestHeaders = new Headers(headers || {})

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json')
  }

  if (accessToken && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  const requestInit = {
    ...rest,
    cache,
    headers: requestHeaders,
  }

  if (body !== undefined) {
    if (isRequestBodyPassthrough(body)) {
      requestInit.body = body
    } else {
      if (!requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json')
      }
      requestInit.body = JSON.stringify(body)
    }
  }

  const response = await fetch(url, requestInit)
  const clonedResponse = response.clone()
  const data = await parseResponseBody(clonedResponse)

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Backend request failed with status ${response.status}`

    throw new BackendApiError(message, {
      status: response.status,
      url,
      data,
    })
  }

  return {
    url,
    data,
    response,
  }
}

export const postBackend = (endpoint, body, options = {}) =>
  fetchBackend(endpoint, {
    ...options,
    method: 'POST',
    body,
  })

export async function forwardRequestToBackend(endpoint, request) {
  const search = request.nextUrl.search || ''
  const body = await getRequestBody(request)
  const token = await getAuthTokenFromRequest(request)
  const accessToken = getBackendAccessToken(token)
  const headers = createForwardRequestHeaders(request.headers, { accessToken })
  const url = buildBackendUrl(endpoint, search)

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  })

  return new Response(response.body, {
    status: response.status,
    headers: createProxyResponseHeaders(response.headers),
  })
}
