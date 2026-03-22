import { useAuthContext } from '@/hooks/auth-context'
import { Button } from 'react-native'

export default function SignOutButton() {
  const { logout } = useAuthContext()

  async function onSignOutButtonPress() {
    try {
      await logout()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return <Button title="Sign out" onPress={onSignOutButtonPress} />
}