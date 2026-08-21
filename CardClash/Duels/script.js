import {user} from "../../login/login.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, arrayUnion, arrayRemove,  getFirestore, getDocs, getDocFromCache, collection, updateDoc, deleteDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, setDoc, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";//init befehle

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

    async function getUserInfo(uid) {
        const q = query(collection(db, "users"));

        let userInfo = new Object();
    
         const Snapshot = await getDocs(q);
    
         for (const userDoc of Snapshot.docs) {
         if (userDoc.data().Uid == uid) {
            userInfo.Nachname = userDoc.data().Nachname;
            userInfo.Vorname = userDoc.data().Vorname;
            userInfo.Klasse = userDoc.data().Klasse;
            userInfo.Money = userDoc.data().Money
            userInfo.Id = userDoc.id

            if (userDoc.data().Cards) {
              userInfo.Cards = userDoc.data().Cards
            } else {      
                      
                              await updateDoc(doc(db, "users", userDoc.id), {
                                   Cards: []
                                }
                              )
                        userInfo.Cards = []      
                      } 
            
            
           if (userDoc.data().Photo) {
          if (userDoc.data().Photo !== undefined) {
            userInfo.Photo = userDoc.data().Photo;

          } else {
            userInfo.Photo = "../../assets/user.png"
          }
          
        } else {
          userInfo.Photo = "../../assets/user.png"
        }
         
        if (userDoc.data().Online) {
          userInfo.Online = userDoc.data().Online
        } else {
          await updateDoc(doc(db, "users", userDoc.id), {
                                                 Online: "None"
                                              }
                                            )
        }

              

              

            
            
            break;
         }
        
    }
        return userInfo;
    }
    
     
     await getUserInfo(user.uid)

     let Me = await getUserInfo(user.uid);
     console.log(Me)




     if (Me.Online != "Duels") {
      await updateDoc(doc(db, "users", Me.Id), {
                                                 Online: "Duels"
                                              }
                                            )
     }

     



          let q = query(collection(db, "users"))
          
         let Snapshot = await getDocs(q)
     
          onSnapshot(q, async (Snapshot) => {
              console.log("onSnap happend")
               loadOnlineUsers()
              
              });



     async function loadOnlineUsers() {

      let html = ""
        for (const Doc of Snapshot.docs) {

          if (Doc.data().Online) {
          if (Doc.data().Online == "Duels" && Doc.data().Uid !== user.uid) {
              let ProfileInfo = await getUserInfo(Doc.data().Uid)

            html += "<div class='OnlineUser'><p class='OnlineUserName'>" + Doc.data().Vorname + "</p><img class='OnlineUserImg' src='" + ProfileInfo.Photo + "'><button class='StartButton' id='" + Doc.data().Uid + "'>Spiel Starten</button></div>"
            console.log(Doc.data().Online)
          }
        }

          document.getElementById("OnlineUsers").innerHTML = html
        }

        for (let i = 0; i < document.getElementsByClassName("StartButton").length; i++) {
          document.getElementsByClassName("StartButton")[i].addEventListener("click", async function(e) {
            e.preventDefault()
            await StartGameMenu(e)
          })
      
    }
     }




     window.addEventListener("beforeunload", async function () {
      await updateDoc(doc(db, "users", Me.Id), {
                                                 Online: "None"
                                              }
                                            )
     })


     document.addEventListener("visibilitychange", async function() {
      if (document.hidden) {
        await updateDoc(doc(db, "users", Me.Id), {
                                                 Online: "None"
                                              }
                                            )
      } else {
        await updateDoc(doc(db, "users", Me.Id), {
                                                 Online: "Duels"
                                              }
                                            )
      }
});




    let GameId = ""


    async function StartGameMenu(TargetButton) {
      console.log("Started Game with: " + TargetButton.target.id)

      let Callback = await addDoc(collection(db, "games"), {
        Player0: user.uid,
        Player1: TargetButton.target.id,
        Stage: "Menu",
        Ready: []
      })

      console.log(Callback.id)

      GameId = Callback.id

      await updateDoc(doc(db, "users", Me.Id), {
                                                 Online: "None"
                                              })

      let Player1Data = await getUserInfo(TargetButton.target.id)

       document.getElementById("GameMenu").style.display = "block"

       document.getElementById("Name1").innerHTML = Player1Data.Vorname

       document.getElementById("leaveGame").addEventListener("click", async function () {
          await deleteDoc(doc(db, "games", Callback.id)) 
          document.getElementById("GameMenu").style.display = "none"
          GameId = ""
       })

             window.addEventListener("beforeunload", async function () {
       await deleteDoc(doc(db, "games", Callback.id)) 
       GameId = ""
      })

      let clicked = false
      document.getElementById("ready").addEventListener("click", async function () {
        if (!clicked) {
          await updateDoc(doc(db, "games", Callback.id), {
            Ready: arrayUnion(user.uid)
          }) 
          document.getElementById("ready").style.backgroundColor = "rgb(104, 104, 104)"
          clicked = true
        } else {
          await updateDoc(doc(db, "games", Callback.id), {
            Ready: arrayRemove(user.uid)
          }) 
          document.getElementById("ready").style.backgroundColor = "orange"
          clicked = false
        }
          
       })

       

    

    }


    async function joinGame(GameId) {
       console.log("joinedGame: " + GameId)

       let GameDoc = await getDoc(doc(db, "games", GameId))



      await updateDoc(doc(db, "users", Me.Id), {
                                                 Online: "None"
                                              })

      let Player0Data = await getUserInfo(GameDoc.data().Player0)

       document.getElementById("GameMenu").style.display = "block"

       document.getElementById("Name1").innerHTML = Player0Data.Vorname

       document.getElementById("leaveGame").addEventListener("click", async function () {
          await deleteDoc(doc(db, "games", Callback.id)) 
          document.getElementById("GameMenu").style.display = "none"
          GameId = ""
       })

             window.addEventListener("beforeunload", async function () {
       await deleteDoc(doc(db, "games", Callback.id)) 
       GameId = ""
      })

      let clicked = false
      document.getElementById("ready").addEventListener("click", async function () {
        if (!clicked) {
          await updateDoc(doc(db, "games", Callback.id), {
            Ready: arrayUnion(user.uid)
          }) 
          document.getElementById("ready").style.backgroundColor = "rgb(104, 104, 104)"
          clicked = true
        } else {
          await updateDoc(doc(db, "games", Callback.id), {
            Ready: arrayRemove(user.uid)
          }) 
          document.getElementById("ready").style.backgroundColor = "orange"
          clicked = false
        }
          
       })
    }


     onSnapshot(collection(db, "games"), await updateGameMenu())

     async function updateGameMenu() {

      console.log("Game onsnap happend")

      if (GameId == "") {
        

        let GameQuery = await getDocs(collection(db, "games"))

        for (const gameDoc of GameQuery.docs) {
          if (gameDoc.data().Player1 == user.uid) {
            GameId = gameDoc.id
            await joinGame(GameId)
            break
          }
        }
        
      } else {
        //game updates!!!!

        let GameDoc = await getDoc(doc(db, "games", GameId))

         if (GameDoc = undefined) {
                   document.getElementById("GameMenu").style.display = "none"
                   GameId = ""
                   
                 } else{
                  document.getElementById("ready").innerHTML = "Bereit (" + GameDoc.data().Ready.length + "/2)"
                 }

        

        







      }


      
     }



    


    

     for (let i = 0; i < document.getElementsByClassName("l").length; i++) {
              document.getElementsByClassName("l")[i].style.display = "none" 
         }
     
         const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
     
         if (user.uid || isBot) {
            console.log(user) 
         } else {
           window.location = "../../login/login.html"
         }
