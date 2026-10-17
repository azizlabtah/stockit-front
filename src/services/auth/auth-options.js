import CredentialsProvider from 'next-auth/providers/credentials'

import { AUTH_PAGES } from '@/constants/auth'
import { loginWithBackendCredentials } from '@/services/auth/backend-auth'
import { BackendApiError } from '@/services/backend/server-client'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' },
      },

      async authorize(credentials) {
        const username = credentials?.username?.trim() || ''
        const password = credentials?.password

        if (!username || !password) {
          return null
        }

        try {
          return await loginWithBackendCredentials({
            username,
            password,
          })
        } catch (error) {
          if (error instanceof BackendApiError && error.status === 401) {
            return null
          }

          console.error('NextAuth login error:', error)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: AUTH_PAGES.signIn,
  },

  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.NEXTAUTH_SESSION_MAX_AGE || '3600', 10),
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.username = user.username
        token.email = user.email
        token.name = user.name
        token.companyId = user.companyId
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id || null,
        username: token.username || null,
        email: token.email || session.user?.email || null,
        name: token.name || session.user?.name || null,
        role: token.role || null,
        companyId: token.companyId || null,
      }

      session.accessToken = token.accessToken || null
      session.refreshToken = token.refreshToken || null

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
