import { fetchApi } from "../utils/fetchs";

const endpoint = '/patients';

export async function getPatient(id) {
    try {
        const res = await fetchApi(endpoint + `/${id}`);
        if (!res.ok) {
            throw new Error('Error al obtener el paciente');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getPatients() {
    try {
        const res = await fetchApi(endpoint);
        if (!res.ok) {
            throw new Error('Error al obtener los pacientes');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}