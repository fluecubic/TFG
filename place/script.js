


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle

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

let canvas = document.getElementById("canva")

function updatePixel() {
    
}

let canvahtml = "";
let xy;
let color = "black";

   async function  buildCanvas() {
    canvas.innerHTML = ""
    for (let row = 0 ; row < 100; row++) {
        
        

             for (let i = 0, row; i < 100; i++) {
                xy = row + i;
            canvahtml  += "<div class='pixel' id='" +  xy  + "' ></div>";
            
            
            
       
        }
        
        canvas.innerHTML += canvahtml;
            canvahtml = "";
        

    }
    
}
try {
    buildCanvas()
} catch (error) {
    console.error("scheisse")
}


  

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("pixel")) {
    color = localStorage.getItem("color");
      document.getElementById(event.target.id).style.backgroundColor =  color 
    }
  });
  

  