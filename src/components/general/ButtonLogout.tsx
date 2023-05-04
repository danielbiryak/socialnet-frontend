import { FC } from 'react'
import { Button } from 'react-native'
import { usePostStore, useUsersStore } from 'store'
import {
  EPagesStack,
  useNavigationStore
} from '../../store/navigationStore'

export const ButtonLogout: FC = () => {
  const { setPageStack } = useNavigationStore()
  const { setPosts } = usePostStore()
  const { clearTokens } = useUsersStore()

  return (
    <Button
      title="Log out"
      onPress={async () => {
        await clearTokens()
        setPageStack(EPagesStack.UNAUTHORIZED)
      }}
    />
  )
}
