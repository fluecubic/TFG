


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

let remaininTime = 4;
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
  }, 30);

  setTimeout(() => {
    clearInterval(interval)
  }, 6000);
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







 

  async function checkpixel(color, number) {
  
    const colRef = collection(db, "place");
  const q = query(colRef, orderBy("time", "desc")); 
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

loadPixel()

document.addEventListener("click", function (event) {
    remaininTime=localStorage.getItem("delay");
    if (remaininTime < 0) {
       if (event.target.classList.contains("pixel")) {
    color = localStorage.getItem("color");
      document.getElementById(event.target.id).style.backgroundColor =  color ;
      checkpixel(color, event.target.id)
      remaininTime = 6;
      localStorage.setItem("delay", 6)
    } 
    } 
    
  });
  
