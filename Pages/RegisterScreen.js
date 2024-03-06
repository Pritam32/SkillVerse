import { StyleSheet, Text, View,TouchableOpacity,Alert,ActivityIndicator} from 'react-native'
import React, { useState,useRef, useEffect } from 'react'
import { TextInput,Provider,Surface,ThemeProvider} from 'react-native-paper'
import DropDown from "react-native-paper-dropdown";
import HomeScreen from './HomeScreen';
import { RadioButton} from 'react-native-paper';
import Login from './Login';
import {firebase} from '../config1';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import WorkerPage from './WorkerPage';
import { firebaseConfig } from '../config';
import PhotoUpload from './PhotoUpload';
import PhoneInput from 'react-native-phone-number-input';
import validator from 'validator';
import CheckInternet from './components/CheckInternet';


const genderList = [
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

const LifeList = [
    {
      label: "Babysitter",
      value: "Babysitter",
    },
    {
      label: "Caretaker",
      value: "Caretaker",
    },
    {
      label: "Cook",
      value: "Cook",
    },
    
  ];

const RegisterScreen = ({navigation}) => {
    const [username,setUsername]=useState("");
    const [phone,setPhone]=useState("");
    const [email,setEmail]=useState("");
    const [gender, setGender] = useState("");
    const [married, setMarried] = useState("");
    const [password,setPassword]=useState("");
    const [showDropDown, setShowDropDown] = useState(false);
    const [showDropDown1, setShowDropDown1] = useState(false);
    const [address,setAddress]=useState("");
    const [checked, setChecked] = useState('Client');
    const [desc,setDesc]=useState('');
    const [code,setCode]=useState("");
    const [verificationId,setVerificationId]=useState(null);
    const [formattedValue, setFormattedValue] = useState("");
   const [isConnected,setIsConnected]=useState(false);
    const [isclicked,setclicked]=useState(false);
    const [show,setShow]=useState(false);
    const recaptchaVerifier=useRef(null);
    const phoneInput = useRef(null);

    
    const validateEmail=(email)=>{
      const expression=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return expression.test(email);
    }

    const sentVerificationCode=()=>{
     if(checked=='Client'){
      if(username=="" || phone=="" || email =="" || address==""){
        Alert.alert("Invalid", "All fields are required!");
      }
      else if(!validateEmail(email)){
        Alert.alert("Invalid","Invalid Username Or Email")
      }
      else if(!validator.isMobilePhone(phone)){
        Alert.alert("Invalid", "Invalid Phone Number");
      }
      else{
        setShow(true);
        const phoneProvider=new firebase.auth.PhoneAuthProvider();
      phoneProvider.verifyPhoneNumber(formattedValue,recaptchaVerifier.current)
      .then(setVerificationId);
      setclicked(true);
       setShow(false); 
      }
     }
     else{
      if(username=="" || phone=="" || email =="" || address=="" || desc=="" || gender=="",married==""){
        Alert.alert("Invalid", "All fields are required!");
      }
      else if(!validateEmail(email)){
        Alert.alert("Invalid","Invalid username or email")
      }
      else if(!validator.isMobilePhone(phone)){
        Alert.alert("Invalid", "Invalid Phone Number");
      }
      else{
        setShow(true);
        const phoneProvider=new firebase.auth.PhoneAuthProvider();
      phoneProvider.verifyPhoneNumber(formattedValue,recaptchaVerifier.current)
      .then(setVerificationId);
      setclicked(true);
       setShow(false); 
      }
     }
      
    }
    const confirmCode=()=>{
      const credential=firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          code
      );
      
      firebase.auth().signInWithCredential(credential)
      .then(()=>{
          setCode("")
          
      }).then(()=>{
        const ref=firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid);
        if(checked=='Client'){
          
          ref.set({
            uid:firebase.auth().currentUser.uid,
            Username:username,
            Phone:formattedValue,
            type:checked,
            address:address,
            pic:null,
            time:firebase.firestore.Timestamp.fromDate(new Date()),

          }).then(()=>{
              alert("User Registered Successfully ")
              navigation.navigate('PhotoUpload',{type:'Client',user:[{uid:firebase.auth().currentUser.uid,
                username:username,
                phone:formattedValue,
                address:address,
                pic:null,
                time:firebase.firestore.Timestamp.fromDate(new Date()),}]});
          })
          .catch(err=>alert(err));
      }
      else{
        ref.set({
          uid:firebase.auth().currentUser.uid,
          Username:username,
          Phone:formattedValue,
          type:checked,
          Profession:married,
          gender:gender,
          address:address,
          Description:desc,
          Hired_By:null,
          isHired:false,
          pic:null,
          time:firebase.firestore.Timestamp.fromDate(new Date()),

        }).then(()=>{
          alert("User Registered Successfully ")
          navigation.navigate('PhotoUpload',{type:'Worker'});
        })
        .catch(err=>alert(err));

      
      }
      
      })
  
      .catch(err=>{
          alert(err);
      })
  }

    
   
    
  return (
    <Provider>
    <View style={styles.container}>
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
    </>:<>
      <Text style={{fontSize:30,
        fontWeight:'500',
        marginBottom:10,marginTop:'35%'}}>Create New Account</Text>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:'5%'}}>
      <Text style={{fontSize:22}}>Client</Text>
      <RadioButton
        value="Client"
        status={ checked === 'Client' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('Client')}
      />
      <Text style={{fontSize:22,marginLeft:'10%'}}>Worker</Text>
      <RadioButton
        value="Worker"
        status={ checked === 'Worker' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('Worker')}
      />
      </View>
      {checked==='Client'?<>
      <TextInput
      style={styles.input}
      mode='outlined'
      label="Username"
      value={username}
      onChangeText={text => setUsername(text)} />
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
            containerStyle={{width:'75%'}}
            textContainerStyle={{borderTopWidth:1,borderRightWidth:1,borderBottomWidth:1,fontSize:20,
        marginVertical:'2%',height:60}}
        flagButtonStyle={{borderWidth:1,
        marginVertical:'2%',height:60}}
            
            autoFocus
          />
      <TextInput
      style={styles.input}
      mode='outlined'
      label="Email"
      value={email}
      onChangeText={text => setEmail(text)}/>
      
      <TextInput
      style={styles.input1}
      mode='outlined'
      multiline={true}
      label="Address"
      value={address}
      onChangeText={text => setAddress(text)} />
       <TouchableOpacity><Text style={styles.button} onPress={sentVerificationCode}>Register Now</Text></TouchableOpacity>
    </> :
    <>
    <TextInput
      style={styles.input}
      mode='outlined'
      label="Username"
      value={username}
      onChangeText={text => setUsername(text)} />
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
            containerStyle={{width:'75%'}}
            textContainerStyle={{borderTopWidth:1,borderRightWidth:1,borderBottomWidth:1,fontSize:20,
        marginVertical:'2%',height:60}}
        flagButtonStyle={{borderWidth:1,
        marginVertical:'2%',height:60}}
            
            autoFocus
          />
      <View style={{display:'flex',flexDirection:'row'}}>
      <DropDown
              label={"Gender"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={gender}
              setValue={text=>setGender(text)}
              list={genderList}
    />
    <View style={{marginLeft:'12%'}}>
    <DropDown
              label={"Type"}
              mode={"outlined"}
              visible={showDropDown1}
              showDropDown={() => setShowDropDown1(true)}
              onDismiss={() => setShowDropDown1(false)}
              value={married}
              setValue={text=>setMarried(text)}
              list={LifeList}
              
    />
  
    </View>
    </View>
    <TextInput
      style={styles.input1}
      mode='outlined'
      multiline={true}
      label="Address"
      value={address}
      onChangeText={text => setAddress(text)} />
      <TextInput
      style={styles.input1}
      mode='outlined'
      multiline={true}
      label="Describe Yourself"
      value={desc}
      onChangeText={text => setDesc(text)} />
     <TouchableOpacity><Text style={styles.button} onPress={sentVerificationCode}>Register Now</Text></TouchableOpacity>
    </>
    
    } 
   
    <View style={{display:'flex',flexDirection:'row'}}>
    <Text style={{fontSize:20}}>Already have an account?</Text>
    <TouchableOpacity onPress={()=>navigation.navigate('Login')}><Text style={{fontSize:18,color:'#c44dff'}}> Sign in</Text></TouchableOpacity>
    {show? <ActivityIndicator size="large" color="green" style={{marginTop:20}} />:null}
    </View>
    </>}
    </>:null}
    <CheckInternet
      isConnected={isConnected}
      setIsConnected={setIsConnected}
    />
    </View>
    </Provider>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        display:'flex',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
      },
    text:{
        fontSize:30,
        fontWeight:'500',
        marginBottom:10,
    },
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
    input1:{
        fontSize:20,
        marginVertical:'2%',
        width:'75%',
        height:80,
        
    },
});