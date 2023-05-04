import {
  DateTimePickerAndroid,
  DateTimePickerEvent
} from '@react-native-community/datetimepicker'
import axios from 'axios'
import React, { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Input,
  Text
} from 'react-native-elements'
import {
  EPagesStack,
  useNavigationStore,
  useServerStore,
  useUsersStore
} from 'store'
import { stackScreenProps } from '../general/RootStackParams'
import ErrorModal from '../modal/ErrorModal'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 30,
    alignSelf: 'stretch',
    backgroundColor: '#191919'
  },
  calendar_group: {
    paddingVertical: 20,
    marginLeft: 10,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    width: 250
  },
  calendar_text: {
    paddingBottom: 10,
    fontSize: 25
  },
  register_container: {
    borderWidth: 3,
    borderColor: '#2D4263',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: '#2D4263'
  }
})

type Props = stackScreenProps<'Registration'>

const RegistrationPage: FC<Props> = ({
  navigation
}) => {
  const [failed, setFailed] = useState(false)
  const [modalInfo, setModalInfo] = useState('')
  const { fullAddress } = useServerStore()
  const { setTokens } = useUsersStore()
  const { setPageStack } = useNavigationStore()

  const [real_name, setRealname] = useState('')
  const [nick_name, setNickname] = useState('')
  const [password, setPassword] = useState('')

  const minimal_age_registration = new Date(
    new Date().setFullYear(
      new Date().getFullYear() - 18
    )
  )
  const [date, setDate] = useState(
    minimal_age_registration
  )

  const onChange = (
    event: DateTimePickerEvent,
    date: Date | undefined
  ) => {
    const temp = new Date(
      `${date!.getFullYear()}-${
        date!.getMonth() + 1
      }-${date!.getDate()}`
    )
    console.log(minimal_age_registration)

    if (temp < minimal_age_registration)
      return setDate(temp)
    setDate(minimal_age_registration)
    setModalInfo(
      'To register you should be older than 18 years.'
    )
    setFailed(true)
  }

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: 'date'
    })
  }

  const registration = async () => {
    try {
      if (
        password !== '' &&
        nick_name !== '' &&
        real_name !== '' &&
        date < minimal_age_registration
      ) {
        const { data: tokens } = await axios.post(
          `${fullAddress()}/auth/registration`,
          {
            real_name: real_name.trim(),
            nick_name: nick_name.trim(),
            password,
            birthday_date: date
          }
        )
        setTokens(tokens)
        setPageStack(EPagesStack.AUTHORIZED_MAIN)
        navigation.navigate('Main')
      }
    } catch (err: any) {
      setModalInfo('Failed to register')
      setFailed(true)

      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={styles.container}>
      <ErrorModal
        failed={failed}
        setFailed={setFailed}
        topTextContent={modalInfo}
      />
      <View style={styles.register_container}>
        <Input
          onChangeText={(value: string) =>
            setNickname(value)
          }
          placeholder="Nickname"
        />
        <Input
          onChangeText={(value: string) =>
            setRealname(value)
          }
          placeholder="Real name"
        />
        <View style={styles.calendar_group}>
          <Text
            style={styles.calendar_text}
            onPress={showDatepicker}
          >
            Select your age
          </Text>
        </View>
        <Input
          onChangeText={(value) => setPassword(value)}
          style={{ paddingTop: 20 }}
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>
      <Button
        title="Register"
        onPress={() => {
          registration()
          // navigation.push('Main')
        }}
        buttonStyle={{
          backgroundColor: '#147900',
          borderRadius: 20
        }}
        containerStyle={{
          width: 220,
          marginVertical: 28,
          alignSelf: 'center'
        }}
      />
    </View>
  )
}

export { RegistrationPage }
