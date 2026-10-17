import { redirect } from 'next/navigation'
import { Button, Panel, Stack, Tag } from 'rsuite'

import { AUTH_PAGES } from '@/constants/auth'
import {
  APP_ROUTES,
  DEFAULT_AUTHENTICATED_REDIRECT,
} from '@/constants/routes'
import { getAppSession } from '@/services/auth/session'

const createSignInRedirectUrl = (callbackUrl) =>
  `${AUTH_PAGES.signIn}?callbackUrl=${encodeURIComponent(callbackUrl)}`

export default async function DashboardPage() {
  const session = await getAppSession()

  if (!session?.user?.id) {
    redirect(createSignInRedirectUrl(APP_ROUTES.dashboard))
  }

  return (
    <main className="page-shell">
      <Panel
        bordered
        shaded
        className="page-card"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--surface-border)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <Stack direction="column" spacing={18} alignItems="flex-start">
          <Tag color="green">Protected Page</Tag>
          <h1 style={{ margin: 0 }}>Dashboard securise</h1>
          <p className="muted-text" style={{ margin: 0 }}>
            Cette page est protegee par le proxy Next.js et verifie aussi la
            session cote serveur.
          </p>
          <Stack direction="column" spacing={8} alignItems="flex-start">
            <p style={{ margin: 0 }}>
              <strong>Utilisateur:</strong> {session.user?.username || 'N/A'}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Role:</strong> {session.user?.role || 'N/A'}
            </p>
          </Stack>
          <Button href={DEFAULT_AUTHENTICATED_REDIRECT} appearance="ghost">
            Actualiser le dashboard
          </Button>
        </Stack>
      </Panel>
    </main>
  )
}
