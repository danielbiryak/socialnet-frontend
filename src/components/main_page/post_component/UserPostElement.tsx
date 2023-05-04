import { FC } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import { Icon } from 'react-native-elements'
import { navigationProp } from '../../general/RootStackParams'
import { UsersScore } from './AddPostPage'

type Props = {
  navigation:
    | navigationProp<'Main'>
    | navigationProp<'Other user page'>
  id: string
  text_content: string
  title: string
  likes_count: number
  isLiked: boolean
  canBeDeleted: boolean
  usersScore?: UsersScore[]
}

const UserPostElement: FC<Props> = ({
  id,
  title,
  text_content,
  likes_count,
  isLiked,
  canBeDeleted,
  usersScore,
  navigation
}) => {
  const shortened_text_pt1 = String(text_content)
    .split(/\\r|\\n|\s/)
    .filter((value) => value != '')
    .slice(0, 2)
    .join(' ')
  const shortened_text_pt2 =
    ' ' +
    String(text_content).split(' ').slice(2, 3) +
    '...'

  const open_post = () => {
    navigation.navigate('Post', {
      id,
      likes_count,
      text_content,
      title,
      isLiked,
      usersScore,
      canBeDeleted
    })
  }

  return (
    <TouchableOpacity
      style={[
        canBeDeleted
          ? styles.post_container_main
          : styles.post_container_other
      ]}
      onPress={open_post}
    >
      <Text style={styles.text_title}>{title}</Text>
      <Text>
        {shortened_text_pt1}
        <Text style={styles.text_shadowed}>
          {shortened_text_pt2}
        </Text>
      </Text>

      <Text>
        <Icon
          size={20}
          name="favorite"
          type="material"
          containerStyle={styles.like_container}
        />
        <Text style={{ fontSize: 25, margin: 25 }}>
          {' '}
          {likes_count}
        </Text>
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  post_container_main: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    padding: 10,
    marginVertical: 10
  },
  post_container_other: {
    borderBottomColor: 'black',
    borderWidth: 3,
     borderRadius: 10,
    padding: 10,
    marginVertical: 4
  },
  text_title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 5
  },
  text_shadowed: {
    color: '#999999'
  },
  like_container: {
    alignSelf: 'flex-start'
  },
  likes_count_container: {
    margin: 200
  }
})

export { UserPostElement }
