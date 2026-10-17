 'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button, Input, Message, Panel, Stack, Tag } from 'rsuite'

import { AUTH_PROVIDER_IDS } from '@/constants/auth'
import Link from 'next/link'

export default function SignInForm({ callbackUrl = '/' }) {
  const router = useRouter()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [socialPending, setSocialPending] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsPending(true)

    try {
      const result = await signIn(AUTH_PROVIDER_IDS.credentials, {
        username: form.username,
        password: form.password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError('Connexion impossible. Vérifie tes identifiants.')
        return
      }

      router.push(result?.url || callbackUrl)
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Réessaie plus tard.')
    } finally {
      setIsPending(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setError('')
    setSocialPending(provider)

    try {
      await signIn(provider, { callbackUrl })
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
            <h1 className="auth-title">Connectez-vous à Stockit</h1>
            <p className="auth-description">
              Retrouvez vos produits et gérez votre compte.
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
              Continuer avec Google
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
              Continuer avec Facebook
            </Button>
          </div>

          <div className="auth-divider">
            <span>ou avec votre compte</span>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack direction="column" spacing={16} alignItems="stretch">
              <label className="field-stack">
                <span>Identifiant</span>
                <Input
                  value={form.username}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, username: value }))
                  }
                  placeholder="Votre identifiant"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="field-stack">
                <span>Mot de passe</span>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, password: value }))
                  }
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  required
                />
              </label>

              <div className="auth-forgot">
                <Link href="/reset-password">
                  Mot de passe oublié ?
                </Link>
              </div>

              {error && (
                <Message type="error" bordered showIcon>
                  {error}
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
                Se connecter
              </Button>
            </Stack>
          </form>

          <p className="auth-bottom">
            Vous n’avez pas de compte ?{' '}
            <Link href="/sign-up">Créer un compte</Link>
          </p>
        </Stack>
      </Panel>
    </main>
  )
}