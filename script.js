import {user} from "./login/login.js"

  
    for (let i = 0; i < document.getElementsByClassName("l").length; i++) {
         document.getElementsByClassName("l")[i].style.display = "none" 
    }



    

    if (user.uid) {
       console.log(user) 
    } else {
      window.location = "/TFG/login/login.html"
    }
