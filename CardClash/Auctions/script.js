import {user} from "../../login/login.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, setDoc, deleteDoc, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle

const firebaseConfig = {
    apiKey: "AIzaSyBL3-DyIr8JEiRbPfGcvfzQ0HLc6auHrvE",
    authDomain: "tfg-community.firebaseapp.com",
    projectId: "tfg-community",
    storageBucket: "tfg-community.firebasestorage.app",
    messagingSenderId: "1032844547594",
    appId: "1:1032844547594:web:8d1a05711dffea459531f3",
    measurementId: "G-1QFPXXQSEF"
  };

const db = getFirestore(initializeApp(firebaseConfig));

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
      window.location = "../../login/login.html"

    }


    async function getUserInfo(uid) {
        const q = query(collection(db, "users"));

        let userInfo = new Object();
    
         const Snapshot = await getDocs(q);
    
         for (const Doc of Snapshot.docs) {
         if (Doc.data().Uid == uid) {
            userInfo.Nachname = Doc.data().Nachname;
            userInfo.Vorname = Doc.data().Vorname;
            userInfo.Klasse = Doc.data().Klasse;
            userInfo.Cards = Doc.data().Cards
            userInfo.Money = Doc.data().Money
            userInfo.Id = Doc.id

            if (Doc.data().Photo) {
          if (Doc.data().Photo != undefined) {
            userInfo.Photo = Doc.data().Photo;
          } else {
            userInfo.Photo = "../../assets/user.png"
          }
          
        } else {
          userInfo.Photo = "../../assets/user.png"
        }
            
            
            break;
         }
        
    }
        return userInfo;
    }

    
    let Me = await getUserInfo(user.uid)



     let Offers = []

     let q = query(collection(db, "offers"))
     
    let Snapshot = await getDocs(q)

   async function getOffers() {
    Snapshot = await getDocs(query(collection(db, "offers")))
    Me = await getUserInfo(user.uid)

     Offers = []

     for (const Doc of Snapshot.docs) {
      Offers[Offers.length] = {
        user: Doc.data().user,
        Card: Doc.data().Card,
        Amount: Doc.data().Amount,
        Price: Doc.data().Price,
        Id: Doc.id
      };
     }
     console.log("getOffers called")
     console.log(Offers)
   }

     onSnapshot(q, async (Snapshot) => {
         console.log("onSnap happend")
         await getOffers()
         loadOffers()
         
         });
     



     async function loadOffers() {

      await getOffers()

      document.getElementById("MyOffers").innerHTML = ""
      document.getElementById("Offers").innerHTML = ""
        
      
      for (let i = 0; i < Offers.length; i++) {
        if (Offers[i]) {

         let Publisher = await getUserInfo(Offers[i].user)

        if (Offers[i].user == user.uid) {
            document.getElementById("MyOffers").innerHTML += "<div class='Offer'> <img class='CardImg' src='" + CardInfo.Cards[Offers[i].Card].img+ "'> <div class='OfferLeft "+  i +"'> <h1 class='OfferName'>"+ CardInfo.Cards[Offers[i].Card].Name +"</h1> <div class='OfferUser'> <p class='OfferUserName'>"+ Publisher.Vorname +"</p>  <img  src='" + Publisher.Photo + "' class='profilepic OfferProfilePic'> </div> <p class='OfferPrice'>"+ Offers[i].Price +"€</p> <button class='Confirm "+  i +" Delete'>Entfernen</button> </div></div>"
        } else {
          document.getElementById("Offers").innerHTML += "<div class='Offer'> <img class='CardImg' src='" + CardInfo.Cards[Offers[i].Card].img + "'> <div class='OfferLeft "+  i +"'> <h1 class='OfferName'>"+ CardInfo.Cards[Offers[i].Card].Name +"</h1> <div class='OfferUser'> <p class='OfferUserName'>"+ Publisher.Vorname +"</p>  <img  src='" + Publisher.Photo + "' class='profilepic OfferProfilePic'> </div> <p class='OfferPrice'>"+ Offers[i].Price +"€</p> <button class='Confirm "+  i +"'>Kaufen</button> </div></div>"
        }
        document.getElementsByClassName("OfferLeft " + i)[0].setAttribute("amount", String(Offers[i].Amount))
      }
    }
     }




     document.addEventListener("click", async function(e) {
      if (e.target.classList.contains("Confirm")) {
          let thisOffer = Offers[Number(e.target.classList[1])];

        if (e.target.classList.contains("Delete")) {

             let found = false;

        for (let i = 0; i < Me.Cards.length; i++) {
           if (Number(Me.Cards[i].split("x")[0]) == thisOffer.Card) {
             Me.Cards[i] = String(thisOffer.Card) + "x" + String(Number(Me.Cards[i].split("x")[1]) + thisOffer.Amount)
             found = true;
           }
        }
        if (!found) {
         Me.Cards[Me.Cards.length] = String(thisOffer.Card) + "x" + String(thisOffer.Amount)
        }
        
        await updateDoc(doc(db, "users", Me.Id), {
                                           Cards: Me.Cards
                                        }
                                      )
        
          await deleteDoc(doc(db, "offers", Offers[Number(e.target.classList[1])].Id));
          

          loadOffers()
          console.log(Me.Cards)
        } else {
         
        if (Me.Money >= thisOffer.Price) {
           Me.Money -= thisOffer.Price;
           await updateDoc(doc(db, "users", Me.Id), {
                                           Money : Me.Money
                                        }
                                      )
           console.log(Me.Money)

           let Seller = await getUserInfo(thisOffer.user)

           await updateDoc(doc(db, "users", Seller.Id), {
                                           Money : Seller.Money + thisOffer.Price
                                        }
                                      )
           
           let found = false;

        for (let i = 0; i < Me.Cards.length; i++) {
           if (Number(Me.Cards[i].split("x")[0]) == thisOffer.Card) {
             Me.Cards[i] = String(thisOffer.Card) + "x" + String(Number(Me.Cards[i].split("x")[1]) + thisOffer.Amount)
             found = true;
           }
        }
        if (!found) {
         Me.Cards[Me.Cards.length] = String(thisOffer.Card) + "x" + String(thisOffer.Amount)
        }


        await updateDoc(doc(db, "users", Me.Id), {
                                           Cards: Me.Cards
                                        }
                                      )


        await deleteDoc(doc(db, "offers", Offers[Number(e.target.classList[1])].Id));

        loadOffers()
        console.log(Me.Cards)
          
        }
        }
      }
     })




     