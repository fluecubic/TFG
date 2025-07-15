


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

  
  querySnapshot.forEach((doc) => {
    if (document.getElementById(doc.data().number)) {
      document.getElementById(doc.data().number).style.backgroundColor = doc.data().color;
  
    }
   
  });
}







let color = "black";

let idfound = false;

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







 
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("pixel")) {
    color = localStorage.getItem("color");
      document.getElementById(event.target.id).style.backgroundColor =  color ;
      checkpixel(color, event.target.id)
    }
  });
  

  async function checkpixel(color, number) {
  
    const colRef = collection(db, "place");
  const q = query(colRef, orderBy("time", "asc")); 
   const querySnapshot = await getDocs(q);
  
    querySnapshot.forEach(async (document) => {
      if (document.data().number ==  number) {
        
       
        await setDoc(doc(db, "place", document.id), {
            number: number,
            color: color,
            time: serverTimestamp()
          });
          idfound = true;
          
      }
    })
  
     if (idfound == false) {
         console.log("adddoc")
        const AdddocRef = await addDoc(collection(db, "place"), {//dokumenr adden schreiben
            number:number, 
            time: serverTimestamp(),
            color: color})
         
      }
}


setTimeout(() => {
    loadPixel()
    
  }, 1000);

  setTimeout(() => {
    loadPixel()
    
  }, 2000);
  setTimeout(() => {
    loadPixel()
    
  }, 4000);
  setTimeout(() => {
    loadPixel()
    
  }, 6000);
