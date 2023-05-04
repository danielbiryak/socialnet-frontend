import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { Dispatch, FC, useState } from 'react'

import { LoginPage } from '../start_page/login_page/LoginPage'
import { RegistrationPage } from '../start_page/RegistrationPage'
import { SetUpPage } from '../start_page/SetUpPage'
import {
  RootStackParamList,
  stackScreenProps
} from './RootStackParams'
import {
  useNavigationStore,
  EPagesStack
} from '../../store/navigationStore'
import { ButtonLogout } from './ButtonLogout'
import { MainPage } from '../main_page/profile_component/MainPage'
import { AddPostPage } from '../main_page/post_component/AddPostPage'
import { PostPage } from '../main_page/post_component/PostPage'
import { SearchUsersPage } from '../main_page/search_component/SearchUsersPage'
import { OtherUserPage } from '../main_page/search_component/OtherUserPage'
import { StreamPage } from '../main_page/stream_component/StreamPage'

type Props = {}

const GeneralComponent: FC<Props> = ({}) => {
  // const [userId, setUserId] = useState<
  //   number | undefined
  // >(0)
  const { currentPageStack } = useNavigationStore()

  const [isMainPage, setIsMainPage] =
    useState<boolean>(true)
  const Stack =
    createNativeStackNavigator<RootStackParamList>()

  return (
    <NavigationContainer>
      {currentPageStack ===
      EPagesStack.UNAUTHORIZED ? (
        <Stack.Navigator
          screenOptions={{ headerTintColor: 'black' }}
        >
          {/* Login page */}
          <Stack.Screen
            name="Login"
            options={{
              headerTitle: 'SocialNet Project'
            }}
          >
            {(props: stackScreenProps<'Login'>) => (
              <LoginPage {...props} />
            )}
          </Stack.Screen>
          {/* Set up page */}
          <Stack.Screen name="Set Up">
            {(props: stackScreenProps<'Set Up'>) => (
              <SetUpPage {...props} />
            )}
          </Stack.Screen>
          {/* Registration page */}
          <Stack.Screen name="Registration">
            {(
              props: stackScreenProps<'Registration'>
            ) => <RegistrationPage {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : currentPageStack ===
        EPagesStack.AUTHORIZED_MAIN ? (
        <Stack.Navigator>
          {/* Main profile page*/}
          <Stack.Screen
            name="Main"
            options={{
              headerTitle: '',
              headerRight: (props) =>
                ButtonLogout(props)
            }}
          >
            {(props: stackScreenProps<'Main'>) => (
              <MainPage {...props} />
            )}
          </Stack.Screen>
          {/* Post page */}
          <Stack.Screen name="Post">
            {(props: stackScreenProps<'Post'>) => (
              <PostPage {...props} />
            )}
          </Stack.Screen>
          {/* Search users page*/}
          <Stack.Screen name="Search users">
            {(
              props: stackScreenProps<'Search users'>
            ) => <SearchUsersPage {...props} />}
          </Stack.Screen>
          {/* Adding post page */}
          <Stack.Screen name="Add post">
            {(props: stackScreenProps<'Add post'>) => (
              <AddPostPage {...props} />
            )}
          </Stack.Screen>
          {/* Other user page */}
          <Stack.Screen name="Other user page">
            {(
              props: stackScreenProps<'Other user page'>
            ) => <OtherUserPage {...props} />}
          </Stack.Screen>
          {/* Stream page*/}
          <Stack.Screen name="Stream page">
            {(
              props: stackScreenProps<'Stream page'>
            ) => <StreamPage {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <></>
      )}
    </NavigationContainer>
  )
}

export default GeneralComponent
