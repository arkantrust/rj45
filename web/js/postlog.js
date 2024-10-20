
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
            nextWindow.style.zIndex = -1;
        } else {
            
            nextWindow.classList.add('visible');
            currentWindow.style.transform = 'translateX(0%)'; // Mueve el contenedor principal
            nextWindow.style.zIndex = 0;
        }

        visible = !visible; // Alterna el estado de visibilidad
    }
}

const tests = [
    {id: '2a303641-7708-40f0-9b50-f7e1e9a2a55e', type: 'footing', created_at: '2024-10-15 19:27:40', measurements: '{"gyro": {"x": 0.314, "y": 0.52, "z": 0.19}, "accel": {"x": 10.0, "y": 0.059, "z": 0.1}}'},
    {id: '65a6cb1-1988-4ee8-8e83-da1e454b0a9d', type: 'heeling', created_at: '2024-10-15 19:28:45', measurements: '{"gyro": {"x": 0.25, "y": 0.48, "z": 0.17}, "accel": {"x": 9.8, "y": -0.032, "z": 0.15}}'},
    {id: 'a232fb0d-1a9e-4a0f-a650-4e74a22508c2', type: 'footing', created_at: '2024-10-15 19:29:47', measurements: '{"gyro": {"x": 0.312, "y": 0.5, "z": 0.2}, "accel": {"x": 10.1, "y": 0.04, "z": 0.12}}'}
];

const container = document.getElementById('tests-container');

tests.forEach(test => {
    const div = document.createElement('div');
    div.className = 'test';
    div.innerHTML = ` ${test.created_at} <br>
                    <strong>Tipo:</strong> ${test.type}<br>
                    <span class="details"><strong>ID:</strong> ${test.id}<br>
                    <strong>Creado:</strong> ${test.created_at}<br>
                    <strong>Mediciones:</strong> ${test.measurements}</span>`;
    
    div.addEventListener('click', () => {
        const details = div.querySelector('.details');
        if (details.style.display === 'none' || details.style.display === '') {
            details.style.display = 'block';
        } else {
            details.style.display = 'none';
        }
    });

    container.appendChild(div);
});
