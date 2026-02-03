import {user} from "./login/login.js"

  
    for (let i = 0; i < document.getElementsByClassName("l").length; i++) {
         document.getElementsByClassName("l")[i].style.display = "none" 
    }

    const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);

    if (user.uid || isBot) {
       console.log(user) 
    } else {
      window.location = "./login/login.html"
    }
