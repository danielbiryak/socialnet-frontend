import { FC } from 'react'
import { stackScreenProps } from '../../general/RootStackParams'
import { View, Text } from 'react-native'

type Props = stackScreenProps<'Stream page'> & {}
export const StreamPage: FC<Props> = ({
  navigation
}) => {
  navigation.setOptions({ headerTitle: 'Stream room' })

  // const temp =
  return (
    <View>
      <Text>flex</Text>
    </View>
  )
}
