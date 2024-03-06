import { StyleSheet, Text, View,TouchableOpacity, Alert,ActivityIndicator } from 'react-native'
import React,{useEffect, useRef, useState} from 'react'
import { TextInput } from 'react-native-paper'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../config';
import HomeScreen from './HomeScreen';
import RegisterScreen from './RegisterScreen';
import PhotoUpload from './PhotoUpload';
import PhoneInput from "react-native-phone-number-input";
import validator from 'validator';
import CheckInternet from './components/CheckInternet';

const Login = ({navigation}) => {
    const [phone,setPhone]=useState("");
    const [code,setCode]=useState("");
    const [verificationId,setVerificationId]=useState(null);
    const [username,setUsername]=useState('');
    const [isclicked,setclicked]=useState(false);
    const recaptchaVerifier=useRef(null);
    const [user,setUser]=useState([]);
    const phoneInput = useRef(null);
    const [formattedValue, setFormattedValue] = useState("");
    const [isConnected,setIsConnected]=useState(false);
    const [show,setShow]=useState(false);

    const sentVerificationCode=()=>{
       if(phone==""){
          Alert.alert("Invalid","Please Enter Your Phone Number!");
       }
       else if(!validator.isMobilePhone(phone)){
        Alert.alert("Invalid","Invalid Phone Number!");

       }
       else{
        setShow(true);
        const phoneProvider=new firebase.auth.PhoneAuthProvider();
        phoneProvider.verifyPhoneNumber(formattedValue,recaptchaVerifier.current)
        .then(setVerificationId);
        setPhone('');
        setFormattedValue('');
        setclicked(true);
        setShow(false);
       }
       
        
        
        
       
    }
    const confirmCode=()=>{
      setShow(true);
        const credential=firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        
        firebase.auth().signInWithCredential(credential)
        .then(()=>{
            setCode("")
            firebase.firestore().collection('Users').where('uid','==',''+firebase.auth().currentUser.uid).onSnapshot(querySnapshot=>{
              const list2=[];
              querySnapshot.forEach(doc=>{
                list2.push({
                  id:doc.id,
                 username:doc.data().Username,
                 type:doc.data().type,
                 phone:doc.data().Phone,
                 address:doc.data().address,
                 pic:doc.data().pic, 
                 gender:doc.data().gender,
                })
              })
              setUser(list2);
              if(list2[0].type=='Client'){
                navigation.navigate('Home',{user:list2[0]});
              }
              else{
                navigation.navigate('WorkersPage');
              }

          })
           setShow(false);
        })
        
    
        .catch(err=>{
            alert(err);
        })
    }

  return (
    <View style={{display:'flex',alignItems:'center',backgroundColor:'white',flex:1,justifyContent:'center'}}>
    {isConnected?<>
    <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig}/>
    {isclicked?<>
        <Text style={{color:'black',fontSize:30,fontWeight:'500'}}>Enter the OTP</Text>
      <TextInput
      style={styles.input}
      mode='outlined'
      label="Enter Code"
      keyboardType="phone-pad"
      value={code}
      onChangeText={text => setCode(text)}/>
    <TouchableOpacity><Text style={styles.button} onPress={confirmCode}>Confirm OTP</Text></TouchableOpacity>
    {show? <ActivityIndicator size="large" color="green" style={{marginTop:20}} />:null}
    </>
    :
    <>
      <Text style={{color:'black',fontSize:30,fontWeight:'500',marginBottom:'8%'}}>Login To Your Account</Text>
      
       <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="DM"
            layout="first"
            onChangeText={(text) => {
              setPhone(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            
            withDarkTheme
            withShadow
            autoFocus
          />
      
    <TouchableOpacity><Text style={styles.button} onPress={sentVerificationCode}>Send OTP</Text></TouchableOpacity>
    <View style={{display:'flex',flexDirection:'row',marginTop:'2%'}}>
    <Text style={{fontSize:20}}>New SkillVerse User?</Text>
    <TouchableOpacity onPress={()=>navigation.navigate('Register')}><Text style={{fontSize:18,color:'#c44dff'}}> Sign up</Text></TouchableOpacity>
    
    </View>
    </>
    }
</>:null}
<CheckInternet
  isConnected={isConnected}
  setIsConnected={setIsConnected}
/>
</View>
  )
}

export default Login

const styles = StyleSheet.create({
    input:{
        fontSize:20,
        marginVertical:'2%',
        width:'75%',
        
    },
    button:{
        marginVertical:'3%',
        backgroundColor:'#c44dff',
        padding:20,
        borderRadius:30,
        fontSize:20,
        fontWeight:'500',
        color:'white',
      },

});