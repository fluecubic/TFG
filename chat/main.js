import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, deleteDoc   } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle
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
let chatId = "main-chat";
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

  
let html = ""
  for (const doc of querySnapshot.docs) {


  if (doc.data().Date && doc.data().Chat == chatId) {
    if (doc.data().User === user.uid) { 
      html = html+ "<div class='yourmessage'>" + doc.data().Text +  "<p class='time' style='display: none;'>" + String(doc.data().Date)+ "</p>" + "</div>";
    }
   else {
    userInfo = await getUserInfo(doc.data().User)
   
    if (userInfo.Vorname) {
        
      html = html + "<div class='message'>"  + "<div class='userinfos'>" +"<p class='name'>" + userInfo.Vorname + "</p>" + "<p class='class'>" + userInfo.Klasse + "</p>" + "</div>" + doc.data().Text +  "<p class='time' style='display: none;'  >" + String(doc.data().Date) + "</p>" + "</div>";
    }
      
    LastU = userInfo.Vorname;
    LastM = doc.data().Text;
    
    }
  }
    

   
    removeShit()
    

  };document.getElementById("output").innerHTML = html
  removeShit()

  if (html != "") {
    
  let elements = document.querySelectorAll(".message, .yourmessage");

  elements[elements.length - 1].scrollIntoView();


  }
  

}


         



document.getElementById("go").addEventListener("click", async () => {
    const AdddocRef = addDoc(collection(db, "main-chat"), {//dokumenr adden schreiben
  Text:document.getElementById("input").value, 
  Date: serverTimestamp(),
  User: user.uid,
  Chat: chatId
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

const buttons = Array.from(document.querySelectorAll(".chat-button"));

for (let i = 0; i < buttons.length; i++) {
  for (let l = i + 1; l < buttons.length; l++) {
    if (buttons[i] && buttons[l] && buttons[i].innerHTML === buttons[l].innerHTML) {
      buttons[l].remove();
      buttons.splice(l, 1);
      l--;
    }
  }
}
  
  
  



}



//setInterval(() => {
//  removeShit()
//}, 3000);


document.addEventListener("click", function (e) {
 if (e.target.classList.contains("chat-button")) {
    chatId = e.target.id
    getSortedDocuments()
  }
  
})

async function  loadChatOptions() {
  const userData =  await getUserInfo(user.uid)
  document.getElementById("chat-select").innerHTML += "<button id='" + userData.Klasse + "' class='chat-button' >" + userData.Klasse + " Chat</button>"

  const q = query(collection(db, "main-chat")); 
  const querySnapshot = await getDocs(q);

for (const doc of querySnapshot.docs) { 

  if (String(doc.data().Chat).length == 57) {

    if (doc.data().Chat.includes(user.uid)) {

      let uid1 = doc.data().Chat.slice(0, 28)
      let uid2 = doc.data().Chat.slice(29, 57)

      if (uid1 == user.uid) {
    const userData =  await getUserInfo(uid2)
    document.getElementById("chat-select").innerHTML += "<button id='" + uid1 + "-" + uid2 + "' class='chat-button' >" + userData.Vorname + " " + userData.Nachname + "</button>"
      } else{
       const userData =  await getUserInfo(uid1)
    document.getElementById("chat-select").innerHTML += "<button id='" + uid1 + "-" + uid2 + "' class='chat-button' >" + userData.Vorname + " " + userData.Nachname + "</button>"
      }
    }
  }
}

removeShit()
}



async function oldStuff() {
  const querySnapshot = await getDocs(q);
  const now = new Date();

  for (const d of querySnapshot.docs) {
    const docDate = new Date(d.data().Date); 
    const docRef = doc(db, "main-chat", d.id);

    if (now - docDate > 10) {
      await deleteDoc(docRef);
      console.log("Deleted:", d.id, JSON.stringify(d.data()));
    }

     if (!d.data().Chat) {
      await deleteDoc(docRef);
      console.log("Deleted:", d.id, JSON.stringify(d.data()));
    }
  }
}

loadChatOptions()
oldStuff()

let hideStatus = "menu";

document.getElementById("hide").addEventListener("click", function () {
  if (hideStatus === "menu") {
    hideStatus = "cross";
    document.getElementById("hide").src = "/TFG/assets/cross.png";
    document.getElementById("select-chat").style.display = "block";
    document.getElementById("hide").style.left = "265px";

  } 
  else if (hideStatus === "cross") {
    hideStatus = "menu";
    document.getElementById("hide").src = "/TFG/assets/menu.png";
    document.getElementById("select-chat").style.display = "none";
    document.getElementById("hide").style.left = "5px";
  }
});


 await loaddmoptions()

document.getElementById("new-dm").addEventListener("click", function () {
  document.getElementById("dms").style.display = "block"
  

})

document.getElementById("esc").addEventListener("click", function () {
  document.getElementById("dms").style.display = "none"
  console.log("zftztj")
})

async function loaddmoptions() {

  const q = query(collection(db, "users")); 

  const querySnapshot = await getDocs(q);

for (const doc of querySnapshot.docs) { 
  document.getElementById("dms").innerHTML += "<div id='" + doc.data().Uid + "' class='dm-option'>"+ doc.data().Vorname+ " " + doc.data().Nachname + " "+ doc.data().Klasse + "</div>"

}


}

document.addEventListener("click", async function (e) {
 if (e.target.classList.contains("dm-option")) {
    chatId = String(e.target.id) + "-" + String(user.uid)
    const userData =  await getUserInfo(e.target.id)
    document.getElementById("chat-select").innerHTML += "<button id='" + chatId+ "' class='chat-button' >" + userData.Vorname + " " + userData.Nachname + "</button>"
    getSortedDocuments()
  }
  
})
