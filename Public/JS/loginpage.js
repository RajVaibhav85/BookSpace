//-------------------------------------------SWITCH BETWEEN REGISTRATION N LOGIN -----------------------------------
const container = document.getElementById('container');
function showLogin() {
    container.innerHTML = `
    <h1>Login to BookSpace</h1>
    <form action="/login" method="post">

    <label for="username">Username</label><br>
    <input type="text" id="username" name="username" required><br><br>

    <label for="password">Password</label><br>
    <input type="password" id="password" name="password" required><br><br>

    <div style="display: flex; gap: 20px;">
    <input type="button" value="Register" onclick="showRegister()">
    <input type="submit" value="Login">
    </div>
    
    </form>
    `;
    
}
function showRegister() {
    container.innerHTML = `
    <h1>Register to BookSpace</h1>
    <form action="/register" method="post">

    <label for="username">Username</label><br>
    <input type="text" id="username" name="username" required><br><br>

    <label for="email">Email</label><br>
    <input type="text" id="email" name="email" required><br><br>

    <label for="password">Password</label><br>
    <input type="password" id="password" name="password" required><br><br>

    <div style="display: flex; gap: 20px;">
    <input type="submit" value="Register" >
    <input type="button" value="Login" onclick="showLogin()">
    </div>

    </form>
    `;
    
}
showLogin();
//-------------------------------------------SWITCH BETWEEN REGISTRATION N LOGIN ( above code)  ----------------------------------- 
//add extra js here if u r willing to
//-------------------------------------------Canvas Code ( dont move canvas code to top of page )--------------------------

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");  
ctx.fillStyle = "red";
ctx.fillRect(50, 50, 150, 150);
let isDarkTheme = true;
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const starsMove =[]
const starsStay =[]
const StarCount = 50;
const comets = [];

function createComet() {
  comets.push({
    x: Math.random() * canvas.width,
    y: 0,
    size: Math.random() * 3 + 2,
    length: Math.random() * 120 + 40,
    speed: Math.random() * 0.4 + 2
  });
}
createComet();
createComet();
for (let i = 0; i < StarCount; i++) {
    starsMove.push({
        x:Math.random()*canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random()*0.000001 + 0.2,
    });
    starsStay.push({
        x:Math.random()*canvas.width,
        y: Math.random() * canvas.height,
        radius:Math.random() * 1.5,
        count:0,
        visible:true,

    });
    
}
function drawComet(comet) {
  // tail
  ctx.beginPath();
  ctx.moveTo(comet.x, comet.y);
  ctx.lineTo(comet.x - comet.length, comet.y - comet.length);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.stroke();
  //head
  ctx.beginPath();
  ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  //glow
  ctx.beginPath();
  ctx.arc(comet.x, comet.y, comet.size * (Math.random() +3), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fill();
}

function animatingStar(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lightblue";
    //twinkling stars
    starsStay.forEach(star=>{
        if(Math.random()>0.5){
            star.count-=10;
        }
        if(star.visible){ 
            ctx.beginPath(); //new drawing so it wont connct with previous star
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            
        }else{
            star.count+=100
        }
        if(star.count>1000){
            star.count = 0;
            star.visible = !star.visible;
            
        }
        star.count+=10;
    });
    // star will be moving :) 
    starsMove.forEach(star => {
        //randombool = Math.random() > 0.5
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        star.y += star.speed;
        star.x += star.speed;
        
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        if (star.x > canvas.width) {
            star.x = 0;
            star.y = Math.random() * canvas.height;
        }

    });
    //Comment weeee 
    comets.forEach((comet, index) => {
        drawComet(comet);
        comet.x += 1
        comet.y += 1
        if (comet.x > canvas.width + 100 || comet.y > canvas.height + 100) {
            comet.x = Math.random() * canvas.width;
            comet.y = 0;
        }
   });
   
   if(isDarkTheme){
    constellation()
    requestAnimationFrame(animatingStar);
    }
   
}
animatingStar();

function constellation(){
    const stars = [
        { x: 220, y: 280 },//corner one
        { x: 220, y: 200 }, 
        { x: 260, y: 220 }, 
        { x: 260, y: 260 }, //corner tail
        { x: 220, y: 280 }, 
        { x: 180, y: 300 }, 
        { x: 140, y: 320 }, 
        { x: 100, y: 330 }, 
    ];
    for(let i=0;i<stars.length;i++){
        const star = stars[i];
        ctx.beginPath();
        ctx.arc(star.x , star.y, 2, 0, Math.PI * 2); // radius = 2
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1;

    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        i === 0 ? ctx.moveTo(star.x, star.y) : ctx.lineTo(star.x, star.y);
    }
    ctx.stroke();
    }
}

async function CanvasClean() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
    await delay(100);
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
}



