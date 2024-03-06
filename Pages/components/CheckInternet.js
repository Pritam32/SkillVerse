import { StyleSheet, Text, View,Image } from 'react-native'
import React, { useEffect } from 'react'
import NetInfoState from '@react-native-community/netinfo';

const CheckInternet = ({isConnected,setIsConnected}) => {
    useEffect(()=>{
        const unsubscribe=NetInfoState.addEventListener(state=>{
            console.log("Connection type", state.type);
          console.log("Is connected?", state.isConnected);
          setIsConnected(state.isConnected);
        });
          return()=>{
            unsubscribe();
          };
    },[])
  return (
    <View style={{display:'flex',alignItems:'center'}}>
      {isConnected==true?null:(<><View style={{flex:1,width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><Image source={{uri:'https://media.istockphoto.com/id/1320496766/vector/no-wifi-area-sing-isolate-on-white-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=DtWj62XGCHgKdp5i0akfxnbI4K8w0PsBKaef-7xt88s='}} style={{width:200,height:200,marginTop:100}}/>
      <Text style={{color:'black',backgroundColor:'white',textAlign:'center',fontSize:25}}>No Internet Connection !</Text></View></>)}
    </View>
  )
}


export default CheckInternet

const styles = StyleSheet.create({});