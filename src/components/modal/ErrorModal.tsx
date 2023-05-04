import { FC } from 'react'
import {
  Modal,
  View,
  StyleSheet,
  Text
} from 'react-native'

type Props = {
  failed: boolean
  setFailed: React.Dispatch<boolean>
  topTextContent: string
}

const ErrorModal: FC<Props> = ({
  failed,
  setFailed,
  topTextContent
}) => {
  return (
    <Modal visible={failed} transparent>
      <View
        style={styles.modal_failed}
        onTouchEnd={() => setFailed(false)}
      >
        <Text style={styles.modal_failed_top_text}>
          {topTextContent}
        </Text>
        <Text style={styles.modal_failed_bot_text}>
          Tap on screen
        </Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal_failed: {
    backgroundColor: '#00000099',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal_failed_top_text: {
    fontSize: 30,
    alignSelf: 'center',
    textAlign:'center'
  },
  modal_failed_bot_text: {
    fontSize: 25,
    paddingTop: 100
  }
})

export default ErrorModal
