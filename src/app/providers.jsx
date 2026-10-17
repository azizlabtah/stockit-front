'use client'

import { SessionProvider } from 'next-auth/react'
import { CustomProvider } from 'rsuite'
import frFR from 'rsuite/locales/fr_FR'

export default function AppProviders({ children }) {
  return (
    <SessionProvider>
      <CustomProvider locale={frFR}>{children}</CustomProvider>
    </SessionProvider>
  )
}
