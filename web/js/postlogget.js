 // URL del endpoint del back-end
 const apiUrl = 'http://localhost:8080/tests';  // URL local del back-end

 // Función para obtener los datos desde el back-end
async function fetchTests() {
        try {
         const response = await fetch(apiUrl);  // Petición GET a /tests
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
         const tests = await response.json();  // Convertir la respuesta a JSON
         displayTests(tests);  // Llamar a la función para renderizar los datos
    } catch (error) {
        console.error(error);
    }
}

 // Renderizar los tests en el DOM
function displayTests(tests) {
    const listElement = document.getElementById('tests-list');
    tests.forEach(test => {
        const listItem = document.createElement('li');
        listItem.textContent = `Test ID: ${test.id}, Nombre: ${test.nombre}`;
        listElement.appendChild(listItem);
    });
}

 // Llamar a la función cuando la página cargue
fetchTests();