import Router, { routes } from './utils/router.js'
import './components/components.js'

import './styles/main.css'

document.querySelector('#app').innerHTML = `
  <div>
    <div id="page"></div>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  // Initialize router
  window.router = new Router(routes);

  // Initial navigation
  const initialPath = window.location.pathname + window.location.search;
  window.router.navigate(initialPath);
});