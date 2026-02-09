const bg = document.getElementById("bg");
let deg = 180;
let change = 0.01;

setInterval(()=>{
    deg = (deg+change)%360;
    bg.style.setProperty('--angle',`${deg}deg`);
},1);

function populate() {
    for (let j = 1; j <= 3; j++) {
        const container = document.getElementById(`top-searched-${j}`);
        for(let i = 1 ; i <= 16 ; i++) {
            let html = `
            <div class="card">
            <img src="Images/tmp/game_image${i}.jpg" alt="cover" />
            <div class="card-info">
                <p class="card-title">Sample Title ${i}</p>
            </div>
            `;
            container.innerHTML += html;
        }
    }
}

function spawnShuriken() {
  const shuriken = document.createElement('span');
  shuriken.className = 'shuriken';

  shuriken.textContent =
    shurikens[Math.floor(Math.random() * shurikens.length)];

  const size = Math.random() * 14 + 16;
  shuriken.style.fontSize = `${size}px`;

  shuriken.style.left = `${Math.random() * 100}vw`;
  shuriken.style.top = `${Math.random() * 100}vh`;

  const duration = Math.random() * 2 + 2;
  shuriken.style.animationDuration = `${duration}s`;

  document.body.appendChild(shuriken);

  shuriken.addEventListener('animationend', () => {
    shuriken.remove();
  });

  shuriken.addEventListener('click', (e) => {
    e.stopPropagation();
    shuriken.remove();
  });
}

setInterval(spawnShuriken, 400);

populate();

// const shurikens = ['✢','✣','✤','✥','✦','✧','✴','✵','✶','✷','✸'];
const shurikens = ['✢','✦','✧'];
