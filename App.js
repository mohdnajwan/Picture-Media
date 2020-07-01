import 'react-native-gesture-handler';
import React, {useContext,useState,useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import auth from '@react-native-firebase/auth'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'

//Import Screen
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import Comment from './components/Comment'
import EditProfile from './components/EditProfile'
import PostDetails from './components/PostDetails'
import SearchUser from './components/SearchUser'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();

const ProfileStackScreen = () =>{
  return(
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile}/>
      <ProfileStack.Screen name="EditProfile" component={EditProfile}/>
      <ProfileStack.Screen name="PostDetails" component={PostDetails} />
      <ProfileStack.Screen name='Comment' component={Comment}/>
    </ProfileStack.Navigator>
  )
}

const HomeStackScreen = ()=>{
  return(
    <HomeStack.Navigator>
      <HomeStack.Screen name="Feed" component={Home} options={{
        title: 'Home',
        headerStyle: {
          backgroundColor: '#ededed',
        },
      }}/>
      <HomeStack.Screen name='Comment' component={Comment}/>
      <HomeStack.Screen name="CreatePost" component={CreatePost}/>
      <HomeStack.Screen name="Profile" component={Profile}/>
    </HomeStack.Navigator>
  )
}

const SearchStackScreen = ()=>{
  return(
    <SearchStack.Navigator>
      <SearchStack.Screen name="SearchUser" component={SearchUser}/>
      <SearchStack.Screen name="Profile" component={Profile} />
      <SearchStack.Screen name="PostDetails" component={PostDetails} />
      <SearchStack.Screen name="Comment" component={Comment} />
    </SearchStack.Navigator>
  )
}

const App = () => {
  const [user,setUser] = useState({})
  useEffect(() => {
    auth().onAuthStateChanged(userAuth=>{
      setUser(userAuth)
    })
  }, [])

  return (
      <NavigationContainer>
        {user ? (
          <Tab.Navigator screenOptions={({route})=>({
            tabBarIcon: ({focused, color,size})=>{
              let iconName;

              if(route.name === 'Home'){
                iconName = focused ? 'ios-home' : 'ios-home'
              }else if(route.name === 'Profile'){
                iconName = focused ? 'ios-list-box' : 'ios-list'
              }else if(route.name === 'SearchUser'){
                iconName = focused ? 'ios-search' : 'ios-search'
              }

              return(<Icon name={iconName} size={size} color={color} />)
            }
          })}
            tabBarOptions={{
              activeTintColor: 'black',
              inactiveTintColor: 'gray'
            }}
          >
            <Tab.Screen name="Home" component={HomeStackScreen}/>
            <Tab.Screen name='SearchUser' component={SearchStackScreen}/>
            <Tab.Screen name="Profile" component={ProfileStackScreen}/>
          </Tab.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
  );
};

export default App;
