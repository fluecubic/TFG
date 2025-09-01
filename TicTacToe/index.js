import {user} from "/TFG/login/login.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, setDoc  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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

const App = initializeApp(firebaseConfig)


const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
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
let currentPlayer = "X";
let running = false;


if (user.uid) {
       console.log(user) 
    } else {
      window.location = "/TFG/login/login.html"
    }

initializeGame();


function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer} ist dran`;
    running = true;
}
function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}
function updateCell(cell,index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer} ist dran`; 
}
function checkWinner(){
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
        statusText.textContent = `${currentPlayer} hat gewonnen!`;
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
function restartGame(){
    window.reload()
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


async function GameSearch() {
    const q = query(collection(db, "TTT")); 
    const querySnapshot = await getDocs(q);
    const colRef = collection(db, "TTT");
    let gameId = ""
    let PlayerO;
    let PlayerX;

    for (const document of querySnapshot.docs) {
    if (document.data().PlayerO == "") {
       gameId = document.id
       PlayerO = user.uid;
       PlayerX = document.data().PlayerX;
       console.log(gameId, " ", PlayerX + " " + PlayerO)
        await setDoc(doc(db, "TTT", gameId), {PlayerO: user.uid },);
    } else if (document.data().PlayerX == "") {
       gameId = document.id
       PlayerO = document.data().PlayerO;
       PlayerX = user.uid;
       console.log(gameId, " ", PlayerX + " " + PlayerO)
        await updateDoc(doc(db, "TTT", gameId), {PlayerX: user.uid },);
    }
}

if (gameId == "") {
   let addDocRef = await addDoc(colRef, {PlayerO: user.uid, PlayerX: "", Cells: ["","","","","","","","",""], Turn: "PlayerX"});
    PlayerO = user.uid;
    gameId = addDocRef.id;
    console.log("new Game: " + gameId +  PlayerX + " " + PlayerO)
    waitForOpponent()
}
   
}


function waitForOpponent() {
    
}
//GameSearch()
    
