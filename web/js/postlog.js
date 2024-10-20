
let visible = false;

function openNextwindow() {
    const windowsContainer = document.querySelector('.next-window'); // Seleccionamos la ventana siguiente
    const windowsContainerMain = document.querySelector('.current-window'); // Seleccionamos el contenedor principal

    // Cambiar a la siguiente ventana
    windowsContainerMain.style.transform = 'translateX(0%)'; // Mueve el contenedor principal a la izquierda
    windowsContainer.classList.add('visible'); // Añade la clase para hacerla visible aun en beta

    toggleWindow()


}


function toggleWindow() {
    {
        const nextWindow = document.querySelector('.next-window');
        const currentWindow = document.querySelector('.current-window');

        if (visible) {
            nextWindow.classList.remove('visible');
            currentWindow.style.transform = 'translateX(50%)'; // Retorna a la posición inicial
        } else {
            
            nextWindow.classList.add('visible');
            currentWindow.style.transform = 'translateX(0%)'; // Mueve el contenedor principal
        }

        visible = !visible; // Alterna el estado de visibilidad
    }
}