import { View, Text,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { firebase } from '../../config1';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

const Notification = ({item}) => {
    const [user,setUser]=useState([]);
    const [isAccepted,setAccepted]=useState(false);
    useEffect(()=>{
        return firebase.firestore().collection('Users').doc(item.id).collection('Hired Workers').where('id','==',''+firebase.auth().currentUser.uid).onSnapshot(querySnapshot=>{
            const list2=[];
            querySnapshot.forEach(doc=>{
              list2.push({
                id:doc.id,
               username:doc.data().Username,
               phone:doc.data().Phone,
               address:doc.data().address,
               profession:doc.data().profession,
               isHired:doc.data().isHired,
               pic:doc.data().pic, 
              })
              setAccepted(doc.data().isHired);
              
            })
            setUser(list2);
            
            
        })
    },[])

    const accept=()=>{
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).update({
            Hired_by:item.id,
            isHired:true,
        }).then(()=>{
            firebase.firestore().collection('Users').doc(item.id).collection('Hired Workers').doc(firebase.auth().currentUser.uid).update({
                isHired:true,
            })
        })
    }
    
  return (
    <View style={{borderWidth:2,borderColor:'black',width:'100%',borderRadius:30,padding:10,backgroundColor:'white',marginBottom:'5%'}}>
      <View style={{marginHorizontal:'2%',display:'flex',flexDirection:'row',alignItems:'center'}}>
      <Image style={{width:80,height:80,borderRadius:100,borderWidth:2,borderColor:'black'}} source={{uri:item.pic}}/>
      <Text style={{marginLeft:'2%',fontSize:18,fontWeight:'500'}}>{item.username}</Text>
      </View> 
      <Text style={{marginLeft:'2%',fontSize:18,fontWeight:'500'}}>Phone: {item.phone}</Text>
      <Text style={{marginLeft:'2%',fontSize:18,fontWeight:'500'}}>Address: jnkjdnkjskdsdsdjsds</Text>  
      <View style={{marginTop:'5%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
       {isAccepted?<Text style={{fontSize:20,color:'green',fontWeight:'500',marginHorizontal:'3%'}}>Accepted</Text>:
        <TouchableOpacity onPress={accept}><Text style={{backgroundColor:'green',padding:10,borderRadius:30,color:'white',fontSize:18,fontWeight:'500'}}>Accept</Text></TouchableOpacity>
       
       }
      </View>
    </View>
  )
}

export default Notification;