import Chart from 'chart.js/auto';
import { getTest, addComment, getComments } from '../services/test.js';
import { fetchAnalytics } from '../utils/fetchs.js';
import '../styles/test-details.scss';

export default async function TestDetailsPage(page, testId) {
  const test = await getTest(testId);

  const container = document.createElement('div');

  const title = document.createElement('h1');
  title.textContent = 'Test Details';
  container.appendChild(title);

  const commentsContainer = document.createElement('div');
  commentsContainer.className = 'comments-container';
  commentsContainer.innerHTML = `
  <h2>Comments</h2>

  <button id="addComment">Add Comment</button>

  <ul id="comments">
    <li id="emptyState">No comments yet.</li>
  </ul>

  <dialog id="addCommentFormDialog">
    <form id="addCommentForm">
      <h2>Add a Comment</h2>
      <label for="comment">
        Comment:
        <input type="text" id="comment" name="comment" placeholder="The patient..." />
      </label>
      <div class="dialog-buttons">
        <button type="submit">Add</button>
        <button type="button" id="cancelDialog">Cancel</button>
      </div>
    </form>
  </dialog>
  `;

  container.appendChild(commentsContainer);

  page.appendChild(container);

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
    noDataMessage.textContent = 'This test has no data yet';
    page.appendChild(noDataMessage);
    return;
  } else {
    await renderCharts(container, test);
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
    emptyItem.textContent = 'No comments yet.';
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

async function renderCharts(container, test) {
  const accelerometer = test.measurements.map(m => ({
    x: m.accel.x,
    y: m.accel.y,
    z: m.accel.z,
    timestamp: m.timestamp
  }));

  const res = await fetchAnalytics('/analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      accelerometer
    })
  });

  const analytics = await res.json();

  console.log(analytics);

  // Define chart configurations
  const chartConfigs = [
    {
      id: 'accelXChart',
      label: 'X Acceleration',
      data: test.measurements.map(m => m.accel.x),
      type: 'line'
    },
    {
      id: 'accelYChart',
      label: 'Y Acceleration',
      data: test.measurements.map(m => m.accel.y),
      type: 'line'
    },
    {
      id: 'accelZChart',
      label: 'Z Acceleration',
      data: test.measurements.map(m => m.accel.z),
      type: 'line'
    },
    {
      id: 'gyroXChart',
      label: 'X Gyroscope',
      data: test.measurements.map(m => m.gyro.x),
      type: 'line'
    },
    {
      id: 'gyroYChart',
      label: 'Y Gyroscope',
      data: test.measurements.map(m => m.gyro.y),
      type: 'line'
    },
    {
      id: 'gyroZChart',
      label: 'Z Gyroscope',
      data: test.measurements.map(m => m.gyro.z),
      type: 'line'
    },
    {
      id: 'fftChart',
      label: 'FFT Magnitude',
      data: analytics.fft.magnitudes,
      labels: analytics.fft.frequencies,
      type: 'line',
      xAxisLabel: 'Frequency (Hz)',
      yAxisLabel: 'Magnitude'
    },
    {
      id: 'autocorrelationChart',
      label: 'Autocorrelation',
      data: analytics.autocorrelation.values,
      labels: analytics.autocorrelation.lags,
      type: 'line',
      xAxisLabel: 'Lag',
      yAxisLabel: 'Autocorrelation'
    }
  ];

  const chartWrapper = document.createElement('div');
  chartWrapper.className = 'chart-wrapper';

  // Create chart containers
  chartConfigs.forEach(config => {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('height', '200');
    canvas.id = config.id;
    chartContainer.appendChild(canvas);
    chartWrapper.appendChild(chartContainer);
  });

  container.appendChild(chartWrapper);

  // Create time labels for sensor data charts
  const timeLabels = test.measurements.map(m => m.timestamp);

  // Render each chart
  chartConfigs.forEach(config => {
    createChart(config.id, config.label, config.data,
      config.type === 'line' || config.type === 'bar' ? (config.labels || timeLabels) : null,
      config.type,
      config.xAxisLabel,
      config.yAxisLabel
    );
  });

  // Create indicators section
  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'indicators-container';
  indicatorsContainer.innerHTML = `
    <h3>Signal Indicators</h3>
    <ul>
      <li>Total Energy: ${analytics.indicators.total_energy.toFixed(2)}</li>
      <li>Min Frequency: ${analytics.indicators.min_frequency.toFixed(2)} Hz</li>
      <li>Max Frequency: ${analytics.indicators.max_frequency.toFixed(2)} Hz</li>
    </ul>
  `;
  container.appendChild(indicatorsContainer);
}

// Function to create a chart
function createChart(id, label, data, labels, type = 'line', xAxisLabel = 'Time (s)', yAxisLabel = 'Value') {
  const ctx = document.getElementById(id).getContext('2d');
  new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: type === 'bar' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: type === 'line'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: context => `Value: ${context.raw}`
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xAxisLabel
          },
          ticks: {
            maxRotation: 45, // Rotación para etiquetas largas
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel
          }
        }
      }
    }
  });
}