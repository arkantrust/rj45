import Chart from 'chart.js/auto';
import { getTest } from '../services/test.js';
import '../styles/tests.css';

export default async function TestDetailsPage(page, testId) {
  const container = document.createElement('div');
  page.appendChild(container);

  const title = document.createElement('h1');
  title.textContent = 'Test Analysis';
  container.appendChild(title);

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

  await renderCharts(testId);
}

async function renderCharts(testId) {
  const test = await getTest(testId);

  console.log(test);

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