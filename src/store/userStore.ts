import { create } from 'zustand'
import { Tokens } from '../components/start_page/types/tokens.type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useServerStore } from './serverStore'
import axios from 'axios'

interface UsersState {
  addUser: (user_id: string) => Promise<void>
  getUser: () => Promise<string | null>
  setTokens: (tokens: Tokens) => Promise<void>
  getTokens: () => Promise<Tokens | undefined>
  clearTokens: () => Promise<void>
  refreshTokens: () => Promise<Tokens>
}

const useUsersStore = create<UsersState>(
  (_, get) => ({
    addUser: async (nick_name: string) => {
      await AsyncStorage.setItem(
        'nick_name',
        nick_name
      )
    },
    getUser: async () => {
      return await AsyncStorage.getItem('nick_name')
    },
    setTokens: async (tokens: Tokens) => {
      await Promise.all([
        AsyncStorage.setItem(
          'access_token',
          tokens.access_token
        ),
        AsyncStorage.setItem(
          'refresh_token',
          tokens.refresh_token
        )
      ])
    },
    getTokens: async () => {
      const [at, rt] = await Promise.all([
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('refresh_token')
      ])
      if (at == null && rt == null) return
      try {
        const { fullAddress } =
          useServerStore.getState()

        await axios.post(
          `${fullAddress()}/auth/check-jwt`,
          {},
          {
            headers: { Authorization: `Bearer ${at}` }
          }
        )
      } catch (error) {
        const tokens = await get().refreshTokens()

        return tokens
      }

      return {
        access_token: at!,
        refresh_token: rt!
      }
    },
    clearTokens: async () => {
      await Promise.all([
        AsyncStorage.removeItem('access_token'),
        AsyncStorage.removeItem('refresh_token'),
        AsyncStorage.removeItem('nick_name')
      ])
    },
    refreshTokens: async () => {
      const { fullAddress } = useServerStore.getState()
      const refresh_token = await AsyncStorage.getItem(
        'refresh_token'
      )

      const { data } = await axios.post(
        `${fullAddress()}/auth/refresh-token`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${refresh_token}`
          }
        }
      )
      const tokens: Tokens = data!
      await get().setTokens(tokens)

      return tokens
    }
  })
)

export { useUsersStore }
