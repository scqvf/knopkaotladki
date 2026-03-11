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

wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    circle.style.transform = `rotateX(${(y * -25).toFixed(2)}deg) rotateY(${(x * 25).toFixed(2)}deg)`;

    circle.style.setProperty('--mouse-x', `${(e.clientX - rect.left) / rect.width * 100}%`);
    circle.style.setProperty('--mouse-y', `${(e.clientY - rect.top) / rect.height * 100}%`);

    const tx = (x * -10).toFixed(1);
    const ty = (y * -10).toFixed(1);
    const textShadowStyle = `${tx}px ${ty}px 5px rgba(0,0,0,0.2)`;
    
    texts.forEach(t => {
        t.style.textShadow = textShadowStyle;
    });

    star.style.filter = `drop-shadow(${(x * -20).toFixed(1)}px ${(y * -20).toFixed(1)}px 10px rgba(0,0,0,0.3))`;
});

wrapper.addEventListener('mouseleave', () => {
    circle.style.transform = `rotateX(0deg) rotateY(0deg)`;
    texts.forEach(t => t.style.textShadow = 'none');
    star.style.filter = 'none';
});

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

// улсуги

const customSelect = document.querySelector('#service-select');
const trigger = customSelect.querySelector('.select-trigger');
const triggerText = trigger.querySelector('span');
const hiddenInput = document.getElementById('service-hidden');

trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    customSelect.classList.toggle('active');
});

customSelect.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function(e) {
        e.stopPropagation();
        const text = this.textContent;
        const value = this.dataset.value;
        triggerText.textContent = text;
        hiddenInput.value = value;
        customSelect.classList.add('is-selected'); 
        customSelect.classList.remove('active');
    });
});

document.addEventListener('click', () => {
    customSelect.classList.remove('active');
});

// контакты

    document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.question-block-up');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const parent = header.closest('.question-block-item');
            parent.classList.toggle('active');
            document.querySelectorAll('.question-block-item').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                }
            });
        });
    });
});

// работьы

    
const tabBtns = document.querySelectorAll('.tab-btn');

    function setActiveFirstCard() {
    wrappers.forEach(card => card.classList.remove('is-active'));

    const firstVisible = [...wrappers].find(card => !card.classList.contains('hidden'));

    if (firstVisible) {
        firstVisible.classList.add('is-active');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    setActiveFirstCard();
});

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            wrappers.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            const firstVisible = document.querySelector('.portfolio-card:not(.hidden)');
            if (firstVisible) {
                firstVisible.style.opacity = "1";
                firstVisible.style.filter = "blur(0px)";
                firstVisible.style.transform = "rotateX(0deg) scale(1)";
            }
             setActiveFirstCard();
            window.scrollBy(0, 1);
            window.scrollBy(0, -1);
        });
    });

    const wrappers = document.querySelectorAll('.portfolio-card');

    wrappers.forEach(wrapper => {
        const card = wrapper.querySelector('.card-content')
        const content = wrapper.querySelector('.card-info');
        const title = wrapper.querySelector('h2');

        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `rotateX(${(y * -30).toFixed(2)}deg) rotateY(${(x * 30).toFixed(2)}deg) scale(1.05)`;
            const tx = (x * 40).toFixed(1);
            const ty = (y * 40).toFixed(1);
            content.style.transform = `translateX(${tx}px) translateY(${ty}px) translateZ(150px)`;
            const sx = (x * -20).toFixed(1);
            const sy = (y * -20).toFixed(1);
            title.style.textShadow = `${sx}px ${sy}px 20px rgba(255,255,255,0.3), 0 0 40px rgba(0,0,0,0.5)`;

            card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
            card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
        });

        wrapper.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
            content.style.transform = `translateX(0) translateY(0) translateZ(150px)`;
            title.style.textShadow = 'none';
        });
    });