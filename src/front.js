const wrapper = document.querySelector('.advantages-wrapper');
const circle = document.querySelector('.advantages-block-item');
const texts = document.querySelectorAll('.advantages-block-item-text');
const star = document.querySelector('.advantages-block-star');

wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Наклон
    circle.style.transform = `rotateX(${(y * -25).toFixed(2)}deg) rotateY(${(x * 25).toFixed(2)}deg)`;

    // Блик
    circle.style.setProperty('--mouse-x', `${(e.clientX - rect.left) / rect.width * 100}%`);
    circle.style.setProperty('--mouse-y', `${(e.clientY - rect.top) / rect.height * 100}%`);

    // Четкая тень для текста
    const tx = (x * -10).toFixed(1);
    const ty = (y * -10).toFixed(1);
    const textShadowStyle = `${tx}px ${ty}px 5px rgba(0,0,0,0.2)`;
    
    texts.forEach(t => {
        t.style.textShadow = textShadowStyle;
    });

    // Тень для звезды (ей можно оставить drop-shadow, она не текст)
    star.style.filter = `drop-shadow(${(x * -20).toFixed(1)}px ${(y * -20).toFixed(1)}px 10px rgba(0,0,0,0.3))`;
});

wrapper.addEventListener('mouseleave', () => {
    circle.style.transform = `rotateX(0deg) rotateY(0deg)`;
    texts.forEach(t => t.style.textShadow = 'none');
    star.style.filter = 'none';
});
