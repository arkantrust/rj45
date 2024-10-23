import { getTests } from '../api/tests.js';

const testsTableBody = document.querySelector('#tests-table tbody');

// Populate table with test data
function populateTestsTable(tests) {
  testsTableBody.innerHTML = ''; // Clear previous data
  tests.forEach(test => {
    const row = document.createElement('tr');
    row.innerHTML = `
              <td>${test.id}</td>
              <td>${test.type}</td>
              <td>${new Date(test.createdAt).toLocaleDateString()}</td>
          `;
    row.addEventListener('click', () => {
      window.location.href = `/test/?id=${test.id}`;
    });
    testsTableBody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const tests = await getTests();
  populateTestsTable(tests);
});
