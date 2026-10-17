export const trimLeadingSlash = (value = '') => String(value).replace(/^\/+/, '')

export const trimTrailingSlash = (value = '') => String(value).replace(/\/+$/, '')

export const joinPathSegments = (...segments) =>
  segments
    .filter((segment) => segment !== undefined && segment !== null && segment !== '')
    .map((segment, index) =>
      index === 0
        ? trimTrailingSlash(String(segment))
        : trimLeadingSlash(trimTrailingSlash(String(segment)))
    )
    .join('/')
