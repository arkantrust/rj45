
const apiUrl = 'http://localhost:8080/tests';

export async function getTests() {
    let tests = [];
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error('Error al obtener los tests');
        }
        tests = await res.json();
    } catch (error) {
        console.error(error);
    } finally {
        return tests;
    }
}

export async function addTest(test) {
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(test)
        });
        if (!res.ok) {
            throw new Error('Error al crear el test');
        }
        const newTest = await res.json();
        console.log('Test creado:', newTest);
    } catch (error) {
        console.error(error);
    }
}