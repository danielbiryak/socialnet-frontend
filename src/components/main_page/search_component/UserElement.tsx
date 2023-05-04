import { FC } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import { stackScreenProps } from '../../general/RootStackParams'
import { User } from '../types/User.type'

type Props = stackScreenProps<'Search users'> & {
  user: User
}

export const UserElemenet: FC<Props> = ({
  user,
  navigation
}) => {
  const created_date = new Date(user.createedAt)
  const month_date = created_date
    .toISOString()
    .split('T')[0]
    .split('-')

  const result_date = `${month_date[2]}.${
    month_date[1]
  }.${
    month_date[0]
  } ${created_date.getHours()}:${created_date.getMinutes()}`

  return (
    <TouchableOpacity
      style={styles.users_list}
      onPress={() => {
        navigation.navigate('Other user page', {
          user_nickname: user.nick_name,
          user_id: user.id
        })
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'monospace'
        }}
      >
        Nickname: {user.nick_name}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'monospace'
        }}
      >
        Name: {user.real_name}
      </Text>
      <Text></Text>
      <Text style={{ fontFamily: 'serif' }}>
        Registration date: {result_date}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  users_list: {
    borderWidth: 2,
    marginHorizontal: 10,
    marginVertical: 7,
    padding: 15
  }
})
