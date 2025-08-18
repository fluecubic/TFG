import {user} from "/TFG/login/login.js"

  
    document.getElementById("name").style.display = "none"
    document.getElementById("password").style.display = "none"
    document.getElementById("login").style.display = "none"
    document.getElementById("signin").style.display = "none"
    document.getElementById("logout").style.display = "none"
    document.getElementById("class").style.display = "none"
    document.getElementById("mecker").style.display = "none"
    document.getElementById("bla").style.display = "none"
    document.getElementById("surname").style.display = "none"


    

    if (user.uid) {
       console.log(user) 
    } else {
      window.location = "/TFG/login/login.html"
    }
