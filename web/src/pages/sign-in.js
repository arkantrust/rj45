import '../styles/sign-in.css';
import { signIn } from '../services/auth.js';

export default async function SignInPage(page) {
  const usernameField = document.createElement('form-input');
  usernameField.setAttribute('label', 'Usuario');
  usernameField.setAttribute('required', true);
  usernameField.setAttribute('type', 'text');
  usernameField.validate();

  const passwordField = document.createElement('form-input');
  passwordField.setAttribute('label', 'Contraseña');
  passwordField.setAttribute('required', true);
  passwordField.setAttribute('type', 'password');
  passwordField.validate();

  const errorLabel = document.createElement("label");
  errorLabel.setAttribute("class", "error");
  errorLabel.style.display = 'hidden';

  const submit = document.createElement("button");
  submit.setAttribute("type", "submit");
  submit.textContent = 'Iniciar Sesión';

  const form = document.createElement("form");
  form.appendChild(usernameField);
  form.appendChild(passwordField);
  form.appendChild(errorLabel);
  form.appendChild(submit);

  const title = document.createElement("h2");
  title.textContent = 'Iniciar Sesión';

  const formContainer = document.createElement("div");
  formContainer.setAttribute("class", "login-container");
  formContainer.appendChild(title);
  formContainer.appendChild(form);

  page.setAttribute("class", "background-container");
  page.appendChild(formContainer);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = usernameField.value;
    const password = passwordField.value;
    try {
      await signIn(username, password);
      window.router.navigate('/dashboard');
    } catch (error) {
      let errorMsg = '';
      if (error.code === 'INVALID_EMAIL') {
        errorMsg = 'Correo inválido';
      } else if (error.code === 'INVALID_NATIONAL_ID') {
        errorMsg = 'Cédula inválida';
      } else if (error.code === 'USER_NOT_FOUND') {
        errorMsg = 'Usuario no encontrado';
      } else if (error.code === 'INVALID_PASSWORD') {
        errorMsg = 'Contraseña incorrecta';
      } else {
        errorMsg = 'Ocurrió un error inesperado';
      }
      errorLabel.style.display = 'block';
      errorLabel.textContent = errorMsg;
    }
  });
}