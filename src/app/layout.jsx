import { Geist, Geist_Mono } from 'next/font/google'
import 'rsuite/dist/rsuite-no-reset.min.css'
import './globals.css'

import AppProviders from './providers'
import Header from './components/common/Header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Stockit Front',
  description: 'Base frontend e-commerce connectee au backend',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppProviders>
          <div className="app-shell">
            <Header />
            <div className="app-content">{children}</div>
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
