import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

export const firebaseConfig={
    apiKey: "AIzaSyC78n_M7obc4Tc3q03Y51jF47eAk7pgWAY",
    authDomain: "skillverse-1ef61.firebaseapp.com",
    projectId: "skillverse-1ef61",
    storageBucket: "skillverse-1ef61.appspot.com",
    messagingSenderId: "394574818760",
    appId: "1:394574818760:web:34c75fcb22e22630e8e4fd"
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig); 
}

