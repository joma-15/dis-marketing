function handleDrawer() {
  const drawer = document.getElementById("drawer");
  document.getElementById("openDrawer").addEventListener("click", () => {
    drawer.classList.add("open");
  });
  document.getElementById("closeDrawer").addEventListener("click", () => {
    drawer.classList.remove("open");
  });
}
handleDrawer();

function handlePreloader() {
  const preloader = document.getElementById("preloader");

  if (!sessionStorage.getItem("preloaderShown")) {
    setTimeout(() => {
      preloader.classList.add("fade-out");
      sessionStorage.setItem("preloaderShown", "true");
    }, 3000);
  } else {
    preloader.style.display = "none"; //dont show anything in the screen
  }
}
handlePreloader();

function webLink() {
  const modal = document.getElementById("proceedBtn");
  const services = document.getElementById("services");
  const navServices = document.getElementById("navServices");
  const navTools = document.getElementById("navTools");
  const tools = document.getElementById("tools");

  // const services = document.querySelectorAll('#services', '#navServices');
  // const tools = document.querySelectorAll('#tools', '#navTools');

  tools.addEventListener("click", () => {
    modal.setAttribute("href", "tools.html");
  });

  services.addEventListener("click", () => {
    modal.setAttribute("href", "shop.html");
  });

  //for nav
  navTools.addEventListener("click", () => {
    modal.setAttribute("href", "tools.html");
  });

  navServices.addEventListener("click", () => {
    modal.setAttribute("href", "shop.html");
  });
}
webLink();


function goToAnotherPage() {
  let lastClicked = null; // store context: "services" or "tools"

  const servicesBtn = document.querySelectorAll('.services-btn');
  const toolsBtn = document.querySelectorAll('.tools-btn'); 
  const healthBtn = document.querySelectorAll('.health-btn');

  // Services buttons
  servicesBtn.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Services button clicked');
      lastClicked = "services";
    });
  });

  // Tools buttons
  toolsBtn.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Tools button clicked');
      lastClicked = "tools";
    });
  });

  // Health Insurance buttons
  healthBtn.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      if (lastClicked === "services") {
        console.log("Health → Services page");
        window.location.href = "shop.html";
      } else if (lastClicked === "tools") {
        console.log("Health → Tools page");
        window.location.href = "tools.html";
      } else {
        console.log("Health clicked, but no main button chosen yet");
        // fallback → maybe do nothing or default redirect
        
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', goToAnotherPage);


function gotToAffliate(){
  const button = document.getElementById('affiliate'); 
  button.addEventListener('click', () => {
    window.location.href = "agentlogin.html"; 
  });

  const mobilebutton = document.getElementById("mobile-affiliate"); 
  mobilebutton.addEventListener('click', () => {
    window.location.href = "agentlogin.html";
  });
}
gotToAffliate();