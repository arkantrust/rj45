import { fetchApi } from "../utils/fetchs";

const endpoint = '/tests';

export async function getTest(id) {
    try {
        const res = await fetchApi(endpoint + `/${id}`);
        if (!res.ok) {
            throw new Error('Error al obtener el test');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getTests() {
    try {
        const res = await fetchApi(endpoint);
        if (!res.ok) {
            throw new Error('Error al obtener los tests');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}
