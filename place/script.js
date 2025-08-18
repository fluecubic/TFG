

let user = sessionStorage.getItem("User")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, setDoc, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const colRef = collection(db, "place");
const qone = query(colRef, orderBy("time", "asc",), limit(1));  
const q = query(colRef, orderBy("time", "asc")); 

let remaininTime = 5000;
let pixels = [];

async function updatePixel() {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    if (document.getElementById(doc.data().number)) {
       document.getElementById(doc.data().number).style.backgroundColor = doc.data().color; 
    }
})
}

async function loadPixel() {
    const querySnapshot = await getDocs(q);
    let i = 0
  
  querySnapshot.forEach((doc) => {

    console.log(doc.data().number, doc.data().color)
    pixels[i] = [doc.data().number, doc.data().color];

    
    console.log(pixels[i])
    
    i++
   
  });

 const interval = setInterval(() => {
    for (let i = 0; i < pixels.length; i++) {
        if (document.getElementById(pixels[i][0])) {
            document.getElementById(pixels[i][0]).style.backgroundColor = pixels[i][1];
          }
        
    }
  }, 300);

  setTimeout(() => {
    clearInterval(interval)
  }, 6000);
}







let color = "black";



function buildCanvas() {
    const canva = document.getElementById("canva");
    canva.innerHTML = "";
    let row = 0;
  
    function drawRow() {
      if (row >= 100) return;
  
      let html = "";
      for (let col = 0; col < 100; col++) {
        html += `<div class="pixel" id="pixel-${row}-${col}"></div>`;
      }
      canva.innerHTML += html;
  
      row++;
      setTimeout(drawRow, 30); 
    }
  
    drawRow();
  } 
    
  onSnapshot(q, (querySnapshot) => {
        updatePixel()
    });
  

buildCanvas();







 

async function checkpixel(color, number) {
    user = sessionStorage.getItem("User")
    const colRef = collection(db, "place");
    const q = query(colRef, orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
  
    let found = false;
  
    
    for (const document of querySnapshot.docs) {
      if (document.data().number === number) {
        found = true;
  
        if (document.data().color === color) {
          return;
        }
  
    
        await setDoc(doc(db, "place", document.id), {
          number,
          color,
          time: serverTimestamp(),
          user: user
        }, { merge: true });

        return;
      }
    }
 
    if (!found) {
      await addDoc(colRef, {
        number,
        color,
        time: serverTimestamp(),
        user: user
      });
    }
  }
  

loadPixel()

document.addEventListener("click", function (event) {
    remaininTime=sessionStorage.getItem("delay");
    if (remaininTime < 0) {
       if (event.target.classList.contains("pixel")) {
       color = sessionStorage.getItem("color");
      document.getElementById(event.target.id).style.backgroundColor =  color ;
      checkpixel(color, event.target.id)
      remaininTime = 4;
      sessionStorage.setItem("delay", 4)
     
    } 
     
    }
    
  });
setInterval(() => {
    if (sessionStorage.getItem("delay") <= 0) {
    document.getElementById("canva").style.cursor = "crosshair"
  } else {
     document.getElementById("canva").style.cursor = "progress"
  }
}, 100);
  
  





  
    