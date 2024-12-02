import { fetchApi } from "../utils/fetchs";

/**
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Patient's email
 * @property {string} nationalId - Patient's national ID
 * @property {boolean} discharged - Patient's discharge status
 */

const endpoint = 'patients';

export async function getAllPatients() {
    const res = await fetchApi(endpoint);
    if (!res.ok)
        throw new Error('UNKNOWN_ERROR');
    const patients = await res.json();

    return patients;
}

/**
 * Get a patient by ID
 * @returns {Promise<Patient>}
 * @throws {Error} - PATIENT_NOT_FOUND, UNKNOWN_ERROR
 */
export async function getPatientById(id) {
    const res = await fetchApi(endpoint + `/${id}`);
    if (res.status === 404) {
        throw new Error('PATIENT_NOT_FOUND');
    } else if (!res.ok) {
        throw new Error('UNKNOWN_ERROR');
    }

    return await res.json();
}

/**
 * Get a patient by username
 * @param {string} username - Patient's username, either email or national ID
 * @returns {Promise<Patient>} - Patient data
 * @throws {Error} - PATIENT_NOT_FOUND, UNKNOWN_ERROR
 */
export async function getPatientByUsername(username) {
    const res = await fetchApi(endpoint + `?username=${username}`);
    if (res.status === 404) {
        throw new Error('PATIENT_NOT_FOUND');
    } else if (res.status === 400) {
        const reason = await res.json();
        throw new Error(reason);
    } else if (!res.ok) {
        throw new Error('UNKNOWN_ERROR');
    }

    return await res.json();
}

/**
 * Register a new patient
 * @param {Object} patient - Patient registration data
 * @param {string} patient.name - Patient's full name
 * @param {string} patient.email - Patient's email
 * @param {string} patient.nationalId - Patient's national ID
 * @returns {Promise<void>}
 * @throws {Error} - EMAIL_ALREADY_EXISTS, NATIONAL_ID_ALREADY_EXISTS, INVALID_EMAIL, INVALID_NATIONAL_ID, UNKNOWN_ERROR
 */
export async function addPatient(patient) {
    const res = await fetchApi(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: patient.name.trim(),
            email: patient.email.trim(),
            nationalId: patient.nationalId.trim(),
        }),
        skipRefresh: true
    });

    // Patient already exists, possible errors: EMAIL_ALREADY_EXISTS, NATIONAL_ID_ALREADY_EXISTS
    if (res.status === 409) {
        const error = await res.json();
        throw new Error(error);
        // Some data was wrong, possible errors: INVALID_EMAIL, INVALID_NATIONAL_ID
    } else if (res.status === 400) {
        const error = await res.json();
        throw new Error(error);
    } else if (!res.ok) {
        throw new Error('UNKNOWN_ERROR');
    }
}