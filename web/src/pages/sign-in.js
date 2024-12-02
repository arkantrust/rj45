import '../styles/sign-in.css';
import { signIn } from '../services/auth.js';

export default async function SignInPage(page) {
  // Crear la estructura HTML basada en tu diseño
  const background = document.createElement("div");
  background.setAttribute("id", "background");

  // Logo
  const logoContainer = document.createElement("div");
  logoContainer.setAttribute("class", "Logo");
  const logo = document.createElement("img");
  logo.setAttribute("src", "assets/Vector.png");
  logo.setAttribute("alt", "Texto alternativo");
  logoContainer.appendChild(logo);

  // Contenedor del título
  const topContainer = document.createElement("div");
  topContainer.setAttribute("class", "TopContainer");
  const title = document.createElement("h2");
  title.textContent = "SIGN IN TO STAR PROJECT";
  topContainer.appendChild(title);

  // Formulario de inicio de sesión
  const loginContainer = document.createElement("div");
  loginContainer.setAttribute("class", "loginContainer");
  const inputsContainer = document.createElement("div");
  inputsContainer.setAttribute("class", "inputsContainer");

  const form = document.createElement("form");

  // Campo de usuario
  const usernameLabel = document.createElement("label");
  usernameLabel.setAttribute("for", "username");
  usernameLabel.textContent = "Username or email address";
  const usernameInput = document.createElement("input");
  usernameInput.setAttribute("type", "text");
  usernameInput.setAttribute("id", "username");
  usernameInput.setAttribute("class", "inputs");
  usernameInput.setAttribute("name", "username");
  usernameInput.setAttribute("required", true);

  // Campo de contraseña
  const passwordLabel = document.createElement("label");
  passwordLabel.setAttribute("for", "password");
  passwordLabel.textContent = "Password";
  const passwordInput = document.createElement("input");
  passwordInput.setAttribute("type", "password");
  passwordInput.setAttribute("id", "password");
  passwordInput.setAttribute("class", "inputs");
  passwordInput.setAttribute("name", "password");
  passwordInput.setAttribute("required", true);

  // Botón de envío
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("class", "button"); // Aplicamos la clase CSS del botón
  submitButton.textContent = "Sign in";

  // Etiqueta para errores
  const errorLabel = document.createElement("label");
  errorLabel.setAttribute("class", "error-label");
  errorLabel.style.color = "red";
  errorLabel.style.display = "none";

  // Ensamblar el formulario
  form.appendChild(usernameLabel);
  form.appendChild(usernameInput);
  form.appendChild(passwordLabel);
  form.appendChild(passwordInput);
  form.appendChild(errorLabel);
  form.appendChild(submitButton);

  inputsContainer.appendChild(form);
  loginContainer.appendChild(inputsContainer);

  // Contenedor de enlaces para registro y otros enlaces
  const botContainer = document.createElement("div");
  botContainer.setAttribute("class", "BotContainer");
  const botText = document.createElement("h2");
  botText.textContent = "Have a referred link?";
  const registerLink = document.createElement("a");
  registerLink.setAttribute("href", "http://localhost:5173/sign-up");
  registerLink.textContent = "create an account";
  botContainer.appendChild(botText);
  botContainer.appendChild(registerLink);

  const dataWeb = document.createElement("div");
  dataWeb.setAttribute("class", "DataWeb");
  ["terms", "security", "about", "contact us"].forEach((text) => {
    const link = document.createElement("h5");
    link.textContent = text;
    dataWeb.appendChild(link);
  });

  // Agregar eventos de autenticación
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorLabel.style.display = "none";
    errorLabel.textContent = "";

    try {
      await signIn(username, password);
      window.router.navigate("/dashboard");
    } catch (error) {
      let errorMsg = "";
      if (error.code === "INVALID_EMAIL") {
        errorMsg = "Correo inválido";
      } else if (error.code === "INVALID_NATIONAL_ID") {
        errorMsg = "Cédula inválida";
      } else if (error.code === "USER_NOT_FOUND") {
        errorMsg = "Usuario no encontrado";
      } else if (error.code === "INVALID_PASSWORD") {
        errorMsg = "Contraseña incorrecta";
      } else {
        errorMsg = "Ocurrió un error inesperado";
      }
      errorLabel.textContent = errorMsg;
      errorLabel.style.display = "block";
    }
  });

  // Ensamblar toda la página
  background.appendChild(logoContainer);
  background.appendChild(topContainer);
  background.appendChild(loginContainer);
  background.appendChild(botContainer);
  background.appendChild(dataWeb);

  // Renderizar en el contenedor proporcionado
  page.replaceChildren(background);
}