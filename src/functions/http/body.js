const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD'])

export async function getRequestBody(request) {
  if (METHODS_WITHOUT_BODY.has(request.method.toUpperCase())) {
    return undefined
  }

  const buffer = await request.arrayBuffer()
  return buffer.byteLength ? buffer : undefined
}

export async function parseJsonSafely(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}
