
const apiUrl = 'http://localhost:8080/tests';

export async function getTest(id) {
    let test = {};
    try {
        const res = await fetch(apiUrl + `/${id}`);
        if (!res.ok) {
            throw new Error('Error al obtener los tests');
        }
        test = await res.json();
    } catch (error) {
        console.error(error);
    } finally {
        return test;
    }
}

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
