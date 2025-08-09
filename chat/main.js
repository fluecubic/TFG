import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle
import {user, processClass} from "/TFG/login/login.js"

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

const docRef = doc(db, "main-chat", "i87v72qq46Vdl9nhlumf"); //daten Formular
const colRef = collection(db, "main-chat");
const q = query(colRef, orderBy("Date", "asc")); 
let LastM
let LastU
let messageData;

 if (user.uid) {
       console.log(user) 
    } else {
      window.location = "/login/login.html"
    }

     



async function getSortedDocuments() {
  
  const querySnapshot = await getDocs(q);
  document.getElementById("output").innerHTML = ""
  
  querySnapshot.forEach((doc) => {
    
    if (doc.data().User === user.displayName) { 
      document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + "<p class='yourmessage'>" + doc.data().Text + "</p>";
    }
   else {
    document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + "<div class='message'>" + "<div class='userinfos'>" +"<p class='name'>" +doc.data().User + "</p>" + "<p class='class'>" + doc.data().Klasse + "</p>" + "</div>" + doc.data().Text +  "</div>";
    }
    
    LastU = doc.data().User;
    LastM = doc.data().Text;

  });
}


         



document.getElementById("go").addEventListener("click", async () => {
    const AdddocRef = addDoc(collection(db, "main-chat"), {//dokumenr adden schreiben
  Text:document.getElementById("input").value, 
  Date: serverTimestamp(),
  User: user.displayName,
  Klasse: processClass()})

 
 
document.getElementById("input").value = "";
});



getSortedDocuments();

onSnapshot(q, (querySnapshot) => {
  getSortedDocuments();

  document.getElementById("input").scrollIntoView({behavior: "smooth"});

    if (document.visibilityState == "hidden") {
      setTimeout(() => {
        new Notification("Neue Nachricht von " + LastU , {body: LastM});
      }, 100);
      
    }
  
})
  
setTimeout(() => {
  document.getElementById("input").scrollIntoView({behavior: "smooth"})
}, 200);







  
    document.getElementById("name").style.display = "none"
    document.getElementById("password").style.display = "none"
    document.getElementById("login").style.display = "none"
    document.getElementById("signin").style.display = "none"
    document.getElementById("logout").style.display = "none"
    document.getElementById("class").style.display = "none"
    document.getElementById("mecker").style.display = "none"
    document.getElementById("bla").style.display = "none"


   


   







  

