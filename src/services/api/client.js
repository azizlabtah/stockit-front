import { API_ROUTES } from '@/constants/api'
import { joinPathSegments } from '@/functions/common/path'

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value))

const buildRelativeApiUrl = (path = '') => {
  if (isAbsoluteUrl(path)) {
    return path
  }

  return joinPathSegments('', path)
}

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

export class ApiClientError extends Error {
  constructor(message, details = {}) {
    super(message)
    this.name = 'ApiClientError'
    this.status = details.status || 500
    this.url = details.url || ''
    this.data = details.data ?? null
  }
}

export async function apiClientFetch(path, options = {}) {
  const { body, headers, ...rest } = options
  const url = buildRelativeApiUrl(path)
  const requestHeaders = new Headers(headers || {})

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json')
  }

  const requestInit = {
    ...rest,
    credentials: rest.credentials || 'same-origin',
    headers: requestHeaders,
  }

  if (body !== undefined) {
    if (!requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json')
    }

    requestInit.body = JSON.stringify(body)
  }

  const response = await fetch(url, requestInit)
  const data = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiClientError(data?.message || data?.error || 'API request failed', {
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

export const backendProxyFetch = (path, options = {}) =>
  apiClientFetch(joinPathSegments(API_ROUTES.backendProxy, path), options)
