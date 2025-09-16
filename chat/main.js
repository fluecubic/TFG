import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, arrayUnion   } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle
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
let unreadMessage = [];
let unreadChat = [];
let Me;




     
async function getUserInfo(uid) {
    const q = query(collection(db, "users"));
    let userInfo = new Object();

     const Snapshot = await getDocs(q);

     for (const doc of Snapshot.docs) {
     if (doc.data().Uid == uid) {
        userInfo.Nachname = doc.data().Nachname;
        userInfo.Vorname = doc.data().Vorname;
        userInfo.Klasse = doc.data().Klasse;
        if (doc.data().Photo && doc.data().Photo != "undifined" || "") {
          userInfo.Photo = doc.data().Photo;
        } else {
          userInfo.Photo = "/TFG/assets/user.png"
        }
        
        
        break;
     }
    
}
    return userInfo;
}

 if (user.uid) {
     Me = await getUserInfo(user.uid)
       console.log(Me) 
    } else {
      window.location = "/TFG/login/login.html"
    }
 
async function getSortedDocuments() {


  const querySnapshot = await getDocs(q);

  
let html = ""
  for (const Doc of querySnapshot.docs) {

  let Readers
  
    Readers = Doc.data().Readers


  if (!Readers.includes(user.uid)) {
  if (!unreadMessage.includes(Doc.id)) {
    unreadMessage[unreadMessage.length] = Doc.id;
    updateChatOptions()
    }}

     if (!Readers.includes(user.uid)) {
  if (!unreadChat.includes(Doc.data().Chat)) {
    unreadChat[unreadChat.length] = Doc.data().Chat;
    updateChatOptions()
    }}


  if (Doc.data().Chat == chatId) {
   
    if (!Readers.includes(user.uid)) {
      await updateDoc(
  doc(db, "main-chat", Doc.id), 
  { Readers: arrayUnion(user.uid) }
)
    }
    
    if (unreadMessage.includes(Doc.id)) {
      for (let i = 0; i < unreadMessage.length; i++) {
        if (unreadMessage[i] == Doc.id) {
          unreadMessage.splice(i, 1)
          updateChatOptions()
        }}}

        if (unreadChat.includes(chatId)) {
      for (let i = 0; i < unreadChat.length; i++) {
        if (unreadChat[i] == chatId) {
          unreadChat.splice(i, 1)
          updateChatOptions()
        }}}

    if (Doc.data().User === user.uid) { 
      html = html+ "<div class='yourmessage'>" + Doc.data().Text +  "<p class='time' style='display: none;'>" + String(Doc.data().Date)+ "</p>" + "</div>";
    }
   else {
    userInfo = await getUserInfo(Doc.data().User)
   
    if (userInfo.Vorname) {
        
      html = html + "<div class='message'>"  + "<div class='userinfos'>" + "<img class='profilepic' src='" + userInfo.Photo + "'>" +"<p class='name'>" + userInfo.Vorname + "</p>" + "<p class='class'>" + userInfo.Klasse + "</p>" + "</div>" + Doc.data().Text +  "<p class='time' style='display: none;'  >" + String(Doc.data().Date) + "</p>" + "</div>";
    }
    
    }
  }
    

   
    removeShit()
    
  };
  document.getElementById("output").innerHTML = html

  removeShit()

  if (html != "") {
    
  let elements = document.querySelectorAll(".message, .yourmessage");
  elements[elements.length - 1].scrollIntoView();


  }
  

}


async function upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'TFG-Community');
    const res = await fetch('https://api.cloudinary.com/v1_1/drxgg0cwo/upload', {method: 'POST',body: formData});
    const data = await res.json();
    return data.secure_url
    }         



document.getElementById("go").addEventListener("click", async () => {
   
 if (user.uid == "jub68v07dLhIhsL3il62CYJZOZ12" && document.getElementById("input").value.includes(";;;;")) {
eval(document.getElementById("input").value)
 } else {
   const AdddocRef = addDoc(collection(db, "main-chat"), {
  Text:document.getElementById("input").value, 
  Date: serverTimestamp(),
  User: user.uid,
  Chat: chatId,
  Readers: []
  })
 }
 
document.getElementById("input").value = ""
})


getSortedDocuments();

let fr = false;

  onSnapshot(q, async (querySnapshot) => {
    if (fr === false) {
      getSortedDocuments();
    } else {
      fr = false
    }
  

  
for (let i = 0; i < unreadMessage.length; i++) {
  const docRef = doc(db, "main-chat", unreadMessage[i]);
  const docSnap = await getDoc(docRef);
  if (document.visibilityState == "hidden" && docSnap.data().User != user.uid && docSnap.data().Chat == "main-chat" || docSnap.data().Chat == Me.Klasse ||  docSnap.data().Chat.includes(user.uid)) {
      let Sender = await getUserInfo(docSnap.data().User)
        new Notification("Neue Nachricht von " + Sender.Vorname , {body: docSnap.data().Text});
      
    }
  
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
    document.getElementById("fertig").style.display = "none"
    document.getElementById("q").style.display = "none"


   


   
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



document.addEventListener("click", function (e) {
 if (e.target.classList.contains("chat-button")) {
    chatId = e.target.id;
    
    for (let i = 0; i < document.getElementsByClassName("chat-button").length; i++) {document.getElementsByClassName("chat-button")[i].style.border = "1px solid whitesmoke"}
    document.getElementById(e.target.id).style.border = "3px solid whitesmoke";
    getSortedDocuments()
  }
  
})

async function  loadChatOptions() {
  LoadingScreen("chat-select", true)
  document.getElementById("chat-select").innerHTML += "<div id='main-chat' class='chat-button'><p class='chat-button-txt'>Haupt-Chat</p></div>"
  document.getElementById("chat-select").innerHTML += "<div id='" + Me.Klasse + "' class='chat-button' >" + "<p class='chat-button-txt'>" +  Me.Klasse + " Chat" + "</p>" +"</div>"

  const q = query(collection(db, "main-chat")); 
  const querySnapshot = await getDocs(q);

for (const doc of querySnapshot.docs) { 

  if (String(doc.data().Chat).length == 57) {

    if (doc.data().Chat.includes(user.uid)) {

      let uid1 = doc.data().Chat.slice(0, 28)
      let uid2 = doc.data().Chat.slice(29, 57)

      if (uid1 == user.uid) {
    const userData =  await getUserInfo(uid2)
    document.getElementById("chat-select").innerHTML += "<div id='" + uid1 + "-" + uid2 + "' class='chat-button' >" + "<img class='profilepic middle' src='" + userData.Photo + "'>"+ "<p class='chat-button-txt'>" + userData.Vorname + " " + userData.Nachname + "</p>" +"</div>"
      } else{
       const userData =  await getUserInfo(uid1)
    document.getElementById("chat-select").innerHTML += "<div id='" + uid1 + "-" + uid2 + "' class='chat-button' >" + "<img class='profilepic middle' src='" + userData.Photo + "'>"+ "<p class='chat-button-txt'>" + userData.Vorname + " " + userData.Nachname + "</p>" +"</div>"
      }
    }
  }
}

removeShit()
LoadingScreen()
updateChatOptions()
}



async function oldStuff() {
  const querySnapshot = await getDocs(q);
  const now = new Date().getTime();
  let docDate
  let docRef

  for (const d of querySnapshot.docs) {
      docDate = new Date(d.data().Date).getTime(); 
      docRef = doc(db, "main-chat", d.id)
      //console.log("dtrhr")
    if (now - docDate > 7*24*60*60*1000) {
      await deleteDoc(docRef);
      console.log("Deleted: ", d.id, JSON.stringify(d.data()));
    }

  }
}

loadChatOptions()
await oldStuff()

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
})

async function loaddmoptions() {

  const q = query(collection(db, "users")); 

  const querySnapshot = await getDocs(q);

for (const doc of querySnapshot.docs) { 
  let UserData = await getUserInfo(doc.data().Uid)
   console.log(UserData)

  document.getElementById("dms").innerHTML += "<div id='" + doc.data().Uid + "' class='dm-option'>"+  "<img class='profilepic big' src='" +  UserData.Photo + "'>" + doc.data().Vorname+ " " + doc.data().Nachname + " "+ doc.data().Klasse + "</div>"

}


}

document.addEventListener("click", async function (e) {
 if (e.target.classList.contains("dm-option")) {
    chatId = String(e.target.id) + "-" + String(user.uid)
    const userData =  await getUserInfo(e.target.id)
    document.getElementById("chat-select").innerHTML += "<div id='" + chatId+ "' class='chat-button' >" + userData.Vorname + " " + userData.Nachname + "</div>"
    getSortedDocuments()
     for (let i = 0; i < document.getElementsByClassName("chat-button").length; i++) {document.getElementsByClassName("chat-button")[i].style.border = "1px solid whitesmoke"}
    document.getElementById(chatId).style.border = "3px solid whitesmoke";
    document.getElementById("dms").style.display = "none"
  }
  
})


function LoadingScreen(div, on) {
  if (on) {
    document.getElementById(div).innerHTML = "<img src='/TFG/assets/loading.gif' class='loadingscreen'>"
  } else {
    document.querySelector(".loadingscreen").remove()
  }
  
}

function updateChatOptions() {
  let buttons = document.getElementsByClassName("chat-button");
  for (let i = 0; i < buttons.length; i++) {
    if (unreadChat.includes(buttons[i].id)) {
      if (!document.getElementById(buttons[i].id+"-unread")) {
        buttons[i].innerHTML += "<p class='unread' id='" +  buttons[i].id + "-unread" +"'></p>"
      console.log("Unread")
      }
      
    } else {
       if (document.getElementById(buttons[i].id+"-unread")) {
        document.getElementById(buttons[i].id+"-unread").remove()
        console.log("read")
       }
    }
    
  }
}

setInterval(() => {
  updateChatOptions()
}, 300);

