import SignInForm from '../../../components/auth/sign-in-form'
import { DEFAULT_AUTHENTICATED_REDIRECT } from '@/constants/routes'

export default async function SignInPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {}
  const callbackUrl =
    resolvedSearchParams.callbackUrl || DEFAULT_AUTHENTICATED_REDIRECT

  return <SignInForm callbackUrl={callbackUrl} />
}
