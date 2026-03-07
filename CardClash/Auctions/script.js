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
const response = await fetch("../Cards/cards.json");
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


     let Offers = [{user: 'Jonas', Card: 1, Amount: 2, Price: '100'},
                   {user: 'TimGiOh', Card: 4, Amount: 15, Price: '20'},
                   {user: 'Patrick', Card: 2, Amount: 1, Price: '70'}
     ]
     //firebase!


     function loadOffers() {
      for (let i = 0; i < Offers.length; i++) {
        if (Offers[i].user == user.uid) {
          
        } else {
          
        }

      }
     }