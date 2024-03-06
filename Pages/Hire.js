import { StyleSheet, Text, View,Image ,Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {firebase} from '../config1';
import HomeScreen from './HomeScreen';
import call from 'react-native-phone-call';
import CheckInternet from './components/CheckInternet';

const Hire =({navigation}) => {
    const route=useRoute();
    const item=route.params.item;
    const [user,setUser]=useState();
    const [isConnected,setIsConnected]=useState(false);
    
    const caller=()=>{
     
      const args={
        number:item.phone,
        prompt:true,
      }
      call(args).catch(console.error);
    }

    const removeWorker=()=>{
      firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Hired Workers')
      .doc(item.id).update({
        isHired:false,
      }).then(()=>{
        firebase.firestore().collection('Users').doc(item.id).update({
          isHired:false,
        })
    }).then(()=>{
      navigation.navigate('Home',{user:user[0]})
    })
    }
    
    useEffect(()=>{
      return firebase.firestore().collection('Users').where('uid','==',''+firebase.auth().currentUser.uid).onSnapshot(querySnapshot=>{
        
        querySnapshot.forEach(doc=>{
          const list2=[];
          list2.push({
            id:doc.id,
           username:doc.data().Username,
           phone:doc.data().Phone,
           address:doc.data().address,
           pic:doc.data().pic, 
           
          })
          setUser(list2);
          console.log(item);
        })
       
      })
    },[])

    const Hire=()=>{
      firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid)
      .collection('Hired Workers').doc(item.id).set({
        id:item.id,
        username:item.username,
        type:item.type,
        profession:item.profession,
        address:item.address,
        description:item.description,
        isHired:false,
        pic:item.pic,
        
      }).then(()=>{
        firebase.firestore().collection('Users').doc(item.id).collection('Clients').doc(firebase.auth().currentUser.uid).set({
        id:user[0].id,
        username:user[0].username,
        phone:user[0].phone,
        address:user[0].address,
        pic:user[0].pic,
        
      }).then(()=>{
        Alert.alert("Success","Hiring request sent successfully");
      }).then(()=>{
        navigation.navigate('Home',{user:user[0]});
      })
      
    })
      
    }
  

  return (
    <View style={styles.container}>
    {isConnected?<>
      <Image style={{width:200,height:200,borderRadius:100,borderWidth:2,borderColor:'black'}} source={{uri:item.pic}}/>
      <Text style={{color:'black',marginVertical:'5%',fontSize:22,fontWeight:'600'}}>{item.username}</Text>
      <Text style={{fontSize:20}}>Profession: {item.profession}</Text>
      <View style={{marginTop:'10%',width:'100%'}}>
        <Text style={{fontSize:20,fontWeight:'600'}}>Address</Text>
        <Text style={{fontSize:20,marginTop:'3%',color:'gray'}}>{item.address}</Text>
      </View>  
      <View style={{marginTop:'10%',width:'100%'}}>
        <Text style={{fontSize:20,fontWeight:'600'}}>Description</Text>
        <Text style={{fontSize:20,marginTop:'3%',color:'gray'}}>{item.description}</Text>
      </View>  
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
      <TouchableOpacity onPress={caller}><Text style={styles.button}>Call Now</Text></TouchableOpacity>
      {item.isHired?<><TouchableOpacity onPress={removeWorker}><Text style={styles.button}>Remove Now</Text></TouchableOpacity></>:
      <><TouchableOpacity onPress={Hire}><Text style={styles.button}>Hire Now</Text></TouchableOpacity></>
      }
      </View>
    </>:null}
    <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected}/>
    </View>
  )
}

export default Hire

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        paddingHorizontal:'7%',
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

});