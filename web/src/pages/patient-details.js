import { getPatientById } from "../services/patient";

/**
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Patient's email
 * @property {string} nationalId - Patient's national ID
 * @property {boolean} discharged - Patient's discharge status
 */

export default function PatientDetailsPage(page, patientId) {
  const patient = getPatientById(patientId);

  const title = document.createElement('h1');
  title.textContent = patient.name;
  page.appendChild(title);

  const email = document.createElement('p');
  email.textContent = patient.email;
  page.appendChild(email);

  const nationalId = document.createElement('p');
  nationalId.textContent = patient.nationalId;
  page.appendChild(nationalId);

  const discharged = document.createElement('p');
  discharged.textContent = patient.discharged ? 'Dado de alta' : 'Admitido';
  page.appendChild(discharged);

}