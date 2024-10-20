function openNextwindow() {
    const windowsContainer = document.querySelector('.window');
    windowsContainer.style.transform = 'translateX(-50%)';
}

function openNextwindow() {
    const windowsContainer = document.querySelector('.next-window'); // Seleccionamos la ventana siguiente
    const windowsContainerMain = document.querySelector('.window'); // Seleccionamos el contenedor principal

    // Cambiar a la siguiente ventana
    windowsContainerMain.style.transform = 'translateX(-50%)'; // Mueve el contenedor principal a la izquierda
    // Cambia la visibilidad de .next-window
    // windowsContainer.classList.add('visible'); // Añade la clase para hacerla visible aun en beta
}

// Si quieres que al cargar la página no se muestre la siguiente ventana, asegúrate de que el HTML esté configurado correctamente
document.addEventListener('DOMContentLoaded', function() {
    const nextWindow = document.querySelector('.next-window');
    nextWindow.classList.remove('visible'); // Asegúrate de que esté inicialmente oculta
});
