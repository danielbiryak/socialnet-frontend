import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { Input } from 'react-native-elements'
import { useServerStore, useUsersStore } from 'store'
import { stackScreenProps } from '../../general/RootStackParams'
import { User } from '../types/User.type'
import { UserElemenet } from './UserElement'

type Props = stackScreenProps<'Search users'> & {}

const SearchUsersPage: FC<Props> = ({
  navigation,
  route
}) => {
  const { fullAddress } = useServerStore()
  const { getTokens } = useUsersStore()

  const [nickname, setNickname] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (nickname != '') {
      const timer_id = setTimeout(async () => {
        console.log(nickname)

        const tokens = await getTokens()
        try {
          const { data } = await axios.get(
            `${fullAddress()}/users/${nickname}`,
            {
              headers: {
                Authorization: `Bearer ${tokens?.access_token}`
              }
            }
          )

          console.log(
            JSON.stringify(data['users'], null, 2)
          )

          setUsers(data['users'])
        } catch (error) {
          setUsers([])
        }
      }, 100)
      return () => clearTimeout(timer_id)
    }
  }, [nickname])

  return (
    <View style={{ padding: 20 }}>
      <Input
        // containerStyle={styles.search_container}
        onChangeText={(value) => {
          setNickname(value)
        }}
        placeholder="Nickname"
      />
      {nickname === '' ? (
        <Text style={{ marginHorizontal: 10 }}>
          Search for users!
        </Text>
      ) : users[0] != null ? (
        <FlatList
          // style={{ height: "94%" }}
          data={users}
          renderItem={({ item }) => (
            <UserElemenet
              user={item}
              navigation={navigation}
              route={route}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text
          style={{
            marginHorizontal: 10,
            fontSize: 20
          }}
        >
          No users
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  users_list: {
    borderBottomColor: 'black',
    borderBottomWidth: 4,
    marginHorizontal: 10,
    marginVertical: 5
  }
})

export { SearchUsersPage }
