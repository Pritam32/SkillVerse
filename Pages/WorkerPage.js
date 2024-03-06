import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Notification from './components/Notification'
import {firebase} from '../config1'

const WorkerPage = () => {
    const [clients,setClients]=useState([]);
    
    useEffect(()=>{
       return firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Clients').onSnapshot(querySnapshot=>{
            const list2=[];
            querySnapshot.forEach(doc=>{
              list2.push({
                id:doc.data().id,
                username:doc.data().username,
                phone:doc.data().phone,
                address:doc.data().address,
                pic:doc.data().pic,
              })
            })
          
            setClients(list2);
            
    })
    },[])

   
  return (
    <View style={styles.container}>
    <Text style={styles.text}>Client Requests:</Text>
    {clients.map((item)=>{
        return(
            <Notification item={item}/>
        );
        
    })

    }
      
    </View>
  )
}

export default WorkerPage

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flex:1,
        paddingHorizontal:'7%',
        
        marginTop:'30%'
    },
    text:{
        fontSize:25,
        fontWeight:'500',
        marginVertical:'5%'

    }
});