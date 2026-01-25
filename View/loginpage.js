
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");  
ctx.fillStyle = "red";
ctx.fillRect(50, 50, 150, 150);


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
    length: Math.random() * 120 + 60,
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
        visible:true
    });
    
}
function drawComet(comet) {
  // comet tail
  ctx.beginPath();
  ctx.moveTo(comet.x, comet.y);
  ctx.lineTo(comet.x - comet.length, comet.y - comet.length);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.stroke();

  // comet head
  ctx.beginPath();
  ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  // comet glow (optional)
  ctx.beginPath();
  ctx.arc(comet.x, comet.y, comet.size * (Math.random() +3), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fill();
}

function animatingStar(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
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

    requestAnimationFrame(animatingStar);
}

animatingStar();