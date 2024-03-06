import { StyleSheet, Text, View ,Image} from 'react-native'
import React, { useEffect,useState } from 'react'
import DropDown from 'react-native-paper-dropdown';
import { Avatar, Button, Card,Title,Paragraph, Provider} from 'react-native-paper';
import {firebase} from '../config1';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Hire from './Hire';
import { useNavigation, useRoute } from '@react-navigation/native';
import Profile from './Profile';
import CheckInternet from './components/CheckInternet';


const options= [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Gender",
    value: "Gender",
  },
  {
    label: "Profession",
    value: "Profession",
  },
  
];
const genderList= [
  {
    label: "All",
    value: "",
  },
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Others",
    value: "others",
  },
  
];

const professionList= [
  {
    label: "All",
    value: "",
  },
  {
    label: "Babysitter",
    value: "Babysitter",
  },
  {
    label: "Cook",
    value: "Cook",
  },
  {
    label: "Caretaker",
    value: "Caretaker",
  },
  
];


const HomeScreen = () => {

    const [searchQuery, setSearchQuery] =useState('');
    const [list1,setList]=useState([]);
    const [user,setUser]=useState([]);
    const[all,setAll]=useState([]);
    const [option,setOption]=useState("All");
    const [gender,setGender]=useState("");
    const [profession,setProfession]=useState("");
    const [showDropDown,setShowDropDown]=useState(false);
    const [showDropDown1,setShowDropDown1]=useState(false);
    const [isConnected,setIsConnected]=useState(false);

    const navigation=useNavigation();
    const route=useRoute();
    const user1=route.params.user;
    
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
             gender:doc.data().gender,
            
            })
          })
          
          const filteredNumbers = list2.filter(item =>item.type=='Worker' && item.isHired==false);
          
          setList(filteredNumbers);
          console.log(filteredNumbers);
          
         
    })
    
      
    },[])
    

  return (
    <Provider>
    <View style={styles.container}>
    {isConnected==true?
    <>
    <View>
    <View style={{marginVertical:'10%',display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
    <Text style={{fontSize:25,fontWeight:'500'}}>
      Hi {user1.username}
    </Text>
    <TouchableOpacity onPress={()=>navigation.navigate('Profile',{user:user1})}><Image source={{uri:user1.pic}} style={{width:50,height:50,borderRadius:30}}/></TouchableOpacity>
    </View>

    <View style={{display:'flex',alignItems:'center',flexDirection:'row',marginBottom:'5%'}}>
      <Text style={{fontSize:20,marginBottom:'5%'}}>Filter By: </Text>
      <DropDown
              label={"Options"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={option}
              setValue={text=>setOption(text)}
              list={options}
              
    />
    {option=='All'?null:
    option=='Gender'?
    <View style={{marginHorizontal:'2%'}}>
    <DropDown
              label={"Gender"}
              mode={"outlined"}
              visible={showDropDown1}
              showDropDown={() => setShowDropDown1(true)}
              onDismiss={() => setShowDropDown1(false)}
              value={gender}
              setValue={text=>setGender(text)}
              list={genderList}
              
              
    />
    </View>:
    <View style={{marginHorizontal:'2%'}}>
    <DropDown
              label={"Profession"}
              mode={"outlined"}
              visible={showDropDown1}
              showDropDown={() => setShowDropDown1(true)}
              onDismiss={() => setShowDropDown1(false)}
              value={profession}
              setValue={text=>setProfession(text)}
              list={professionList}
              
              
              
    />
    </View>
    }
    
    
    </View>
    {list1.length>0?<>
      <View style={{display:'flex',flexDirection:'column',alignItems:'center',height:'70%'}}>
    {list1.filter(item=>option=='Profession'?item.profession.includes(profession):item.gender.includes(gender)).map(item=>{
      return(
    <View style={{backgroundColor:'white',marginBottom:'5%',display:'flex',flexDirection:'row',width:'100%',borderWidth:1,borderColor:'black',padding:12,alignItems:'center',borderRadius:20}}>
   
   <Image style={{borderRadius:30,width:80,height:80}} source={{ uri:item.pic }} />
   <View style={{display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between',width:'70%'}}>
   <View style={{marginLeft:'10%'}}>
      <Text style={{color:'black',fontSize:16,fontWeight:'500'}}>{item.username}</Text>
      <Text>{item.profession}</Text>
    </View>
    <TouchableOpacity onPress={()=>navigation.navigate('Hire',{item:item,user:user1})}><Text style={{color:'purple',fontSize:14}}>View More</Text></TouchableOpacity>
   </View>
  </View>
      )
     
    })}
    </View>
    </>:
    <>
    <View style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'70%'}}>
      <Text style={{color:'black',fontSize:20}}>No Workers Available</Text>
    </View>
    </>
    }
    
    </View></>:null}
    <CheckInternet
    isConnected={isConnected}
    setIsConnected={setIsConnected}/>
    </View>
    </Provider>
  )
}

export default HomeScreen

const styles = StyleSheet.create({

    container:{
      backgroundColor:'white',
      display:'flex',
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      paddingHorizontal:'6%',
        
    },
    text:{
        fontSize:25,
        fontWeight:'500',
        marginTop:'2%'
    }

});
