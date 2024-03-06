import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import HomeScreen from './HomeScreen'
import WorkerPage from './WorkerPage'
import RegisterScreen from './RegisterScreen'
import CheckInternet from './components/CheckInternet'

const WelcomeScreen = ({navigation}) => {

  const [isConnected,setIsConnected]=useState(false);
  return (
    <View style={styles.container}>
    {isConnected?<>
    
      <Image style={styles.image} source={{uri:"https://img.freepik.com/free-vector/charity-concept-illustration_114360-24382.jpg?size=626&ext=jpg&uid=R95114380&ga=GA1.1.2141996256.1706883980&semt=ais"}}/>
      <Text style={{fontWeight:'700',fontSize:25,marginTop:15,width:'80%'}}>Welcome to SkillVerse-Your one-stop destination!</Text>
      <Text style={styles.text}>Best Platform for finding experienced cooks, reliable babysitters, and compassionate caretakers!</Text>
      <TouchableOpacity><Text style={styles.button} onPress={()=>navigation.navigate('Login')}>Get Started</Text></TouchableOpacity>
    
    </>:null}
    <CheckInternet
    isConnected={isConnected}
    setIsConnected={setIsConnected}/>
    </View>
    
  )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
   
  container:{
    backgroundColor:'white',
    display:'flex',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  image:{
    width:'89%',
    height:'40%',
    marginTop:'25%'
  },
  text:{
    marginVertical:'5%',
    fontSize:18,
    marginHorizontal:"3%",
    fontWeight:"500",
    color:'gray',
  },
  button:{
    marginVertical:'10%',
    borderWidth:2,
    borderColor:'#c44dff',
    padding:20,
    borderRadius:30,
    fontSize:20,
    fontWeight:'500',
    color:'#c44dff',
  }

})