
let user = "fg"




let nameinput = document.getElementById("name").value;
let passwordinput = document.getElementById("password").value;
let loginbtn = document.getElementById("login");
let signinbtn = document.getElementById("signin");
let logoutbtn = document.getElementById("logout");
let Klasse = document.getElementById("class").value;
let surnameinput = document.getElementById("surname").value;

  



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, setPersistence, browserLocalPersistence, updateEmail   } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



const firebaseConfig = {
    apiKey: "AIzaSyBL3-DyIr8JEiRbPfGcvfzQ0HLc6auHrvE",
    authDomain: "tfg-community.firebaseapp.com",
    projectId: "tfg-community",
    storageBucket: "tfg-community.firebasestorage.app",
    messagingSenderId: "1032844547594",
    appId: "1:1032844547594:web:8d1a05711dffea459531f3",
    measurementId: "G-1QFPXXQSEF"
  };

  const db = getFirestore(initializeApp(firebaseConfig));

  const App = initializeApp(firebaseConfig)

  const auth = getAuth(App)
  

const colRef = collection(db, "users");
const q = query(colRef, orderBy("Uid", "asc")); 




  function uilogedin() {
    document.getElementById("name").style.display = "none"
    document.getElementById("password").style.display = "none"
    document.getElementById("login").style.display = "none"
    document.getElementById("signin").style.display = "none"
    document.getElementById("class").style.display = "none"
     document.getElementById("classinf").style.display = "none"
    document.getElementById("logout").style.display = "block"
    document.getElementById("surname").style.display = "none"
    setTimeout(() => {
        document.getElementById("mecker").innerHTML = "Willkomen in der Hood, " + user.displayName     
    }, 300);
    
 
 }

 function uilogedout() {
    document.getElementById("name").style.display = "block"
    document.getElementById("password").style.display = "block"
    document.getElementById("login").style.display = "block"
    document.getElementById("signin").style.display = "block"
    document.getElementById("class").style.display = "block"
    document.getElementsByTagName("p")[1].style.display = "block"
    document.getElementById("logout").style.display = "none"
    document.getElementById("mecker").innerHTML = ""
    document.getElementById("surname").style.display = "block"
 }

  async function signinwithemail() {
    nameinput = document.getElementById("name").value;
    passwordinput = document.getElementById("password").value;
    Klasse = document.getElementById("class").value;
    let surnameinput = document.getElementById("surname").value;

   try {
    const signin = await signInWithEmailAndPassword(auth, nameinput + "." + surnameinput + "@tfg.com", passwordinput)

    user = signin.user;
    user.emailVerified = true;
    localStorage.setItem("uid", signin.user.uid)
    localStorage.setItem("password", passwordinput)
    localStorage.setItem("email", signin.user.email)
    
    uilogedin();
    
   
    
    return user
   } catch (error) {
    document.getElementById("mecker").innerHTML = "Fehler. Überprüfe ob Name, Passwort und Klasse richtig sind"
    setTimeout(() => {
        window.location.reload()
    }, 2000);
    
   }

  
}

  signinbtn.addEventListener("click", signinwithemail)
  loginbtn.addEventListener("click", loginwithemail);
  
  logoutbtn.addEventListener("click", ausloggen);

  async function loginwithemail() {
    nameinput = document.getElementById("name").value;
    passwordinput = document.getElementById("password").value;
    Klasse = document.getElementById("class").value;
    let surnameinput = document.getElementById("surname").value;

   try {
    const login = await createUserWithEmailAndPassword(auth, nameinput + "." + surnameinput + "@tfg.com", passwordinput)

    user = login.user
    user.emailVerified = true;
    await updateProfile(login.user, { displayName: nameinput })
    localStorage.setItem("uid", login.user.uid)
    localStorage.setItem("password", passwordinput)
    localStorage.setItem("email", login.user.email)
    user = login.user

    const AdddocRef = addDoc(collection(db, "users"), {
     Uid: user.uid,
     Vorname: nameinput,
     Nachname: surnameinput,
     Klasse: Klasse})

    uilogedin()

    

    return user

    
   } catch (error) {
    document.getElementById("mecker").innerHTML = "Fehler. Überprüfe ob Name, Password und Email vorhanden sind, oder ob der Account in deiner Klasse schon existiert"
    setTimeout(() => {
        window.location.reload()
    }, 2000);
   }
    
    
  }

  async function ausloggen() {
    signOut(auth);
    uilogedout()
    localStorage.setItem("uid", "")
    localStorage.setItem("password", "")
    localStorage.setItem("email", "")
  }
  


  
 if (localStorage.getItem("uid")) {
  try {
     const signin = await signInWithEmailAndPassword(auth, localStorage.getItem("email"), localStorage.getItem("password"))

     user = signin.user;

    uilogedin()
    
   
  
  } catch (error) {}
    
 }

 


    

   

  

  


  
  

 export {user,};
