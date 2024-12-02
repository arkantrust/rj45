import '../styles/patients.css';  // Estilo base para la página de pacientes
import { getAllPatients, addPatient } from '../services/patient.js';

/**
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Patient's email
 * @property {string} nationalId - Patient's national ID
 * @property {boolean} discharged - Patient's discharge status
 */


export default async function PatientsPage(page) {
    const loader = document.createElement('div');
    loader.setAttribute('class', 'loader');
    page.appendChild(loader);

    try {
        const patients = await getAllPatients();

        loader.remove();
        renderPatients(page, patients);

        document.getElementById('addPatientButton').addEventListener('click', () => {
            document.getElementById('addPatientDialog').showModal();
        });

        document.getElementById('cancelDialog').addEventListener('click', () => {
            document.getElementById('addPatientDialog').close();
        });

        const form = document.getElementById('addPatientForm');
        form.addEventListener('submit', async e => {
            e.preventDefault(); // Prevent page reload
            const name = document.getElementById('patientName').value.trim();
            const email = document.getElementById('patientEmail').value.trim();
            const nationalId = document.getElementById('patientNationalId').value.trim();
            if (name && email && nationalId) {
                try {
                    const p = await addPatient({name, email, nationalId}); // Update the server
                    patients.push(p);
                    renderPatients(page, patients);
                } catch (e) {
                    console.log(e);
                }
                form.reset(); // Clear the input field
                document.getElementById('addPatientDialog').close(); // Close the dialog
            }
        });
    } catch (error) {
        console.error("Error al obtener los pacientes:", error);
        loader.remove();
        loadError(page);
    }
}

function loadError(page) {
    console.error("Error al obtener los pacientes:", error);
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'No se pudieron cargar los pacientes. Inténtelo más tarde.';
    page.appendChild(errorMsg);
}

function renderPatients(page, patients) {

    const title = document.createElement('h1');
    title.textContent = 'Patients';
    page.appendChild(title);

    const addPatientButton = document.createElement('button');
    addPatientButton.textContent = 'Añadir paciente';
    addPatientButton.setAttribute('id', 'addPatientButton');
    page.appendChild(addPatientButton);
  
    const addPatientDialog = document.createElement('dialog');
    addPatientDialog.setAttribute('id', 'addPatientDialog');
    addPatientDialog.innerHTML = `
      <form id="addPatientForm">
        <h2>Añadir un paciente</h2>
        <label for="patientName">
          Nombre:
          <input type="text" id="patientName" name="patientName" placeholder="Nombre" />
        </label>
        <label for="patientEmail">
            Email:
            <input type="email" id="patientEmail" name="patientEmail" placeholder="Email" />
        </label>
        <label for="patientNationalId">
            Documento:
            <input type="text" id="patientNationalId" name="patientNationalId" placeholder="Documento de identidad" />
        </label>
        <div class="dialog-buttons">
          <button type="submit">Añadir</button>
          <button type="button" id="cancelDialog">Cancelar</button>
        </div>
      </form>`;
    page.appendChild(addPatientDialog);

    // Crea la lista donde se mostrarán los pacientes
    const list = document.createElement('ul');
    page.appendChild(list);

    // Recorre la lista de pacientes y agrega cada uno como un <li>
    patients.forEach(patient => {
        console.log(patient);
        const patientContainer = document.createElement('li');
        const patientEl = document.createElement('a');
        patientEl.textContent = patient.name;
        patientEl.href = `/patients/${patient.id}`;
        patientContainer.appendChild(patientEl);
        list.appendChild(patientContainer);
    });
}