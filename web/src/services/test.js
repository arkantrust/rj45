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

export async function addComment(id, comment) {
    try {
        const res = await fetchApi(endpoint + `/${id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment })
            });
        if (!res.ok)
            throw new Error('Error al obtener el test');
        
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getComments(testId) {
    try {
        const res = await fetchApi(endpoint + `/${testId}/comments`);
        if (!res.ok)
            throw new Error('Error al obtener los tests');
        
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}
