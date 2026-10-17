import 'server-only'

import { AUTH_BACKEND_ENDPOINTS } from '@/constants/auth'
import { postBackend } from '@/services/backend/server-client'

const getAccessToken = (data) =>
  data?.token || data?.access_token || data?.jwt || null

export function normalizeBackendUser(data, username) {
  const user =
    data?.user ||
    data?.data?.user ||
    data?.customer ||
    data?.admin ||
    {}

  return {
    id: user.id || data?.id || username,
    username:
      user.username ||
      user.user_identifier ||
      data?.username ||
      data?.user_identifier ||
      username,
    email: user.email || data?.email || null,
    name: user.name || user.fullName || data?.name || null,
    role: user.role || user.profile || data?.role || null,
    companyId: user.company_id || data?.company_id || null,
    accessToken: getAccessToken(data),
    refreshToken: data?.refresh_token || null,
    raw: data,
  }
}

export async function loginWithBackendCredentials({ username, password }) {
  const { data } = await postBackend(AUTH_BACKEND_ENDPOINTS.login, {
    username,
    _username: username,
    password,
    _password: password,
  })

  return normalizeBackendUser(data, username)
}
