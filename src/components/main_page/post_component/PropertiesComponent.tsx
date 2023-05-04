import { FC } from 'react'
import {
  FlatList,
  View,
  Text,
  StyleSheet
} from 'react-native'
import { UsersScore } from './AddPostPage'
type Props = {
  propertiesData: UsersScore[] | undefined
}

export const PropetiesComponent: FC<Props> = ({
  propertiesData
}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        maxHeight: 100,
        minHeight: 50
      }}
    >
      <FlatList
        data={propertiesData}
        renderItem={({ item }) => {
          let score = 1
          if (item.score < 1) score = item.score
          let color = '#000000'

          if (score < 0.5)
            color = `#ff${Math.round(
              score * 2 * 255
            ).toString(16)}00`

          if (score > 0.5)
            color = `#${Math.round(
              (1 - score) * 2 * 255
            ).toString(16)}ff00`

          if (score >= 1) color = '#00ff00'
          if (score == 0.5) color = '#ffff00'
          if (score == 0) color = '#ff0000'

          return (
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 10
              }}
            >
              <Text style={styles.item_property}>{item.property}</Text>
              <View style={styles.score_container}>
                <View
                  style={[
                    styles.user_score_container,
                    {
                      backgroundColor: color,
                      width: `${score * 100}%`
                    }
                  ]}
                />
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  score_container: {
    position: 'absolute',
    right: 0,
    height: 15,
    flexDirection: 'row',
    width: '50%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 50
  },
  user_score_container: {
    borderRadius: 50
  },
  item_property:{
    width: '50%'
  }
})
