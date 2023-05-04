import { FC, useEffect, useState } from 'react'
import {
  usePostStore,
  useServerStore,
  useUsersStore
} from 'store'
import { stackScreenProps } from '../../general/RootStackParams'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import { UserPostElement } from '../post_component/UserPostElement'
import axios from 'axios'
import { Post } from '../types/Post.type'

type Props = stackScreenProps<'Other user page'> & {}

export const OtherUserPage: FC<Props> = ({
  route,
  navigation
}) => {
  const {
    otherUserPosts,
    setOtherPosts,
    setPostLike
  } = usePostStore()
  const { fullAddress } = useServerStore()
  const { getTokens } = useUsersStore()

  const [showLoader, setShowLoader] = useState(false)

  const limit: number = 10
  const [page, setPage] = useState(2)
  const [totalPosts, setTotalPosts] = useState(
    page * limit
  )

  const { user_nickname, user_id } = route.params!

  const changeHeaderTitle = () => {
    navigation.setOptions({
      headerTitle: user_nickname
    })
  }

  const getUserPosts = async (
    isFirstLoad: boolean
  ) => {
    if (
      (page - 1) * limit >= totalPosts &&
      !isFirstLoad
    )
      return

    setShowLoader(true)

    let req_url: string
    if (isFirstLoad)
      req_url = `${fullAddress()}/posts/${user_id}?limit=${limit}`
    else
      req_url = `${fullAddress()}/posts/${user_id}?page=${page}&limit=${limit}`

    const tokens = await getTokens()

    const { data } = await axios.get(req_url, {
      headers: {
        Authorization: `Bearer ${tokens!.access_token}`
      }
    })

    const {
      posts: _posts,
      total
    }: { posts: Post[]; total: number } = data
    setTotalPosts(total)

    if (isFirstLoad) {
      setShowLoader(false)
      return _posts
    }
    if (_posts[0] != null) {
      if ((page - 1) * limit < total) {
        setPage(page + 1)
        setOtherPosts([...otherUserPosts, ..._posts])
      }

      setShowLoader(false)
      return
    }

    setShowLoader(false)
    return
  }

  useEffect(() => {
    changeHeaderTitle()
    setPage(2)
    setOtherPosts([])
    getUserPosts(true)
      .then((posts) => {
        setOtherPosts(posts!)
        setTimeout(() => {
          setOtherPosts([])
          setTimeout(() => {
            setOtherPosts(posts!)
          }, 1)
        }, 1)
      })
      .catch((err) =>
        console.error(JSON.stringify(err, null, 2))
      )
  }, [])

  return (
    <>
      {showLoader ? (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginTop: 0
          }}
          size={50}
        />
      ) : (
        <></>
      )}
      <View style={styles.flatListView}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={otherUserPosts}
          renderItem={({ item }) => (
            <UserPostElement
              navigation={navigation}
              id={item.id}
              key={item.id}
              likes_count={item.likes_count}
              text_content={item.text_content}
              title={item.title}
              isLiked={item.isLiked}
              usersScore={item.UsersFeedback}
              canBeDeleted={false}
            />
          )}
          onEndReached={async () => {
            await getUserPosts(false)
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  flatListView: {
    marginHorizontal: 15
  }
})
