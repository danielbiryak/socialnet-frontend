import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import { Button } from 'react-native-elements'
import {
  usePostStore,
  useServerStore,
  useUsersStore
} from 'store'
import { stackScreenProps } from '../../general/RootStackParams'
import { UserPostElement } from '../post_component/UserPostElement'
import { Post } from '../types/Post.type'

type Props = stackScreenProps<'Main'> & {}

const MainPage: FC<Props> = ({ navigation }) => {
  const { fullAddress } = useServerStore()
  const { getTokens, getUser } = useUsersStore()
  const {
    refreshPostListTrigger,
    emitRefreshTrigger,
    posts,
    setPosts
  } = usePostStore()

  const [showLoader, setShowLoader] = useState(false)

  const limit: number = 10
  const [page, setPage] = useState(2)
  const [totalPosts, setTotalPosts] = useState(
    page * limit
  )

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
      req_url = `${fullAddress()}/posts?limit=${limit}`
    else
      req_url = `${fullAddress()}/posts?page=${page}&limit=${limit}`

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
        setPosts([...posts, ..._posts])
      }

      setShowLoader(false)
      return
    }

    setShowLoader(false)
    return
  }

  const setHeaderTitle = async () => {
    const nick_name = await getUser()
    navigation.setOptions({
      headerTitle: nick_name!
    })
  }

  useEffect(() => {
    setHeaderTitle()
    setPage(2)
    setPosts([])
    getUserPosts(true)
      .then((posts) => {
        setPosts(posts!)
        setTimeout(() => {
          setPosts([])
          setTimeout(() => {
            setPosts(posts!)
          }, 1)
        }, 1)
      })
      .catch((err) =>
        console.error(JSON.stringify(err, null, 2))
      )
  }, [refreshPostListTrigger])

  return (
    <View style={styles.container}>
      {showLoader ? (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginTop: 45
          }}
          size={50}
        />
      ) : (
        <></>
      )}
      <Button
        title={'flex'}
        buttonStyle={{
          height: 35,
          marginHorizontal: 20,
          marginVertical: 5
        }}
        onPress={() => {
          navigation.push('Stream page')
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ height: '90%' }}
        data={posts}
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
            canBeDeleted={true}
          />
        )}
        onEndReached={async () => {
          await getUserPosts(false)
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'flex-end'
        }}
      >
        <Button
          title="Search users"
          onPress={() => {
            navigation.navigate('Search users')
          }}
          titleStyle={{
            fontSize: 15
          }}
          buttonStyle={{ height: 40 }}
          containerStyle={{ width: '33%' }}
        />
        <Button
          title="Main page"
          buttonStyle={{ height: 40 }}
          // disabled={true}
          onPress={() => emitRefreshTrigger()}
          containerStyle={{ width: '33%' }}
        />
        <Button
          title="Add post"
          buttonStyle={{ height: 40 }}
          onPress={() => {
            navigation.push('Add post')
          }}
          containerStyle={{ width: '33%' }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#333',
    // alignItems: "stretch",
    // justifyContent: "flex-start",
    padding: 20,
    paddingTop: 0
  },
  text: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold'
  }
})

export { MainPage }
