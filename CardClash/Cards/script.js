import {user} from "../../login/login.js"
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
//import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, setDoc, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle

const firebaseConfig = {
    apiKey: "AIzaSyBL3-DyIr8JEiRbPfGcvfzQ0HLc6auHrvE",
    authDomain: "tfg-community.firebaseapp.com",
    projectId: "tfg-community",
    storageBucket: "tfg-community.firebasestorage.app",
    messagingSenderId: "1032844547594",
    appId: "1:1032844547594:web:8d1a05711dffea459531f3",
    measurementId: "G-1QFPXXQSEF"
  };

//const db = getFirestore(initializeApp(firebaseConfig));

const response = await fetch("./cards.json");
const CardInfo = await response.json();

console.log(response);


console.log(CardInfo)

    for (let i = 0; i < document.getElementsByClassName("l").length; i++) {
         document.getElementsByClassName("l")[i].style.display = "none" 
    }

    const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);

    if (user.uid || isBot) {
       console.log(user) 
    } else {
      //window.location = "../../login/login.html"
    }


    async function getUserInfo(uid) {
        //const q = query(collection(db, "users"));
        let userInfo = new Object();
    
         const Snapshot = await getDocs(q);
    
         for (const doc of Snapshot.docs) {
         if (doc.data().Uid == uid) {
            userInfo.Nachname = doc.data().Nachname;
            userInfo.Vorname = doc.data().Vorname;
            userInfo.Klasse = doc.data().Klasse;
            userInfo.Cards = doc.data().Cards
            if (doc.data().Photo && doc.data().Photo != "undifined" || "") {
              userInfo.Photo = doc.data().Photo;
            } else {
              userInfo.Photo = "../assets/user.png"
            }
            
            
            break;
         }
        
    }
        return userInfo;
    }
    
     let Me = {
      Vorname: "Jonas",
      Nachname: "Lorenz",
      Klasse: "8/6",
      Cards: ["0x5", "1x3"]
     }
     //await getUserInfo(user.uid)

function loadCards() {
    for (let i = 0; i < Me.Cards.length; i++) {
        let Number = Me.Cards[i].split("x")[0]
        let Amount = Me.Cards[i].split("x")[1]
        document.getElementById("MyCards").innerHTML += "<div  class='Card " + "Card-"+ Number + "'><img class='CardImg " + "Card-"+ Number + "' src='"+ CardInfo.Cards[i].img +"'><p class='CardNameSmall " + "Card-"+ Number + "'>" + CardInfo.Cards[i].Name + "</p> </div>"
        document.getElementsByClassName("Card")[i].setAttribute('data-before', Amount)
        
     }
}
    
loadCards()

document.addEventListener("click", function (event) {
  if (event.target.classList[1] && event.target.classList[1].includes("Card")) {
      console.log()
     document.getElementsByTagName("body")[0].innerHTML += "<div class='blurry'><div id='viewCard'><img id='CardBig' src='" + CardInfo.Cards[event.target.classList[1].split("-")[1]].img +"'><p id='esc'>x</p><button id='SellButton'>Angebot erstellen</button></div></div>";

     document.getElementById("esc").addEventListener("click", function () {
     document.getElementsByClassName("blurry")[0].remove()
  })

  }
})

function loadPacks() {
  for (let i = 0; i < CardInfo.Packs.length; i++) {
        document.getElementById("CardPacks").innerHTML += "<div  class='Pack " + "Pack-"+ i + "'><img class='CardImg " + "PackImg-"+ i + "' src='"+ CardInfo.Packs[i].img +"'> <div class='flex'> <p class='CardNameSmall " + "Card-"+ i + "'>" + CardInfo.Packs[i].Name + "</p> <p class='Arrow " + "Arrow-" + i + "'> < </p> </div></div>"
        document.getElementsByClassName("Pack")[i].setAttribute('data-prize', String(CardInfo.Packs[i].Price) + "₦")
        console.log(String(CardInfo.Packs[i].Price))
        
     }
}

let PacksInfoOpen = [false, false, false, false, false]

document.addEventListener("click", function (event) {
  if (event.target.classList[0] == "Arrow") {
    let n = Number(event.target.classList[1].split("-")[1])
    if (PacksInfoOpen[n]) {
      document.getElementsByClassName("PackInfo-" + String(n))[0].remove()
      PacksInfoOpen[n] = false
      document.getElementsByClassName("Arrow-" + String(n))[0].style.transform = "rotate(0deg)"
    } else {
      PacksInfoOpen[n] = true
      document.getElementsByClassName("Pack-" + String(n))[0].innerHTML += "<p class='PackInfo PackInfo-" + n + "'>Enthält "+ String(CardInfo.Packs[n].Cards) +" Karten <br>Gewönhlich: "+ String(CardInfo.Packs[n].Chances[0] * 100) +"%<br>Selten: "+ String(CardInfo.Packs[n].Chances[1] * 100) +" %<br>Episch: "+ String(CardInfo.Packs[n].Chances[2] * 100) +" %<br>Legendär: "+ String(CardInfo.Packs[n].Chances[4] * 100) +" %<br>Unterstützerkarten: "+ String(CardInfo.Packs[n].Chances[3] * 100) +" %<p>"
      document.getElementsByClassName("Arrow-" + String(n))[0].style.transform = "rotate(180deg)"
    }
  }
})

loadPacks()

let rarity;
let tries = 0;
let clickedNumber = 0;

function gamble() {
  if (tries < CardInfo.Packs[clickedNumber].Cards) {
    let RNG = Math.random();
    if (RNG < CardInfo.Packs[clickedNumber].Chances[0]) //Baustelle
      
      
      
      console.log(rarity)
      tries++
    } else {
      document.getElementsByClassName("blurry")[0].removeEventListener("click", gamble)
      document.getElementsByClassName("blurry")[0].remove() 
    }
}

function OpenPack() {
  document.getElementsByTagName("body")[0].innerHTML +=  "<div class='blurry'><div>"
  

    document.getElementsByClassName("blurry")[0].addEventListener("click", gamble)
    
}


OpenPack()
