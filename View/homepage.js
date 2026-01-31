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

const stars = ["★", "☆", "✦", "✧", "✩"];
const starBG = document.getElementById('star-bg');

function spawnStars() {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = stars[Math.floor(Math.random() * stars.length)];

    const size = Math.random() * 10 + 10;
    star.style.fontSize = `${size}px`;

    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;

    star.style.animationDuration = `${Math.random() * 2 + 2}s`;

    starBG.appendChild(star);

    star.addEventListener('animationend', () => {
        star.remove();
    });

    star.addEventListener('click', (e) => {
        e.stopPropagation();

        const popSound = new Audio(`SoundEffects/pop${Math.floor(Math.random() * 3 + 1)}.mp3`);
        popSound.volume = 0.2;

        popSound.currentTime = 0;
        popSound.play();

        star.remove();
    });
}

populate();
setInterval(spawnStars, 400);
