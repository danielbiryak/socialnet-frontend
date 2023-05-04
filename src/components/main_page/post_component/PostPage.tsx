import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import {
  Badge,
  Button,
  Icon
} from 'react-native-elements'
import {
  usePostStore,
  useServerStore,
  useUsersStore
} from 'store'
import { stackScreenProps } from '../../general/RootStackParams'
import { PropetiesComponent } from './PropertiesComponent'

type Props = stackScreenProps<'Post'> & {}

const PostPage: FC<Props> = ({
  navigation,
  route
}) => {
  const {
    id: post_id,
    text_content,
    title,
    usersScore,
    canBeDeleted
  } = route.params!

  const {
    setPostLike,
    setOtherPostLike,
    emitRefreshTrigger
  } = usePostStore()
  const { getTokens } = useUsersStore()
  const { fullAddress } = useServerStore()

  const [liked, setLiked] = useState(
    route.params!.isLiked
  )
  const [likesCount, setLikesCount] = useState(
    route.params!.likes_count
  )
  const [visibleDeleteModal, setVisibleDeleteModal] =
    useState(false)

  const likeAction = async () => {
    const tokens = await getTokens()

    const { data } = await axios.post(
      `${fullAddress()}/posts/like-post`,
      {
        post_id
      },
      {
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`
        }
      }
    )
    console.log(data)
    if (canBeDeleted) setPostLike(post_id, liked)
    else setOtherPostLike(post_id, liked)
    if (!liked) setLikesCount(likesCount + 1)
    else setLikesCount(likesCount - 1)
    setLiked(!liked)
  }

  const deletePost = async () => {
    const tokens = await getTokens()

    const { data } = await axios.delete(
      `${fullAddress()}/posts/${post_id}`,
      {
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`
        }
      }
    )
    console.log(data)
    emitRefreshTrigger()
    navigation.goBack()
  }

  return (
    <View style={styles.main_container}>
      <Modal visible={visibleDeleteModal} transparent>
        <View style={styles.modal}>
          <Text
            style={{
              position: 'absolute',
              top: '40%',
              fontWeight: 'bold',
              fontSize: 21
            }}
          >
            Do you want to delete this post?
          </Text>
          <Button
            containerStyle={styles.modal_button}
            title="Yes"
            onPress={async () => await deletePost()}
          />
          <Button
            containerStyle={styles.modal_button}
            title="No"
            onPress={() =>
              setVisibleDeleteModal(false)
            }
          />
        </View>
      </Modal>

      <Text style={styles.text_title}>
        Title: {title}{' '}
      </Text>

      <View style={styles.scroll_view_container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.text_content}>
            {text_content}
          </Text>
        </ScrollView>
      </View>
      {usersScore![0] ? (
        <View style={styles.propeties_component}>
          <PropetiesComponent
            propertiesData={usersScore}
          />
        </View>
      ) : (
        <></>
      )}
      <View>
        <View style={styles.like_container}>
          <Badge
            value={likesCount}
            status="error"
            containerStyle={styles.badge_element}
          />
          {liked ? (
            <Icon
              raised
              size={30}
              name="favorite"
              type="material"
              onPress={async () => {
                await likeAction()
              }}
            />
          ) : (
            <Icon
              raised
              size={30}
              name="favorite-border"
              type="material"
              onPress={async () => {
                await likeAction()
              }}
            />
          )}
        </View>

        <View
          style={{
            alignSelf: 'flex-end',
            marginRight: 15
          }}
        >
          {canBeDeleted ? (
            <Icon
              size={40}
              name="delete"
              type="material"
              onPress={() =>
                setVisibleDeleteModal(true)
              }
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main_container: {
    marginHorizontal: 10
  },
  modal: {
    backgroundColor: '#00000099',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  modal_button: {
    // height: 50,
    marginHorizontal: 25,
    width: '30%'
  },
  text_title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 15
  },
  text_content: {
    fontSize: 20,
    letterSpacing: 0.2
  },
  like_container: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 20
  },
  badge_element: {
    position: 'absolute',
    top: 5,
    left: 50,
    zIndex: 2,
    elevation: 2
  },
  scroll_view_container: {
    borderWidth: 3,
    borderRadius: 30,
    height: '60%',
    paddingHorizontal: 20
  },
  propeties_component: {
    marginHorizontal: 15,
    marginTop: 15
  }
})

export { PostPage }
