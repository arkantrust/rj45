import { getTests } from '../api/tests.js';

const testsTableBody = document.querySelector('#tests-table tbody');

const startTestTopic = 'test/start';

const receiveStatusTopic = 'test/status';

function initMqtt() {
  const client = new Paho.MQTT.Client('broker.emqx.io', Number(8083), "rj45-web");

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

  return client;
}

document.getElementById("addTestButton").addEventListener('click', () => {
  document.getElementById("addTestForm").style.display = "block";
});

document.getElementById("cancelTestButton").addEventListener('click', () => {
  document.getElementById("addTestForm").style.display = "none";
});

// Populate table with test data
function populateTestsTable(tests) {
  testsTableBody.innerHTML = ''; // Clear previous data
  tests.forEach(test => {
    const row = document.createElement('tr');
    row.innerHTML = `
              <td>${test.id}</td>
              <td>${test.type}</td>
              <td>${test.createdAt / 10}</td>
          `;
    row.addEventListener('click', () => {
      window.location.href = `/test/?id=${test.id}`;
    });
    testsTableBody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const client = initMqtt();
  const tests = await getTests();
  populateTestsTable(tests);
  document.getElementById("addTestForm").addEventListener(
    'submit', (e) => {
      e.preventDefault();
      const type = document.getElementById("testType").value;
      const message = new Paho.MQTT.Message(type);
      message.destinationName = startTestTopic;
      client.send(message);
      console.log(type + " started");
      document.getElementById("addTestForm").style.display = "none";
    }
  );
});
