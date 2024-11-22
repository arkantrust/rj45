export default class ProfilePage extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    const message = document.createElement("h1");
    message.setAttribute("class", "centered");
    message.textContent = 'Bienvenido a S.T.A.R!';

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    console.log(style.isConnected);

    style.textContent = `
      .centered {
        display: block;
        align-content: center;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(message);
  }
}