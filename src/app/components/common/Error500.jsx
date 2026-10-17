import { Button, Panel, Stack, Tag } from 'rsuite'

export default function Error500({ reset }) {
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
          <Tag color="red">ERROR 500</Tag>
          <h1 style={{ margin: 0 }}>Une erreur est survenue.</h1>
          <p className="muted-text" style={{ margin: 0 }}>
            Recharge la page ou reessaie l operation precedente.
          </p>
          <Button type="button" appearance="primary" onClick={reset}>
            Reessayer
          </Button>
        </Stack>
      </Panel>
    </main>
  )
}
