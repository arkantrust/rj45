import '../styles/patient-details.css';
import { getPatientById } from "../services/patient";
import { getTest } from "../services/test";

/**
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Patient's email
 * @property {string} nationalId - Patient's national ID
 * @property {boolean} discharged - Patient's discharge status
*/

export default async function PatientDetailsPage(page, patientId) {
  const patient = await getPatientById(patientId);

  // const addTestForm = `
  // <div class="form-popup" id="addTestForm">
  //   <form class="form-container">
  //     <h1>Nuevo test</h1>
  //     <label for="type">Tipo de test:</label>
  //     <select id="testType" name="type">
  //       <option value="footing">Zapateo</option>
  //       <option value="heeling">Taconeo</option>
  //     </select>
  //     <button type="submit" class="btn">Confirmar</button>
  //     <button type="button" class="btn cancel" id="cancelTestButton">Close</button>
  //   </form>
  // </div>
  //   `;
  // page.appendChild(addTestForm);

  // addTestButton.addEventListener('click', () => {
  //   document.getElementById("addTestForm").style.display = "block";
  // });

  // document.getElementById("cancelTestButton").addEventListener('click', () => {
  //   document.getElementById("addTestForm").style.display = "none";
  // });

  const title = document.createElement('h1');
  title.textContent = patient.name;
  page.appendChild(title);

  const email = document.createElement('p');
  email.textContent = `Email: ${patient.email}`;
  page.appendChild(email);

  const nationalId = document.createElement('p');
  nationalId.textContent = `Documento: ${patient.nationalId}`;
  page.appendChild(nationalId);

  const discharged = document.createElement('p');
  discharged.textContent = patient.discharged ? 'Dado de alta' : 'Admitido';
  page.appendChild(discharged);

  const addTestButton = document.createElement('div');
  page.appendChild(addTestButton);

  const testsTitle = document.createElement('h2');
  testsTitle.textContent = 'Tests';
  page.appendChild(testsTitle);

  const tests = await renderTests(patient.tests);
  page.appendChild(tests);
}

async function renderTests(testIds) {
  const tests = [];
  for (const id of testIds) {
    const test = await getTest(id);
    tests.push(test);
  }

  const testsContainer = document.createElement('div');
  testsContainer.classList.add('tests-container');

  const testsTable = document.createElement('table');
  testsTable.setAttribute('id', 'testsTable');

  testsTable.innerHTML = `
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <!-- Test data will be populated here by JavaScript -->
      </tbody>`;

  testsContainer.appendChild(testsTable);

  const tableBody = testsTable.querySelector('tbody');

  tests.forEach(test => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatType(test.type)}</td>
      <td>${test.timestamp * 1000}</td>
    `;
    row.addEventListener('click', () => {
      window.location.href = `/tests/${test.id}`;
    });
    tableBody.appendChild(row);
  });

  return testsContainer;
}

function formatType(type) {
  return type === 'footing' ? 'Zapateo' : 'Taconeo';
}

const startTestTopic = 'test/start';
const receiveStatusTopic = 'test/status'
// function initMqtt() {
//   const client = new Paho.MQTT.Client('broker.emqx.io', Number(8083), "rj45-web");
//   // Message listener
//   client.onMessageArrived = function (msg) {
//     console.log("Arrived!: " + msg.payloadString);
//   }

//   // Connect to the MQTT broker
//   client.connect({
//     onSuccess: function () {
//       client.subscribe(receiveStatusTopic);
//       console.log("conectado!")
//     }
//   });

//   return client;
// }

// document.addEventListener('DOMContentLoaded', async () => {
//   const client = initMqtt();
//   document.getElementById("addTestForm").addEventListener(
//     'submit', (e) => {
//       e.preventDefault();
//       const test = document.getElementById("testType").value;
//       const message = new Paho.MQTT.Message(type);
//       message.destinationName = startTestTopic;
//       client.send(message);
//       console.log(type + " started");
//       document.getElementById("addTestForm").style.display = "none";
//     }
//   );
// });