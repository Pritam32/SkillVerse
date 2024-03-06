import { View, Text, LogBox } from 'react-native'
import React from 'react'
import WelcomeScreen from './Pages/WelcomeScreen'
import SplashScreen from './Pages/SplashScreen'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import 'react-native-gesture-handler'
import 'react-native-screens'
import '@react-native-masked-view/masked-view'
import RegisterScreen from './Pages/RegisterScreen'
import HomeScreen from './Pages/HomeScreen'
import Login from './Pages/Login'
import Hire from './Pages/Hire'
import WorkerPage from './Pages/WorkerPage'
import PhotoUpload from './Pages/PhotoUpload'
import Profile from './Pages/Profile'

const Stack=createStackNavigator();

LogBox.ignoreAllLogs(true);

const App = () => {
  return (
    
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Splash'>
    <Stack.Screen name='Splash' component={SplashScreen} options={{headerShown:false}}/>
    <Stack.Screen name='Welcome' component={WelcomeScreen} options={{headerShown:false}}/>
    <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}/>
    <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
    <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false}}/>
    <Stack.Screen name='Hire' component={Hire} options={{headerShown:false}}/>
    <Stack.Screen name='WorkersPage' component={WorkerPage} options={{headerShown:false}}/>
    <Stack.Screen name='PhotoUpload' component={PhotoUpload} options={{headerShown:false}}/>
    <Stack.Screen name='Profile' component={Profile} options={{headerShown:false}}/>
    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;