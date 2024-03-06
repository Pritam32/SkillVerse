import { View,StyleSheet ,Text,TouchableOpacity,ScrollView,Alert,Image,PermissionsAndroid,ActivityIndicator,Modal,Button } from 'react-native'
import React, { useState,useEffect} from 'react'
import { TextInput } from 'react-native-paper'
import { firebase } from '../config1'
import * as ImagePicker from 'expo-image-picker' 
import HomeScreen from './HomeScreen'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import CheckInternet from './components/CheckInternet'

const PhotoUpload = () => {

    const [change,setchange]=useState(true);
    const [isConnected,setIsConnected]=useState(false);
    const [image, setImage] = useState("");
    const [itemname,setitem]=useState();
    const [final,setFinal]=useState();
    
    const [isloading,setisLonding]=useState(false);
    const user=firebase.auth().currentUser;
    const navigation=useNavigation();  
    const[show,setShow]=useState(false);
    const[minamount,setMin]=useState();
    const [modalVisible,setModalVisible]=useState(false);
  
    const route=useRoute();
    const user1=route.params.user;

    useEffect(()=>{
      console.log(user1);
    },[])

        const takePhotoFromCamera=async()=>{
            
            let result=ImagePicker.launchCameraAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[1,1],
                quality:1,
            })
            if(!result.canceled){
                setImage(result.assets[0].uri)
            }
        }
    

        const choosePhotoFromLibrary = async() => {
            let result=await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[1,1],
                quality:1,
            })
            if(!result.canceled){
                setImage(result.assets[0].uri)
                setModalVisible(true);
            }
            
          };

          const submitPost = async () => {
            setShow(true);
            
            const imageUrl = await uploadImage();
            console.log('Image Url: ', imageUrl);
            firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).update({
                pic:imageUrl,
            })
            .then(()=>{
              if(route.params.type=='Client'){
                navigation.navigate('Home',{user:{
                  uid:firebase.auth().currentUser.uid,
                  username:user1.username,
                  phone:firebase.auth().currentUser.phoneNumber,
                  address:user1.address,
                  pic:imageUrl,
                }});
              }
              else{
                navigation.navigate('WorkersPage');
              }
            })
              
             
            
            
          }

          const uploadImage=async()=> {
           try{
            const {uri}=await FileSystem.getInfoAsync(image);
            const blob=await new Promise((resolve,reject)=>{
                const xhr=new XMLHttpRequest();
                xhr.onload=()=>{
                    resolve(xhr.response);
                };
                xhr.onerror=(e)=>{
                    reject(new TypeError('Network Request Failed'));
                }
                xhr.responseType='blob';
                xhr.open('GET',uri,true);
                xhr.send(null);
            });
            const filename=image.substring(image.lastIndexOf('/')+1);
            const ref=firebase.storage().ref().child(filename);

            await ref.put(blob);
            setisLonding(true);
            const url=await ref.getDownloadURL();
            setFinal(url);
            return url;
            
           } 
           catch(e){
            setisLonding(false);
            console.log(e);
           }

          };
        

  return (
    <View style={{display:'flex',alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white'}}>
    {isConnected?
    <>
     <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(!modalVisible);
        }} style={{display:'flex'}}>
        <View style={{flex:1,backgroundColor:'#000A'}}>
        <View style={{backgroundColor:'white',marginTop:"50%",padding:20,width:"85%",marginLeft:30,elevation:20}}>
          <Image source={{uri:image}} style={{width:300,height:300}}/>
          <TouchableOpacity>
            <Text style={{backgroundColor:"black",padding:10,marginTop:10,alignSelf:'center',fontSize:18,borderRadius:20,color:'white',paddingHorizontal:20 }} onPress={()=>{
              setModalVisible(false),
              Alert.alert("Success","Image Uploaded Successfully !")
              }}
            >OK</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>
      <Text style={{fontWeight:'500',fontSize:25}}>Upload Profile Photo:</Text>
       <View style={{display:'flex',flexDirection:'row',marginTop:20, alignItems:'center',justifyContent:'center'}}>
    <TouchableOpacity onPress={choosePhotoFromLibrary}>
      <Text style={{textAlign:'center',color:'white',width:150,padding:10,fontSize:18,backgroundColor:'#349953',borderRadius:20}}>Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={takePhotoFromCamera}>
      <Text style={{marginLeft:20,textAlign:'center',color:'white',width:150,padding:10,fontSize:18,backgroundColor:'#349953',borderRadius:20}}>Camera</Text>
      </TouchableOpacity>
    </View>
    <View style={{display:'flex',alignItems:'center',marginTop:20,marginBottom:20}}>
    <TouchableOpacity onPress={submitPost}>
      <Text style={{textAlign:'center',color:'white',width:150,padding:10,fontSize:18,backgroundColor:'#349953',borderRadius:100}}>Next</Text>
      </TouchableOpacity>
    {show? <ActivityIndicator size="large" color="green" style={{marginTop:20}} />:null}
    </View>
    </>:null}
    <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected}/>
    </View>
  )
}

export default PhotoUpload

const styles = StyleSheet.create({


});