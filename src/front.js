document.addEventListener("DOMContentLoaded", function () {

const techSection = document.querySelector(".tech-section");

if (!techSection) return;

const circles = techSection.querySelectorAll(".tech-circle");

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {

    if (entry.isIntersecting) {
    techSection.classList.add("active");
    } else {
    techSection.classList.remove("active");
    }

});
}, {
threshold: 0.4
});
        
observer.observe(techSection);
});

const wrapper = document.querySelector('.advantages-wrapper');
const circle = document.querySelector('.advantages-block-item');
const texts = document.querySelectorAll('.advantages-block-item-text');
const star = document.querySelector('.advantages-block-star');

// 1. Единая функция для всех эффектов
function applyEffect(x, y) {
    circle.style.transform = `rotateX(${(y * -25).toFixed(2)}deg) rotateY(${(x * 25).toFixed(2)}deg)`;
    circle.style.setProperty('--mouse-x', `${(x + 0.5) * 100}%`);
    circle.style.setProperty('--mouse-y', `${(y + 0.5) * 100}%`);

    const tx = (x * -10).toFixed(1);
    const ty = (y * -10).toFixed(1);
    const textShadowStyle = `${tx}px ${ty}px 5px rgba(0,0,0,0.2)`;
    texts.forEach(t => t.style.textShadow = textShadowStyle);

    star.style.filter = `drop-shadow(${(x * -20).toFixed(1)}px ${(y * -20).toFixed(1)}px 10px rgba(0,0,0,0.3))`;
}

// 2. Логика для мышки (ПК)
wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    applyEffect(x, y);
});

wrapper.addEventListener('mouseleave', () => {
    circle.style.transform = `rotateX(0deg) rotateY(0deg)`;
    circle.style.setProperty('--mouse-x', '50%');
    circle.style.setProperty('--mouse-y', '50%');
    texts.forEach(t => t.style.textShadow = 'none');
    star.style.filter = 'none';
});

// 3. Логика для гироскопа (Мобилки)
function handleOrientation(event) {
    // Наклон влево-вправо (gamma) и вперед-назад (beta)
    let x = (event.gamma || 0) / 40; 
    let y = ((event.beta || 0) - 45) / 40; // -45 градусов — поправка под наклон рук

    x = Math.max(-0.6, Math.min(0.6, x));
    y = Math.max(-0.6, Math.min(0.6, y));

    applyEffect(x, y);
}

// 4. Авто-запуск гироскопа (Android сразу, iOS по клику)
if (typeof DeviceOrientationEvent !== 'undefined') {
    // Если это iPhone (требует разрешение)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.addEventListener('click', () => {
            DeviceOrientationEvent.requestPermission()
                .then(state => {
                    if (state === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                });
        }, { once: true });
    } else {
        // Если это Android (включаем СРАЗУ)
        window.addEventListener('deviceorientation', handleOrientation);
    }
}


const binaryTexts = document.querySelectorAll('.inviteapplication-block.left p, .inviteapplication-block.right p');

function glitchBinary() {
    binaryTexts.forEach(p => {
        let chars = p.innerText.split('');
        for (let i = 0; i < 30; i++) {
            let randomIndex = Math.floor(Math.random() * chars.length);
            
            if (chars[randomIndex] === '0') {
                chars[randomIndex] = '1';
            } else if (chars[randomIndex] === '1') {
                chars[randomIndex] = '0';
            }
        }
        
        p.innerText = chars.join('');
    });
}

setInterval(glitchBinary, 100);

const btn = document.querySelector('.header-nav-request.two');

btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
});

btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
});
