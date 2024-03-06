import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import WelcomeScreen from './WelcomeScreen'
import { useNavigation } from '@react-navigation/native'

const SplashScreen = () => {

    const navigation=useNavigation();

    useEffect(()=>{
        setTimeout(()=>{
            navigation.navigate('Welcome');
        },2000)
    },[])
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Skill</Text>
      <Text style={styles.text1}>Verse</Text>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
      },
    text:{
        color:'black',
        fontSize:50,
        fontWeight:'500',
    },
    text1:{
        color:'#c44dff',
        fontSize:50,
        fontWeight:'500',
    },
});