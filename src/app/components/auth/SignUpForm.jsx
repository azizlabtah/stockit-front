
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button, Input, Message, Panel, Stack, Tag } from 'rsuite'
import Link from 'next/link'

export default function SignUpForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [socialPending, setSocialPending] = useState('')

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsPending(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.message || 'Impossible de créer le compte.')
        return
      }

      setSuccess(
        data.message ||
          'Compte créé. Vous pouvez maintenant vous connecter.'
      )
    } catch {
      setError('Impossible de contacter le serveur. Réessayez plus tard.')
    } finally {
      setIsPending(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setError('')
    setSocialPending(provider)

    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch {
      setError('La connexion avec ce fournisseur a échoué.')
      setSocialPending('')
    }
  }

  return (
    <main className="auth-page">
      <Panel bordered className="auth-card">
        <Stack direction="column" spacing={20} alignItems="stretch">
          <div className="auth-heading">
            <Tag color="blue">Rejoignez Stockit</Tag>
            <h1 className="auth-title">Créer un compte</h1>
            <p className="auth-description">
              Inscrivez-vous pour profiter de toutes les fonctionnalités.
            </p>
          </div>

          <div className="auth-socials">
            <Button
              block
              appearance="ghost"
              className="auth-social-button"
              loading={socialPending === 'google'}
              disabled={Boolean(socialPending) || isPending}
              onClick={() => handleSocialLogin('google')}
            >
              <span className="social-letter social-letter--google">G</span>
              S’inscrire avec Google
            </Button>

            <Button
              block
              appearance="ghost"
              className="auth-social-button"
              loading={socialPending === 'facebook'}
              disabled={Boolean(socialPending) || isPending}
              onClick={() => handleSocialLogin('facebook')}
            >
              <span className="social-letter social-letter--facebook">f</span>
              S’inscrire avec Facebook
            </Button>
          </div>

          <div className="auth-divider">
            <span>ou avec votre e-mail</span>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={14} alignItems="stretch">
              <div className="auth-form-row">
                <label className="field-stack">
                  <span>Prénom</span>
                  <Input
                    value={form.firstName}
                    onChange={(value) => updateField('firstName', value)}
                    autoComplete="given-name"
                    required
                  />
                </label>

                <label className="field-stack">
                  <span>Nom</span>
                  <Input
                    value={form.lastName}
                    onChange={(value) => updateField('lastName', value)}
                    autoComplete="family-name"
                    required
                  />
                </label>
              </div>

              <label className="field-stack">
                <span>Identifiant</span>
                <Input
                  value={form.username}
                  onChange={(value) => updateField('username', value)}
                  autoComplete="username"
                  required
                />
              </label>

              <label className="field-stack">
                <span>Adresse e-mail</span>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(value) => updateField('email', value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="field-stack">
                <span>Mot de passe</span>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(value) => updateField('password', value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <label className="field-stack">
                <span>Confirmer le mot de passe</span>
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(value) =>
                    updateField('confirmPassword', value)
                  }
                  autoComplete="new-password"
                  minLength={8}
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
                disabled={Boolean(socialPending)}
                className="auth-submit"
              >
                Créer mon compte
              </Button>
            </Stack>
          </form>

          <p className="auth-bottom">
            Vous avez déjà un compte ? <Link href="/sign-in">Se connecter</Link>
          </p>
        </Stack>
      </Panel>
    </main>
  )
}
