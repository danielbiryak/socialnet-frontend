import axios from 'axios'
import { FC, useState } from 'react'
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { usePostStore } from '../../../store/postStore'
import { useServerStore } from '../../../store/serverStore'
import { useUsersStore } from '../../../store/userStore'
import { stackScreenProps } from '../../general/RootStackParams'
import ErrorModal from '../../modal/ErrorModal'
import { PropetiesComponent } from './PropertiesComponent'

type Props = stackScreenProps<'Add post'> & {}

export type UsersScore = {
  property: string
  score: number
}

const AddPostPage: FC<Props> = ({ navigation }) => {
  const { fullAddress } = useServerStore()
  const { getTokens } = useUsersStore()
  const { emitRefreshTrigger } = usePostStore()

  const [failed, setFailed] = useState(false)

  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [bottomShowcase, setBottomShowcase] =
    useState<UsersScore[]>()

  const add_post = async () => {
    if (postTitle == '' || postContent == '')
      return setFailed(true)

    const tokens = await getTokens()
    console.log({
      title: postTitle,
      text_content: postContent
    })

    const { data: result } = await axios.post(
      `${fullAddress()}/posts`,
      {
        title: postTitle,
        text_content: postContent.replace(/.\+./g, ''),
        properties: bottomShowcase ?? undefined
      },
      {
        headers: {
          Authorization: `Bearer ${
            tokens!.access_token
          }`
        }
      }
    )
    emitRefreshTrigger()
    console.log(result)

    navigation.goBack()
  }

  const textParse = (text_content: string) => {
    const count_of_matches =
      text_content.match(/.\+./g)?.length
    if (
      !count_of_matches ||
      count_of_matches % 2 === 1
    )
      return
    const statements_array = []
    let postContent_copy = text_content
    for (let i = 0; i < count_of_matches / 2; i++) {
      let first_index = postContent_copy.indexOf('.+.')
      postContent_copy = postContent_copy.replace(
        '.+.',
        ''
      )
      let second_index =
        postContent_copy.indexOf('.+.')
      postContent_copy = postContent_copy.replace(
        '.+.',
        ''
      )
      const postContent_split = postContent_copy
        .slice(first_index, second_index)
        .split(' ')

      const property = postContent_split
        .splice(0, postContent_split.length - 1)
        .join(' ')
        .trim()
      const score_string = postContent_split.pop()!
      const score =
        parseInt(score_string.split('/')[0]) /
        parseInt(score_string.split('/')[1])
      statements_array.push({
        property,
        score
      })
    }
    setBottomShowcase(statements_array)
  }

  return (
    <View>
      <ErrorModal
        failed={failed}
        setFailed={setFailed}
        topTextContent="Failed to create post"
      />
      <View style={styles.main_view}>
        <Input
          inputStyle={{ fontFamily: 'serif' }}
          containerStyle={{
            // marginLeft: 10,
            marginTop: 20,
            alignSelf: 'center'
            // width: '93%'
          }}
          placeholder="Title"
          onChangeText={(value) => setPostTitle(value)}
        />
        <Input
          containerStyle={{
            borderWidth: 2,
            paddingTop: 10,
            marginBottom: 15,
            alignSelf: 'center',
            maxHeight: '60%'
          }}
          inputStyle={{
            textAlignVertical: 'top',
            textDecorationLine: 'none',
            letterSpacing: 1
          }}
          placeholder="Write down the post..."
          numberOfLines={12}
          multiline={true}
          onChangeText={(value) => {
            textParse(value)
            setPostContent(value)
          }}
        />
        <PropetiesComponent
          propertiesData={bottomShowcase}
        />

        <Button
          containerStyle={{
            width: '90%',
            alignSelf: 'center'
          }}
          title="Add post"
          onPress={() => add_post()}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main_view: {
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  add_post_textinput: {
    borderWidth: 5,
    borderRadius: 20,
    textAlignVertical: 'top',
    height: 500,
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginHorizontal: 10,
    marginBottom: 20
  }
})

export { AddPostPage }
