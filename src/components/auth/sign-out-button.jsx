'use client'

import { signOut } from 'next-auth/react'
import { Button } from 'rsuite'
import ExitIcon from '@rsuite/icons/Exit'

import { APP_ROUTES } from '@/constants/routes'

export default function SignOutButton() {
  return (
    <Button
      appearance="subtle"
      color="red"
      startIcon={<ExitIcon />}
      onClick={() =>
        signOut({
          callbackUrl: APP_ROUTES.home,
        })
      }
    >
      Deconnexion
    </Button>
  )
}
