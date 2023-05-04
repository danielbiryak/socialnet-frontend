import { create } from 'zustand'
import { Post } from './types/Post.type'

interface RefreshPostState {
  posts: Post[]
  setPosts: (posts: Post[]) => void
  setPostLike: (
    post_id: string,
    isLike: boolean
  ) => void
  otherUserPosts: Post[]
  setOtherPosts: (posts: Post[]) => void
  setOtherPostLike: (
    post_id: string,
    isLike: boolean
  ) => void
  refreshPostListTrigger: boolean
  emitRefreshTrigger: () => void
}

export const usePostStore = create<RefreshPostState>(
  (set, get) => ({
    posts: [],
    setPosts: (posts: Post[]) => {
      set({ posts })
    },
    setPostLike: (
      post_id: string,
      isLike: boolean
    ) => {
      const index = get().posts.findIndex(
        (val) => val.id === post_id
      )
      const tempArray = [...get().posts]
      if (!isLike) {
        tempArray[index].likes_count++
        tempArray[index].isLiked = true
      } else {
        tempArray[index].likes_count--
        tempArray[index].isLiked = false
      }
      get().setPosts(tempArray)
    },
    otherUserPosts: [],
    setOtherPosts: (posts: Post[]) => {
      set({ otherUserPosts: posts })
    },
    setOtherPostLike: (
      post_id: string,
      isLike: boolean
    ) => {
      const index = get().otherUserPosts.findIndex(
        (val) => val.id === post_id
      )
      const tempArray = [...get().otherUserPosts]
      if (!isLike) {
        tempArray[index].likes_count++
        tempArray[index].isLiked = true
      } else {
        tempArray[index].likes_count--
        tempArray[index].isLiked = false
      }
      get().setOtherPosts(tempArray)
    },
    refreshPostListTrigger: false,
    emitRefreshTrigger: () => {
      set({
        refreshPostListTrigger:
          !get().refreshPostListTrigger
      })
    }
  })
)
