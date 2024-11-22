import '../styles/sign-in.css';
import { addPatient, getAllPatients } from '../services/patient.js';

/**
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Patient's email
 * @property {string} nationalId - Patient's national ID
 * @property {boolean} discharged - Patient's discharge status
 */

export default async function PatientsPage(page) {
    const patients = await getAllPatients();

    const title = document.createElement('h1');
    title.textContent = 'Patients';
    page.appendChild(title);

    const list = document.createElement('ul');
    page.appendChild(list);
    patients.forEach(patient => {
        const patientEl = document.createElement('li');
        patientEl.textContent = patient.name;
        list.appendChild(patientEl);
    });
}