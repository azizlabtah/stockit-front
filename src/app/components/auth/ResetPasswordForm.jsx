'use client'

import { useState } from 'react'
import { Button, Input, Link, Message, Panel, Stack, Tag } from 'rsuite'

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsPending(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(
          data.message || 'La demande n’a pas pu être traitée. Réessayez.'
        )
        return
      }

      setSuccess(
        data.message ||
          'Si cette adresse correspond à un compte, vous recevrez un e-mail avec les instructions.'
      )
    } catch {
      setError('Impossible de contacter le serveur. Réessayez plus tard.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="auth-page">
      <Panel bordered className="auth-card auth-card--compact">
        <Stack direction="column" spacing={20} alignItems="stretch">
          <div className="auth-heading">
            <Tag color="blue">Récupération du compte</Tag>
            <h1 className="auth-title">Mot de passe oublié ?</h1>
            <p className="auth-description">
              Saisissez l’adresse e-mail associée à votre compte. Nous vous
              indiquerons comment réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={16} alignItems="stretch">
              <label className="field-stack">
                <span>Adresse e-mail</span>
                <Input
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  required
                />
              </label>

              {error && (
                <Message type="error" bordered showIcon>
                  {error}
                </Message>
              )}

              {success && (
                <Message type="success" bordered showIcon>
                  {success}
                </Message>
              )}

              <Button
                appearance="primary"
                type="submit"
                block
                loading={isPending}
                className="auth-submit"
              >
                Envoyer les instructions
              </Button>
            </Stack>
          </form>

          <p className="auth-bottom">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/connexion">Retour à la connexion</Link>
          </p>
        </Stack>
      </Panel>
    </main>
  )
}