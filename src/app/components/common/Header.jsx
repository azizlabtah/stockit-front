
import { getAppSession } from '@/services/auth/session'
import SearchHeader from './SearchHeader'

export default async function Header() {
  const session = await getAppSession()
  const user = session?.user || null
  const userLabel = user?.username || user?.name || 'Utilisateur'

  return (
    <SearchHeader />
  )
}
