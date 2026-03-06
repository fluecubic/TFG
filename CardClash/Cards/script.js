//import {user} from "../../login/login.js"
let user = {uid : "Jonas"}
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
//import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, setDoc, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle
//firebase!
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
//firebase!
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
      //firebase!
    }


    async function getUserInfo(uid) {
        //const q = query(collection(db, "users"));
        //firebase!
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
      Cards: ["0x5", "1x3"],
      Eyro: 9999
     }
     //await getUserInfo(user.uid)
     //firebase!

function loadCards() {
  document.getElementById("MyCards").innerHTML = ""
    for (let i = 0; i < Me.Cards.length; i++) {
        let Number = Me.Cards[i].split("x")[0]
        let Amount = Me.Cards[i].split("x")[1]
        if (Amount > 0) {
          document.getElementById("MyCards").innerHTML += "<div  class='Card " + "Card-"+ Number + "'><img class='CardImg " + "Card-"+ Number + "' src='"+ CardInfo.Cards[Number].img +"'><p class='CardNameSmall " + "Card-"+ Number + "'>" + CardInfo.Cards[Number].Name + "</p> </div>"
          document.getElementsByClassName("Card Card-" + Number)[0].setAttribute("data-before", Amount)
          
        }
        
        
     }
}
    
loadCards()


  document.addEventListener("click", function (event) {
  if (event.target.classList[1] && event.target.classList[1].includes("Card")) {
     document.getElementsByTagName("body")[0].innerHTML += "<div class='blurry blurryC'><div id='viewCard'><img id='CardBig' src='" + CardInfo.Cards[event.target.classList[1].split("-")[1]].img +"'><p id='esc'>x</p><button class='SellButton' id='SellButton" + event.target.classList[1].split("-")[1] + "'>Verkaufen</button></div></div>";

     addEsc()

  }
})

function addEsc() {
  document.getElementById("esc").addEventListener("click", function () {
     document.getElementsByClassName("blurryC")[0].remove()
})
}



function loadPacks() {
  for (let i = 0; i < CardInfo.Packs.length; i++) {
        document.getElementById("Cardpacks").innerHTML += "<div  class='Pack " + "Pack-"+ i + "' id = '" + "Pack-"+ i + "'><img class='CardImg " + "PackImg-"+ i + "' id = '" + "Pack-"+ i + "' src='"+ CardInfo.Packs[i].img +"'> <div class='flex'> <p class='CardNameSmall " + "Card-"+ i + "'>" + CardInfo.Packs[i].Name + "</p> <p class='Arrow " + "Arrow-" + i + "'> < </p> </div></div>"
        document.getElementsByClassName("Pack")[i].setAttribute('data-prize', String(CardInfo.Packs[i].Price) + "€")
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
  let P = CardInfo.Packs[clickedNumber];
  if (tries < P.Cards) {
    let RNG = Math.random();
    if (RNG < P.Chances[0]){ 
        rarity = "basic"
      } else if (P.Chances[0] < RNG && RNG< P.Chances[1]  + P.Chances[0] ) {
        rarity = "rare"
      } else if (P.Chances[0] + P.Chances[1] < RNG && RNG< P.Chances[2] + P.Chances[1] + P.Chances[0] ) {
        rarity = "epic"
      } else if (P.Chances[0] + P.Chances[1] + P.Chances[2] < RNG && RNG< P.Chances[3] + P.Chances[2] + P.Chances[1] + P.Chances[0]){
        rarity = "supporter"
      } else if (P.Chances[0] + P.Chances[1] + P.Chances[2] + P.Chances[3] < RNG && RNG< P.Chances[4] + P.Chances[3] + P.Chances[2] + P.Chances[1] + P.Chances[0]){
        rarity = "legendary"
      }
      
      
      let ValidCards = []
      for (let i = 0; i < CardInfo.Cards.length; i++) {
        if (CardInfo.Cards[i].Rarety == rarity) {
          ValidCards[ValidCards.length] = i;
        }
        
      }
      tries++

     let Pull = ValidCards[Math.floor(Math.random() * ValidCards.length)]
     document.getElementsByClassName("blurry")[0].innerHTML = "<img id='CardBig' style='margin-left: 500px' src='" + CardInfo.Cards[Pull].img +"'>"
     document.getElementsByClassName("blurry")[0].innerHTML += "<p id='Tries'>" + tries + "/" + P.Cards + "</p>"
     let found = false
     for (let i = 0; i < Me.Cards.length; i++) {
        if (Number(Me.Cards[i].split("x")[0]) == Pull) {
          Me.Cards[i] = String(Pull) + "x" + String(Number(Me.Cards[i].split("x")[1]) + 1)
          found = true;
        }
     }
    
     if (!found) {
      Me.Cards[Me.Cards.length] = String(Pull) + "x" + "1"
     }
     console.log(Pull)
     console.log(Me.Cards)
    } else {
      document.getElementsByClassName("blurry")[0].removeEventListener("click", gamble)
      document.getElementsByClassName("blurry")[0].remove() 
      loadCards()
    }
}

function OpenPack() {
  
  if (Me.Eyro >= CardInfo.Packs[clickedNumber].Price) {
  Me.Eyro -= CardInfo.Packs[clickedNumber].Price;  //firebase!
  console.log(Me.Eyro)
  tries = 0;
  document.getElementsByTagName("body")[0].innerHTML +=  "<div class='blurry'><div>"
  document.getElementsByClassName("blurry")[0].addEventListener("click", gamble)
  gamble()   
  } else{
    
  }
  
}


document.addEventListener("click", function (event) {
  if (event.target.id.includes("Pack")) {
    clickedNumber = Number(event.target.id.split("-")[1])
    OpenPack()
  }
})

document.addEventListener("click", function (event) {
  if (event.target.id.includes("SellButton")) {
    createOffer(Number(event.target.id.split("n")[1]))
  }
})

function createOffer(Card) {
  document.getElementsByTagName("body")[0].innerHTML += "<div class='blurry blurryOffer'><div class='Offer'><div id='escape'>x</div><h1 id='Offerh1'>Verkaufen</h1><div class='flex'><h1 class='Offertxt'>Anzahl</h1><input minlength='10' id='Anzahl' type='range'><p id='rangeInfo'>1</p></div><div class='flex'><h1 class='Offertxt'>Preis</h1><input type='number' id='Price'></div><p id='Mecker'></p><button id='Confirm'>Angebot Erstellen</button></div></div>";
  addEsc()
  document.getElementById("escape").addEventListener("click", function () {
   document.getElementsByClassName("blurryOffer")[0].remove()
  })
  let Amount
  let hasCards;
  for (let i = 0; i < Me.Cards.length; i++) {
    if (Me.Cards[i].split("x")[0] == Card) {
       hasCards = Me.Cards[i].split("x")[1]
       console.log(hasCards)
    }
    
  }
  document.getElementById("Anzahl").value = 100/hasCards

  document.getElementById("Anzahl").addEventListener("mousemove" , function () {
    //console.log(document.getElementById("Anzahl").value + " geteilt durch 100 und mal "+ hasCards + " = " + hasCards * (document.getElementById("Anzahl").valueAsNumber/100))
    if ((hasCards * (document.getElementById("Anzahl").valueAsNumber/100)) < 1) {
        document.getElementById("Anzahl").value = 100/hasCards
    }

    
    Amount = Math.round(hasCards * (document.getElementById("Anzahl").valueAsNumber/100))
    document.getElementById("rangeInfo").innerHTML = Amount;
  })

  document.getElementById("Price").value = 10;

  document.getElementById("Confirm").addEventListener("click", (e) => {
    e.preventDefault()

    for (let i = 0; i < Me.Cards.length; i++) {
      if (Me.Cards[i].split("x")[0] == Card) {
           Me.Cards[i] = Card + "x" + (Number(Me.Cards[i].split("x")[1]) - Amount)
      }
    }

    console.log(Me.Cards)

    makeOffer(Card, Math.round(hasCards * (document.getElementById("Anzahl").valueAsNumber/100)), document.getElementById("Price").value);
    document.getElementsByClassName("blurryC")[0].remove()
    document.getElementsByClassName("blurryOffer")[0].remove()
    loadCards()
  }
)  
    
  
  
}

let Offers = []
async function makeOffer(Card, Amount, Price) {

  //await addDoc(collection(db, "offers"), {
  //        user: user.uid,
  //        Card,
  //        Amount,
  //        Price
  //      });
  //firebase!
  Offers[Offers.length] = {
    user: user.uid,
    Card,
    Amount,
    Price

  }

  console.log(Offers)
}

