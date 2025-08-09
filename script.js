import {user} from "/TFG/login/login.js"

  
    document.getElementById("name").style.display = "none"
    document.getElementById("password").style.display = "none"
    document.getElementById("login").style.display = "none"
    document.getElementById("signin").style.display = "none"
    document.getElementById("logout").style.display = "none"
    document.getElementById("class").style.display = "none"
    document.getElementById("mecker").style.display = "none"
    document.getElementById("bla").style.display = "none"


    function processClass() {
     let Klasse;
     const creationTime = new Date(user.metadata.creationTime);
     let lastYearStart = []
     lastYearStart[0] = new Date("Mon, 07 Sep 2025 8:05:00 GMT");
     const now = new Date;
     let diffYears = 0;

for (let i = 0; i <= lastYearStart.length; i++) {
  if (now > lastYearStart[i]) {
    if (creationTime < lastYearStart[i]) {
      diffYears++

     }
  }
   
}
  if (user.email.charAt(user.displayName.length) == "1") {
    if (user.email.charAt(user.displayName.length+1) == "0") {
       Klasse = String(Number(user.email.charAt(user.displayName.length) + user.email.charAt(user.displayName.length+1))  + diffYears) + "/" + user.email.charAt(user.displayName.length+2)
    } else {
       Klasse = String(Number(user.email.charAt(user.displayName.length) + user.email.charAt(user.displayName.length+1))  + diffYears)
    }
    
  } else if (user.email.charAt(user.displayName.length) == "L") {
    Klasse = "Lehrer"
   
  } else if (user.email.charAt(user.displayName.length) == "A") {
      Klasse = ""
    }else {
     Klasse = String(Number(user.email.charAt(user.displayName.length))+diffYears) + "/" + user.email.charAt(user.displayName.length+1)
  }
  
  
  return Klasse;

  }


    if (user.uid) {
       console.log(user) 
       console.log(processClass())
    } else {
      window.location = "/TFG/login/login.html"
    }
