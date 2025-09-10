import {user} from "/TFG/login/login.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, setDoc, FieldPath, deleteDoc  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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



const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
let Oppponenttxt = document.getElementById("opponent")
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
let options = ["", "", "", "", "", "", "", "", ""];
let running = false;
let game = await GameSearch()
let currentPlayer = game.Turn;

if (user.uid) {
       console.log(user) 
    } else {
      window.location = "/TFG/login/login.html"
    }

initializeGame();


function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    if (currentPlayer == game.you) {
         statusText.textContent = `Du bist dran`;
    } else {
        statusText.textContent = currentPlayer.charAt(6) + ` ist dran`
    }
    running = true;
}
async function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running || currentPlayer != game.you){
        return;
    }

    await updateDoc(
        doc(db, "TTT", game.gameId), 
        { [`Cells.${cellIndex}`]: currentPlayer.charAt(6) }
    )
}

async function changePlayer(){
    currentPlayer = (currentPlayer == "PlayerX") ? "PlayerO" : "PlayerX";
    if (currentPlayer == game.you) {
         statusText.textContent = `Du bist dran`;
    } else {
        statusText.textContent = currentPlayer.charAt(6) + ` ist dran`
    }
    
}
async function checkWinner(){
    let roundWon = false;
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        const docRef = doc(db, "TTT", game.gameId);
        await deleteDoc(docRef);
        if (currentPlayer == game.you) {
             statusText.textContent = `Du hast gewonnen!`;
        }
        else {
            statusText.textContent = `Du hast verloren!`;
        }
        
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = `Unentschieden!`;
        running = false;
    }
    else{
        changePlayer();
    }
}
async function restartGame(){
    console.log("gamedelete")
     const docRef = doc(db, "TTT", game.gameId);
    await deleteDoc(docRef);
    window.location.reload()
}



  
document.getElementById("name").style.display = "none"
document.getElementById("password").style.display = "none"
document.getElementById("login").style.display = "none"
document.getElementById("signin").style.display = "none"
document.getElementById("logout").style.display = "none"
document.getElementById("class").style.display = "none"
document.getElementById("mecker").style.display = "none"
document.getElementById("surname").style.display = "none"
document.getElementById("fertig").style.display = "none"
document.getElementById("q").style.display = "none"
document.getElementById("URL").style.display = "none"


async function getUserInfo(uid) {
    const q = query(collection(db, "users"));
    let userInfo = new Object();

     const Snapshot = await getDocs(q);

     for (const doc of Snapshot.docs) {
     if (doc.data().Uid == uid) {
        userInfo.Nachname = doc.data().Nachname;
        userInfo.Vorname = doc.data().Vorname;
        userInfo.Klasse = doc.data().Klasse;
        if (doc.data().Photo) {
          userInfo.Photo = doc.data().Photo;
        } else {
          userInfo.Photo = "/TFG/assets/user.png"
        }
        
        
        break;
     }
    
}
    return userInfo;
}


async function GameSearch() {
    
    let game = new Object();
    const q = query(collection(db, "TTT")); 
    const querySnapshot = await getDocs(q);
    const colRef = collection(db, "TTT");
    let Turn
    let gameId = ""
    let PlayerO;
    let PlayerX;

    for (const document of querySnapshot.docs) {
    if (!document.data().PlayerO) {
       gameId = document.id
       PlayerO = user.uid;
       PlayerX = document.data().PlayerX;
       Turn = document.data().Turn;
       console.log(gameId, " ", PlayerX + " " + PlayerO)
        await setDoc(doc(db, "TTT", gameId), {PlayerO: user.uid },);
    } else if (!document.data().PlayerX) {
       gameId = document.id
       PlayerO = document.data().PlayerO;
       PlayerX = user.uid;
       Turn = document.data().Turn;
        let userInfo = await getUserInfo(PlayerO)
    Oppponenttxt.innerHTML = "Du spielst gegen " + userInfo.Vorname + " " + userInfo.Nachname
       console.log("Game Found: " + gameId, " ", PlayerX + " " + PlayerO)
        await updateDoc(doc(db, "TTT", gameId), {PlayerX: user.uid },);
    }
}

if (gameId == "") {
    uiGameSearch()

    if (Math.random() < 0.5) {Turn = "PlayerO"} else {Turn = "PlayerX"}
    console.log(Turn)
    let addDocRef = await addDoc(colRef, {PlayerO: user.uid, Cells: ["","","","","","","","",""], Turn: Turn});
    PlayerO = user.uid;
    gameId = addDocRef.id;
    console.log("new Game: " + gameId + " " + PlayerO)
    PlayerX = await waitForOpponent(gameId)
    let userInfo = await getUserInfo(PlayerX)
    Oppponenttxt.innerHTML = "Du spielst gegen " + userInfo.Vorname + " " + userInfo.Nachname
    console.log("Player " + PlayerX + " joined game")
}

  game = {gameId: gameId, PlayerO: PlayerO, PlayerX: PlayerX, Turn: Turn}

  if (game.PlayerO == user.uid) {
    game.you = "PlayerO"
    game.opponent = "PlayerX"
  } else {
    game.you = "PlayerX"
    game.opponent = "PlayerO"
  }

  console.log(game)
return game
}


async function waitForOpponent(Id) {
    return new Promise((resolve) => {
        onSnapshot(doc(db, "TTT", Id), (docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.PlayerX) {
                uiGameFound()
                resolve(data.PlayerX);
            }
        });
    });
}


 onSnapshot(doc(db, "TTT", game.gameId), (docSnapshot) => {
            const data = docSnapshot.data();
            for (let i = 0; i < document.querySelectorAll(".cell").length; i++) {
                if (data.Cells[i]) {
                    console.log(i+ ": " + data.Cells[i])
                options[i] = data.Cells[i]
                
                
                
                document.querySelectorAll(".cell").forEach(cell =>
                    {

                        if (document.querySelectorAll(".cell")[i].id == String(i) ) {
                        console.log(document.querySelectorAll(".cell")[i])
                        document.querySelectorAll(".cell")[i].innerHTML = data.Cells[i] }}
                )
            }
            }
            
            checkWinner();
        });
    



const beforeUnloadHandler = (event) => {
  event.preventDefault();
  event.returnValue = true;
};


window.addEventListener("beforeunload", async function (e) {
    const docRef = doc(db, "TTT", game.gameId);
    await deleteDoc(docRef);
})

function uiGameSearch(){
    statusText.textContent = `Warte auf Gegner`;
    cells.forEach( cell => {cell.style.display = "none"})
    restartBtn.style.display = "none"
}

function uiGameFound(){
    statusText.textContent = ``;
    cells.forEach( cell => {cell.style.display = "block"})
    restartBtn.style.display = "block"
}

document.getElementById("title").addEventListener("click", async function (e) {
    const docRef = doc(db, "TTT", game.gameId);
    await deleteDoc(docRef);
})