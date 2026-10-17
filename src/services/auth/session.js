import 'server-only'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/services/auth/auth-options'

export const getAppSession = () => getServerSession(authOptions)
