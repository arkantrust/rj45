document.addEventListener('DOMContentLoaded', () => {
    console.log('¡JavaScript cargado y funcionando!');

    const images = [
        'url("../web/assets/enfermera.png")',
        'url("../web/assets/enfermera2.jpg")',
        'url("../web/assets/enfermera3.jpg")'
    ];
    let currentIndex = 0;
    const container = document.querySelector('.background-container');

    function changeBackground() {
        container.classList.add('background-fade-out');
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % images.length;
            container.style.backgroundImage = `linear-gradient(45deg, rgba(255, 255, 255, 0.8) 0%, rgba(60, 60, 60, 0.8) 100%), ${images[currentIndex]}`;
            container.style.filter = 'grayscale(100%)';  // Add grayscale filter here
            container.classList.remove('background-fade-out');
            console.log(`Background changed to: ${images[currentIndex]}`);
        }, 1000);
    }

    setInterval(changeBackground, 5000);
});
