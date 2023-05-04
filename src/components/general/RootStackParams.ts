import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { UsersScore } from '../main_page/post_component/AddPostPage'

export type RootStackParamList = {
  Login: undefined
  Registration: undefined
  'Set Up': undefined
  Main: undefined
  Post: {
    id: string
    text_content: string
    title: string
    likes_count: number
    isLiked: boolean
    canBeDeleted: boolean
    usersScore?: UsersScore[]
  }
  'Add post': undefined
  'Search users': undefined
  'Other user page': {
    user_nickname: string
    user_id: string
  }
  'Stream page': undefined
}

export type navigationProp<
  T extends keyof RootStackParamList
> = NativeStackNavigationProp<RootStackParamList, T>
type routeProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>

export type stackScreenProps<
  T extends keyof RootStackParamList
> = {
  navigation: navigationProp<T>
  route: routeProp<T>
}
