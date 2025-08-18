import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle
import {user} from "/TFG/login/login.js"

const firebaseConfig = {
  apiKey: "AIzaSyBL3-DyIr8JEiRbPfGcvfzQ0HLc6auHrvE",
  authDomain: "tfg-community.firebaseapp.com",
  projectId: "tfg-community",
  storageBucket: "tfg-community.firebasestorage.app",
  messagingSenderId: "1032844547594",
  appId: "1:1032844547594:web:8d1a05711dffea459531f3",
  measurementId: "G-1QFPXXQSEF"
}; 

// Initialize Firebase

const db = getFirestore(initializeApp(firebaseConfig));


const colRef = collection(db, "main-chat");
const q = query(colRef, orderBy("Date", "asc")); 
let LastM
let LastU
let messageData;
let userInfo



 if (user.uid) {
       console.log(user) 
    } else {
      window.location = "/TFG/login/login.html"
    }

     
async function getUserInfo(uid) {
    const q = query(collection(db, "users"));
    let userInfo = new Object();

     const Snapshot = await getDocs(q);

     for (const doc of Snapshot.docs) {
     if (doc.data().Uid == uid) {
        userInfo.Nachname = doc.data().Nachname;
        userInfo.Vorname = doc.data().Vorname;
        userInfo.Klasse = doc.data().Klasse;
        
        break;
     }
    
}
    return userInfo;
}

 
async function getSortedDocuments() {


  const querySnapshot = await getDocs(q);
  //document.getElementById("output").innerHTML = ""
  

  for (const doc of querySnapshot.docs) {


  if (doc.data().Date) {
    if (doc.data().User === user.uid) { 
      document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + "<div class='yourmessage'>" + doc.data().Text +  "<p class='time' style='display: none;'>" + String(doc.data().Date)+ "</p>" + "</div>";
    }
   else {
    userInfo = await getUserInfo(doc.data().User)
   
    if (userInfo.Vorname) {
        
      document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + "<div class='message'>"  + "<div class='userinfos'>" +"<p class='name'>" + userInfo.Vorname + "</p>" + "<p class='class'>" + userInfo.Klasse + "</p>" + "</div>" + doc.data().Text +  "<p class='time' style='display: none;'  >" + String(doc.data().Date) + "</p>" + "</div>";
    }
      
    LastU = userInfo.Vorname;
    LastM = doc.data().Text;
    
    }
  }
    

   
    removeShit()
    

  };
  removeShit()

  let elements = document.querySelectorAll(".message, .yourmessage");

  elements[elements.length - 1].scrollIntoView();



}


         



document.getElementById("go").addEventListener("click", async () => {
    const AdddocRef = addDoc(collection(db, "main-chat"), {//dokumenr adden schreiben
  Text:document.getElementById("input").value, 
  Date: serverTimestamp(),
  User: user.uid,
  })

 
 
document.getElementById("input").value = "";
});



getSortedDocuments();

let fr = false;

  onSnapshot(q, (querySnapshot) => {
    if (fr === false) {
      getSortedDocuments();
    } else {
      fr = false
    }
  

  

    if (document.visibilityState == "hidden") {
      setTimeout(() => {
        new Notification("Neue Nachricht von " + LastU , {body: LastM});
      }, 100);
      
    }
  
})









  
    document.getElementById("name").style.display = "none"
    document.getElementById("password").style.display = "none"
    document.getElementById("login").style.display = "none"
    document.getElementById("signin").style.display = "none"
    document.getElementById("logout").style.display = "none"
    document.getElementById("class").style.display = "none"
    document.getElementById("mecker").style.display = "none"
    document.getElementById("bla").style.display = "none"
    document.getElementById("surname").style.display = "none"


   


   
function removeShit() {

   const messages = Array.from(document.querySelectorAll(".message"));

for (let i = 0; i < messages.length; i++) {
  for (let l = i + 1; l < messages.length; l++) {
    if (messages[i] && messages[l] && messages[i].innerHTML === messages[l].innerHTML) {
      messages[l].remove();
      console.log("Removed:", messages[l]?.innerHTML);
      messages.splice(l, 1);
      l--;
    }
  }
}


const yourMessages = Array.from(document.querySelectorAll(".yourmessage"));

for (let i = 0; i < yourMessages.length; i++) {
  for (let l = i + 1; l < yourMessages.length; l++) {
    if (yourMessages[i] && yourMessages[l] && yourMessages[i].innerHTML === yourMessages[l].innerHTML) {
      yourMessages[l].remove();
      console.log("Removed:", yourMessages[l]?.innerHTML);
      yourMessages.splice(l, 1);
      l--;
    }
  }
}


  
  
  



}



setInterval(() => {
  removeShit()
}, 3000);


  
