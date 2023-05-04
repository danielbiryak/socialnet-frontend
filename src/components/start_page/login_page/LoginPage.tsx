import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import {
  EPagesStack,
  useNavigationStore,
  useServerStore,
  useUsersStore
} from 'store'
import { stackScreenProps } from '../../general/RootStackParams'
import ErrorModal from '../../modal/ErrorModal'
import { Tokens } from '../types/tokens.type'

type Props = stackScreenProps<'Login'> & {}

const LoginPage: FC<Props> = ({ navigation }) => {
  const [failed, setFailed] = useState(false)
  const [modalInfo, setModalInfo] = useState('')

  const { setTokens, getTokens, addUser } =
    useUsersStore()
  const { setPageStack } = useNavigationStore()
  const { fullAddress } = useServerStore()

  const [nick_name, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const authorize = async () => {
    try {
      const { data: tokens }: { data: Tokens } =
        await axios.post(
          `${fullAddress()}/auth/login`,
          {
            nick_name,
            password
          }
        )
      setTokens(tokens)
      addUser(nick_name)
      setPageStack(EPagesStack.AUTHORIZED_MAIN)
      navigation.navigate('Main')
    } catch (err) {
      setModalInfo('Failed to login')
      setFailed(true)

      console.error(JSON.stringify(err, null, 2))
    }
  }

  useEffect(() => {
    getTokens().then((tokens: Tokens | undefined) => {
      if (
        tokens?.access_token &&
        tokens?.refresh_token
      ) {
        setPageStack(EPagesStack.AUTHORIZED_MAIN)
        navigation.navigate('Main')
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      <ErrorModal
        failed={failed}
        setFailed={setFailed}
        topTextContent={modalInfo}
      />
      <View style={styles.login_container}>
        <Input
          autoCorrect={false}
          onChangeText={(value) => setNickname(value)}
          placeholder="Nickname"
        />
        <Input
          onChangeText={(value) => setPassword(value)}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Button
          title="Login"
          onPress={() => {
            authorize()
          }}
          containerStyle={{
            alignSelf: 'stretch',
            marginVertical: 28,
            paddingHorizontal: 10,
            marginTop: 0
          }}
          buttonStyle={{
            backgroundColor: '#415cff'
          }}
        />
        <Button
          title="Set up the server"
          onPress={() => {
            navigation.push('Set Up')
          }}
          buttonStyle={{
            backgroundColor: '#00000033'
          }}
        />
      </View>
      <Button
        title="Registration"
        onPress={() => {
          navigation.push('Registration')
        }}
        buttonStyle={styles.button_self}
        containerStyle={styles.button_container}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 170,
    paddingHorizontal: 30,
    alignSelf: 'stretch',
    backgroundColor: '#191919'
  },
  login_container: {
    borderWidth: 3,
    borderColor: '#2D4263',
    paddingHorizontal: 23,
    paddingVertical: 50,
    borderRadius: 20,
    backgroundColor: '#2D4263'
  },
  modal_failed: {
    backgroundColor: '#00000099',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal_failed_top_text: {
    fontSize: 55,
    alignSelf: 'center'
  },
  modal_failed_bot_text: {
    fontSize: 25,
    paddingTop: 100
  },
  button_self: {
    backgroundColor: 'green',
    borderRadius: 20
  },
  button_container: {
    marginTop: 50
  }
})

export { LoginPage }
