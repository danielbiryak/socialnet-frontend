import { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Input,
  Text
} from 'react-native-elements'
import { useServerStore } from 'store'
import { stackScreenProps } from '../general/RootStackParams'

const styles = StyleSheet.create({
  main_container: {
    margin: 20
  }
})

type Props = stackScreenProps<'Set Up'> & {
}

const SetUpPage: FC<Props> = ({ navigation }) => {
  const {
    changeIp,
    changePort,
    server_ip,
    server_port
  } = useServerStore()

  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')

  const confrim_changes = async () => {
    if (ip !== '') changeIp(ip)
    if (port !== '') changePort(parseInt(port))
    else changePort(undefined)

    navigation.goBack()
  }

  return (
    <View style={styles.main_container}>
      <Text>Ip: </Text>
      <Input
        placeholder={server_ip}
        onChangeText={(value) => setIp(value)}
      />
      <Text>Port: </Text>
      <Input
        placeholder={server_port?.toString()}
        onChangeText={(value) => setPort(value)}
      />
      <Button
        title="Apply"
        onPress={() => confrim_changes()}
      />
    </View>
  )
}

export { SetUpPage }
