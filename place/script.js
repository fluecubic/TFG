
import {user} from "../login/login.js"
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

let remaininTime = 3;
let pixels = [];
let ClickedPixelArray;

async function updatePixel() {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    if (document.getElementById(doc.data().number)) {
       let i = 0

       pixels[i] = [doc.data().number, doc.data().color];
       console.log(pixels[i])
    
       i++
       document.getElementById(doc.data().number).style.backgroundColor = doc.data().color; 
    }
})
}

async function loadPixel() {
    const querySnapshot = await getDocs(q);
    let i = 0
  
  querySnapshot.forEach((doc) => {

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
    const colRef = collection(db, "place");
    const q = query(colRef, orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
  
    let found = false;
  
    
    for (const document of querySnapshot.docs) {
      if (document.data().number == number) {
        found = true;
  
        if(document.data().color != color){
        await setDoc(doc(db, "place", document.id), {
          number,
          color,
          time: serverTimestamp(),
          user: user.uid
        })
      }
    

        return;
      }
    }
 
    if (!found) {
      await addDoc(colRef, {
        number,
        color,
        time: serverTimestamp(),
        user: user.uid
      });
    }
  }
  

loadPixel()

document.addEventListener("click", function (event) {
    if (remaininTime < 0) {
       if (event.target.classList.contains("pixel")) {

         for (let i = 0; i < pixels.length; i++) {
        if (document.getElementById(pixels[i][0])) {
            if (pixels[i][0] == event.target.id) {
              ClickedPixelArray = i
              console.log(ClickedPixelArray)
            }
          }
        
    }

      if (pixels[ClickedPixelArray][1] != color) {
      pixels[ClickedPixelArray][1] = color;
      document.getElementById(event.target.id).style.backgroundColor = color;
      remaininTime = 3;
      checkpixel(color, event.target.id)
      }
     
    } 
     
    }
    
  });
  

let scale = 1;

function applyZoom() {
  const iframe = document.getElementById("canvas");
  const iframeDoc = document.getElementById("canvas");
  iframeDoc.style.transform = `scale(${scale})`;
  iframeDoc.style.transformOrigin = "0 0";
}

function zoomIn() {
  scale += 0.1;
  applyZoom();
  document.getElementById("canva").scrollIntoView();
}

function zoomOut() {
  scale = Math.max(0.1, scale - 0.1);
  applyZoom();
  document.getElementById("canva").scrollIntoView();
}


document.getElementById("canvas").addEventListener("wheel", (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }
});

document.getElementById("plus").onclick = zoomIn;
document.getElementById("minus").onclick = zoomOut;

color = "black"
document.getElementById("black").style.scale ="1.2";

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("color")) {
      color = event.target.id;  
      document.getElementById("black").style.scale ="1";
      document.getElementById("white").style.scale ="1";
      document.getElementById("green").style.scale ="1";
      document.getElementById("blue").style.scale ="1";
      document.getElementById("red").style.scale="1";
      document.getElementById("pink").style.scale ="1";
      document.getElementById("purple").style.scale ="1";
      document.getElementById("orange").style.scale ="1";
      document.getElementById("brown").style.scale ="1";
      document.getElementById("yellow").style.scale ="1";
      document.getElementById("gray").style.scale ="1";
     
      document.getElementById(event.target.id).style.scale = "1.2"
    
    }
  });
   


  const out = setInterval(() => {
    remaininTime += -1;
    if (remaininTime <= 0) {
        document.getElementById("time").style.display = "none"
        document.getElementById("canva").style.cursor = "crosshair"
        
    } else{
      document.getElementById("canva").style.cursor = "progress"
      document.getElementById("time").style.display = "block";
    }
  }, 1000);





    for (let i = 0; i < document.getElementsByClassName("l").length; i++) {
         document.getElementsByClassName("l")[i].style.display = "none"
      
    }


    

    if (user.uid) {
       console.log(user) 
    } else {
      window.location = "../login/login.html"
    }
    


  
    