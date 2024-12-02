// <!DOCTYPE html>
// <html lang="es">

// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Tests - RJ45</title>
//   <link rel="stylesheet" href="css/globals.css">
//   <link rel="stylesheet" href="css/tests.css">
//   <script type="module" src="js/tests.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.js" type="text/javascript"></script>
// </head>

// <body>
//   <header>
//     <nav>
//       <a href="/">RJ45</a>
//       <a href="/tests">Tests</a>
//       <a href="/login">Iniciar sesión</a>
//     </nav>
//   </header>
//   <!-- The form -->
//   <div class="form-popup" id="addTestForm">
//     <form class="form-container">
//       <h1>Nuevo test</h1>
//       <label for="type">Tipo de test:</label>
//       <select id="testType" name="type">
//         <option value="footing">Zapateo</option>
//         <option value="heeling">Taconeo</option>
//       </select>
//       <button type="submit" class="btn">Confirmar</button>
//       <button type="button" class="btn cancel" id="cancelTestButton">Close</button>
//     </form>
//   </div>
//   <div class="container">
//     <h1>Test Viewer</h1>
//     <div class="actions">
//       <input type="text" id="search-bar" placeholder="Search tests...">
//       <button id="search-btn">Search</button>
//       <button id="addTestButton">+</button>
//     </div>
//     <table id="tests-table">
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Type</th>
//           <th>Date</th>
//         </tr>
//       </thead>
//       <tbody>
//         <!-- Test data will be populated here by JavaScript -->
//       </tbody>
//     </table>
//   </div>
// </body>

// </html>