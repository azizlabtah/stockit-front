import { Button, Panel, Stack, Tag } from 'rsuite'

export default function NotFound() {
  return (
    <main className="page-shell">
      <Panel
        bordered
        shaded
        className="auth-card"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--surface-border)',
        }}
      >
        <Stack direction="column" spacing={16} alignItems="flex-start">
          <Tag color="red">404</Tag>
          <h1 style={{ margin: 0 }}>Page introuvable</h1>
          <p className="muted-text" style={{ margin: 0 }}>
            Cette route n existe pas encore dans la structure du projet.
          </p>
          <Button href="/" appearance="ghost">
            Retour a l accueil
          </Button>
        </Stack>
      </Panel>
    </main>
  )
}
