import Chart from 'chart.js/auto';
import { getTest, addComment, getComments } from '../services/test.js';
import '../styles/tests.css';

export default async function TestDetailsPage(page, testId) {
  const test = await getTest(testId);

  const container = document.createElement('div');
  page.appendChild(container);

  const title = document.createElement('h1');
  title.textContent = 'Test';
  container.appendChild(title);

  const commentsContainer = document.createElement('div');
  commentsContainer.className = 'comments-container';
  commentsContainer.innerHTML = `
  <h2>Comentarios</h2>

  <button id="addComment">Añadir comentario</button>

  <ul id="comments">
    <li id="emptyState">No hay comentarios aún.</li>
  </ul>

  <dialog id="addCommentFormDialog">
    <form id="addCommentForm">
      <h2>Añadir un comentario</h2>
      <label for="comment">
        Comentario:
        <input type="text" id="comment" name="comment" placeholder="El paciente..." />
      </label>
      <div class="dialog-buttons">
        <button type="submit">Añadir</button>
        <button type="button" id="cancelDialog">Cancelar</button>
      </div>
    </form>
  </dialog>
  `;
  container.appendChild(commentsContainer);

  const dialog = document.getElementById('addCommentFormDialog');

  const openDialog = document.getElementById('addComment');
  openDialog.addEventListener('click', () => {
    dialog.showModal();
  });

  const cancelDialog = document.getElementById('cancelDialog');
  cancelDialog.addEventListener('click', () => {
    dialog.close();
  });

  const form = document.getElementById('addCommentForm');
  // Handle form submission
  form.addEventListener('submit', e => {
    e.preventDefault(); // Prevent page reload
    const content = document.getElementById('comment').value.trim();
    if (content) {
      addComment(testId, content); // Update the server
      renderComments(testId); // Update the UI
      form.reset(); // Clear the input field
      dialog.close(); // Close the dialog
    }
  });

  renderComments(testId);

  if (test.measurements.length === 0) {
    const noDataMessage = document.createElement('p');
    noDataMessage.textContent = 'Este test no tiene datos aún';
    page.appendChild(noDataMessage);
    return;
  } else {
    await renderCharts(test);
  }
}

async function renderComments(testId) {
  const commentObjects = await getComments(testId);
  const comments = commentObjects.map(c => c.content);
  const commentList = document.getElementById('comments');
  commentList.innerHTML = ''; // Clear list

  if (comments.length === 0) {
    // Show empty state if no comments
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No hay comentarios aún.';
    emptyItem.className = 'empty';
    commentList.appendChild(emptyItem);
    return;
  }

  comments.forEach((c, index) => {
    const comment = document.createElement('li');
    comment.textContent = c;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      comments.splice(index, 1); // Remove the clicked comment
      renderComments(testId); // Re-render the list
    });

    comment.appendChild(deleteBtn); // Add delete button to the comment
    commentList.appendChild(comment); // Add comment to the list
  });
}

async function renderCharts(test) {

  const charts = ['accelXChart', 'accelYChart', 'accelZChart', 'gyroXChart', 'gyroYChart', 'gyroZChart'];
  charts.forEach(chart => {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('height', '200');
    canvas.id = chart;
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);
  });

  // Extract data for each axis
  const accelXData = test.measurements.map(m => m.accel.x);
  const accelYData = test.measurements.map(m => m.accel.y);
  const accelZData = test.measurements.map(m => m.accel.z);
  const gyroXData = test.measurements.map(m => m.gyro.x);
  const gyroYData = test.measurements.map(m => m.gyro.y);
  const gyroZData = test.measurements.map(m => m.gyro.z);

  // TODO: Use actual frequency from the test data
  // Prepare time axis assuming 10Hz frequency (0.1s intervals)
  const timeLabels = test.measurements.map((_, index) => (index * 0.1).toFixed(1)); // e.g., [0.0, 0.1, 0.2, ...]

  // Create charts for each data set
  createChart('accelXChart', 'X Acceleration', accelXData, timeLabels);
  createChart('accelYChart', 'Y Acceleration', accelYData, timeLabels);
  createChart('accelZChart', 'Z Acceleration', accelZData, timeLabels);
  createChart('gyroXChart', 'X Gyroscope', gyroXData, timeLabels);
  createChart('gyroYChart', 'Y Gyroscope', gyroYData, timeLabels);
  createChart('gyroZChart', 'Z Gyroscope', gyroZData, timeLabels);
};


// Function to create a chart
function createChart(id, label, data, timeLabels) {
  const ctx = document.getElementById(id).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: label,
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (s)'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });
}