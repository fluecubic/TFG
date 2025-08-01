import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, documentId, FieldPath, where  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle

where(FieldPath.documentId(), "==", id)

const firebaseConfig = {
  apiKey: "AIzaSyD5bua7viD8GGLKJH2Vt_uYoN2zmjb4DBg",
  authDomain: "textchange-91bb5.firebaseapp.com",
  projectId: "textchange-91bb5",
  storageBucket: "textchange-91bb5.appspot.com",
  messagingSenderId: "287967549015", 
  appId: "1:287967549015:web:983d315ece9f8c56f87512", 
  measurementId: "G-40FLEQSHH5"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const docRef = doc(db, "User", "i87v72qq46Vdl9nhlumf"); //daten Formular
let Namen = "";
const colRef = collection(db, "User");
const q = query(colRef, orderBy("name", "asc")); 
let LastM
let LastU
let accId;
let idfound = false;

async function getSortedDocuments() {
  
  const querySnapshot = await getDocs(q);
  document.getElementById("output").innerHTML = ""
  
  querySnapshot.forEach((doc) => {
    if (doc.data().User === Namen) { 
      document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + "<p class='yourmessage'>" + doc.data().Text + "</p>";
    }
   else {
    document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + "<p class='message'>" +doc.data().User + ": " + doc.data().Text + "</p>";
    }
    
    LastU = doc.data().User;
    LastM = doc.data().Text;

  });
}
 
async function checkAcc() {
  
  const colRef = collection(db, "accounts");
const q = query(colRef, orderBy("name", "asc")); 
 const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    if (doc.data().name ==  Namen) {
      accId = doc.id;
      idfound = true;
    }
  })

  if (idfound == false) {
    const AdddocRef = await addDoc(collection(db, "accounts"), {//dokumenr adden schreiben
  name: Namen, 
  status: "online"})

  accId = AdddocRef.id
  }

	localStorage.setItem("accId", accId)
}

if (localStorage.getItem("Namen") == null)
{document.getElementById("entername").onclick = function () {
  Namen = document.getElementById("name").value;
  document.getElementById("login").remove();
  localStorage.setItem("Namen", Namen)
  Notification.requestPermission();
  setTimeout(getSortedDocuments, 300)
  checkAcc()
}
} else { document.getElementById("login").remove();
         Namen = 	localStorage.getItem("Namen")
         accId = 	localStorage.getItem("accId")
         idfound = true;
         setTimeout(getSortedDocuments, 300)}
         checkAcc()

         
         



document.getElementById("go").addEventListener("click", async () => {
  
  if (document.getElementById("img").checked === true) {

    const AdddocRef = addDoc(collection(db, "User"), {//dokumenr adden schreiben
  Text: "<img src='" + document.getElementById("input").value + "' >",
    Date: serverTimestamp(),
    User: Namen})
  } else {

    const AdddocRef = addDoc(collection(db, "User"), {//dokumenr adden schreiben
  Text:document.getElementById("input").value, 
  Date: serverTimestamp(),
   User: Namen})

  }
 
 
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









  

