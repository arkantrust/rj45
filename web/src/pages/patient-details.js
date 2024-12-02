import '../styles/patient-details.css';
import { getPatientById } from "../services/patient";
import { getTest, addTest } from "../services/test";
// import mqtt from 'mqtt';

/**
 * @typedef {Object} Patient
 * @property {number} id - Patient ID
 * @property {string} name - Patient's full name
 * @property {string} email - Patient's email
 * @property {string} nationalId - Patient's national ID
 * @property {boolean} discharged - Patient's discharge status
*/

const startTestTopic = 'test/start';
const receiveStatusTopic = 'test/status';

export default async function PatientDetailsPage(page, patientId) {
  const patient = await getPatientById(patientId);

  const mqttClient = initMqtt();

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

  const tests = await renderTests(patient);
  page.appendChild(tests);

  document.getElementById('addTestButton').addEventListener('click', () => {
    document.getElementById('addTestDialog').showModal();
  });

  document.getElementById('cancelDialog').addEventListener('click', () => {
    document.getElementById('addTestDialog').close();
  });

  const form = document.getElementById('addTestForm');
  form.addEventListener('submit', async e => {
    e.preventDefault(); // Prevent page reload
    const type = document.getElementById('testType').value.trim();
    if (type) {
      try {
        const test = await addTest(patient, type); // Update the server
        addMeasurements(mqttClient, test.id);
      } catch (e) {
        console.log(e);
      }
      form.reset(); // Clear the input field
      document.getElementById('addTestDialog').close(); // Close the dialog
    }
  });
}

async function renderTests(patient) {
  const tests = [];
  const testIds = patient.tests;
  for (const id of testIds) {
    const test = await getTest(id);
    tests.push(test);
  }

  const testsContainer = document.createElement('div');
  testsContainer.classList.add('tests-container');

  const testsTitle = document.createElement('h2');
  testsTitle.textContent = 'Pruebas';
  testsContainer.appendChild(testsTitle);

  const addTestButton = document.createElement('button');
  addTestButton.textContent = 'Añadir prueba';
  addTestButton.setAttribute('id', 'addTestButton');
  testsContainer.appendChild(addTestButton);

  const addTestDialog = document.createElement('dialog');
  addTestDialog.setAttribute('id', 'addTestDialog');
  addTestDialog.innerHTML = `
    <form id="addTestForm">
      <h2>Añadir una prueba</h2>
      <select id="testType" name="testType" required>
            <option value="" disabled selected>Tipo de prueba</option>
            <option value="footing">Zapateo</option>
            <option value="heeling">Taconeo</option>
      </select>
      <div class="dialog-buttons">
        <button type="submit">Añadir</button>
        <button type="button" id="cancelDialog">Cancelar</button>
      </div>
    </form>`;
  testsContainer.appendChild(addTestDialog);

  const testsTable = document.createElement('table');
  testsTable.setAttribute('id', 'testsTable');

  testsTable.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
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
      <td>${test.id}</td>
      <td>${formatType(test.type)}</td>
      <td>${new Date(test.timestamp * 1000).toLocaleString()}</td>
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

function initMqtt() {
  const client = new Paho.MQTT.Client('broker.emqx.io', Number(8083), "star-web"); // current implementation

  // Message listener
  client.onMessageArrived = function (msg) {
    console.log("Arrived!: " + msg.payloadString);
  }

  // Connect to the MQTT broker
  client.connect({
    onSuccess: function () {
      client.subscribe(receiveStatusTopic);
      console.log("conectado!")
    }
  });

  // new implementation
  // const client = mqtt.connect("ws://broker.emqx.io", {
  //   host: "broker.emqx.io",
  //   port: 8083,
  //   username: "star-web",
  // });

  // client.on("connect", () => {
  //   client.subscribe(receiveStatusTopic, (err) => {
  //     if (!err)
  //       console.log("Subscribed to " + receiveStatusTopic);
  //   });
  // });

  return client;
}

function addMeasurements(mqttClient, testId) {
  const message = new Paho.MQTT.Message(testId);
  message.destinationName = startTestTopic;
  mqttClient.send(message);
  // const message = new mqttClient.publish(startTestTopic, testId, null, (err, packet) => {
  //   console.log("confirmation received")
  //   // history.go(0); // refreshes the page
  // });
  console.log("Test started for test ID: " + testId);
}
