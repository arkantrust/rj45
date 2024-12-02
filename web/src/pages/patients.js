import '../styles/patients.css';  // Estilo base para la página de pacientes
import { getAllPatients } from '../services/patient.js';

/**
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Patient's email
 * @property {string} nationalId - Patient's national ID
 * @property {boolean} discharged - Patient's discharge status
 */


export default async function PatientsPage(page) {
   // Crear la animación de carga
const loader = document.createElement('div');
loader.setAttribute('class', 'loader');
page.appendChild(loader);


    try {
        // Obtén la lista de pacientes
        const patients = await getAllPatients();

        loader.remove();
        // Crea el título de la página
        const title = document.createElement('h1');
        title.textContent = 'Patients';
        page.appendChild(title);

        // Crea la lista donde se mostrarán los pacientes
        const list = document.createElement('ul');
        page.appendChild(list);

        // Recorre la lista de pacientes y agrega cada uno como un <li>
        patients.forEach(patient => {
            const patientEl = document.createElement('li');
            patientEl.textContent = patient.name;
            list.appendChild(patientEl);
        });
    } catch (error) {
        loader.remove();
        console.error("Error al obtener los pacientes:", error);
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'No se pudieron cargar los pacientes. Inténtelo más tarde.';
        page.appendChild(errorMsg);
    }
}