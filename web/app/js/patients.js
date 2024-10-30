document.addEventListener('DOMContentLoaded', async () => {
  const testsTableBody = document.querySelector('#tests-table tbody');

  // Fetch test data from the API
  async function fetchTests() {
    try {
      const response = await fetch('https://rj45.ddulce.app/api/tests');
      const data = await response.json();
      populateTestsTable(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  }

  // Populate table with test data
  function populateTestsTable(tests) {
    testsTableBody.innerHTML = ''; // Clear previous data
    tests.forEach(test => {
      const row = document.createElement('tr');
      row.innerHTML = `
              <td>${test.id}</td>
              <td>${test.type}</td>
              <td>${new Date(test.timestamp).toLocaleDateString()}</td>
          `;
      row.addEventListener('click', () => {
        window.location.href = `/tests/${test.id}`;
      });
      testsTableBody.appendChild(row);
    });
  }

  // Initialize data
  fetchTests();
});
