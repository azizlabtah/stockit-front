export const NEXT_API_PREFIX = '/api'

export const API_ROUTES = {
  backendProxy: `${NEXT_API_PREFIX}/backend`,
  authLogin: `${NEXT_API_PREFIX}/auth/login`,
  authNext: `${NEXT_API_PREFIX}/auth`,
  commonLogs: `${NEXT_API_PREFIX}/common/logs`,
}

export const BACKEND_REQUEST_HEADERS = [
  'accept',
  'authorization',
  'content-type',
  'x-requested-with',
  'x-trace-id',
]

export const BACKEND_RESPONSE_HEADERS_TO_SKIP = [
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'transfer-encoding',
]
