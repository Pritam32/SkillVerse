import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import {firebase} from '../config1'
import { ScrollView } from 'react-native-gesture-handler';
import Hire from './Hire';
import CheckInternet from './components/CheckInternet';

const Profile = () => {
    const navigation=useNavigation();
    const route=useRoute();
    const user=route.params.user;
    const [list,setList]=useState([]);
    const [isConnected,setIsConnected]=useState(false);

    useEffect(()=>{
        return firebase.firestore().collection('Users').onSnapshot(querySnapshot=>{
            const list2=[];
            querySnapshot.forEach(doc=>{
              list2.push({
                id:doc.id,
               username:doc.data().Username,
               phone:doc.data().Phone,
               type:doc.data().type,
               profession:doc.data().Profession,
               address:doc.data().address,
               description:doc.data().Description,
               isHired:doc.data().isHired,
               pic:doc.data().pic,
              
              })
            })
            
            const filteredNumbers = list2.filter(item =>item.type=='Worker' && item.isHired==true);
        
            setList(filteredNumbers);
            
            
           
      })
      
        
      },[])

  return (
    <View style={{display:'flex',paddingTop:'30%',alignItems:'center',flex:1,backgroundColor:'white'}}>
    {isConnected?<>
      <Image source={{uri:user.pic}} style={{width:150,height:150,borderRadius:100,borderWidth:2,borderColor:'black'}}/>
      <View style={{marginTop:'5%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize:20,fontWeight:'500'}}>Username:</Text>
      <Text style={{marginLeft:'2%',fontSize:20}}>{user.username}</Text>  
      </View>
      <View style={{marginTop:'2%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize:20,fontWeight:'500'}}>Phone:</Text>
      <Text style={{marginLeft:'2%',fontSize:20}}>{user.phone}</Text>  
      </View>
      
      <View style={{width:'100%',paddingHorizontal:20,marginTop:'10%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <Text style={{fontSize:20,fontWeight:'500'}}>Address:</Text>
      <Text style={{fontSize:20}}>{user.address}</Text>  
      
      <Text style={{fontSize:20,fontWeight:'500',marginTop:'4%'}}>Hired Workers:</Text>
      {list.length>0?<>
      <View style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
    {list.map((item)=>{
      return(
        <ScrollView scrollEnabled>
    <View style={{marginVertical:'2%',backgroundColor:'white',marginBottom:'5%',display:'flex',flexDirection:'row',width:'100%',borderWidth:1,borderColor:'black',padding:12,alignItems:'center',borderRadius:20}}>
   
   <Image style={{borderRadius:30,width:80,height:80}} source={{ uri:item.pic }} />
   <View style={{display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between',width:'70%'}}>
   <View style={{marginLeft:'10%'}}>
      <Text style={{color:'black',fontSize:16,fontWeight:'500'}}>{item.username}</Text>
      <Text>{item.profession}</Text>
    </View>
    <TouchableOpacity onPress={()=>navigation.navigate('Hire',{item:item})}><Text style={{color:'purple',fontSize:14}}>View More</Text></TouchableOpacity> 
   </View>
   
  </View>
</ScrollView>
      )
     
    })}
    </View>
    </>:
    <>
    <View style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',marginTop:'5%'}}>
      <Text style={{color:'black',fontSize:20}}>No Workers Available</Text>
    </View>
    </>
    }
    
    </View>
    
    </>:null} 
    <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected}/>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({

    button:{
        
        borderWidth:2,
        borderColor:'#c44dff',
        padding:16,
        borderRadius:30,
        fontSize:18,
        fontWeight:'500',
        color:'#c44dff',
      },
});