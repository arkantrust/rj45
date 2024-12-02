// import '../styles/sign-up.css';
import { signUp } from '../services/auth.js';

export default async function SignUpPage(page) {
  const nameField = document.createElement('form-input');
  nameField.setAttribute('label', 'Nombre');
  nameField.setAttribute('required', true);
  nameField.setAttribute('type', 'text');
  nameField.validate();

  const emailField = document.createElement('form-input');
  emailField.setAttribute('label', 'Correo Electrónico');
  emailField.setAttribute('required', true);
  emailField.setAttribute('type', 'email');
  emailField.validate();

  const nationalIdField = document.createElement('form-input');
  nationalIdField.setAttribute('label', 'Cédula');
  nationalIdField.setAttribute('required', true);
  nationalIdField.setAttribute('type', 'text');
  nationalIdField.validate();

  const passwordField = document.createElement('form-input');
  passwordField.setAttribute('label', 'Contraseña');
  passwordField.setAttribute('required', true);
  passwordField.setAttribute('type', 'password');
  passwordField.validate();

  const confirmPasswordField = document.createElement('form-input');
  confirmPasswordField.setAttribute('label', 'Confirmar Contraseña');
  confirmPasswordField.setAttribute('required', true);
  confirmPasswordField.setAttribute('type', 'password');
  confirmPasswordField.validate();

  const errorLabel = document.createElement("label");
  errorLabel.setAttribute("class", "error");
  errorLabel.style.display = 'hidden';

  const submit = document.createElement("button");
  submit.setAttribute("type", "submit");
  submit.textContent = 'Crear Cuenta';

  const form = document.createElement("form");
  form.appendChild(nameField);
  form.appendChild(emailField);
  form.appendChild(nationalIdField);
  form.appendChild(passwordField);
  form.appendChild(confirmPasswordField);
  form.appendChild(errorLabel);
  form.appendChild(submit);

  const title = document.createElement("h2");
  title.textContent = 'Crear Cuenta';

  const formContainer = document.createElement("div");
  formContainer.setAttribute("class", "login-container");
  formContainer.appendChild(title);
  formContainer.appendChild(form);

  page.setAttribute("class", "background-container");
  page.appendChild(formContainer);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = nameField.value;
    const email = emailField.value;
    const nationalId = nationalIdField.value;
    const password = passwordField.value;
    const confirmation = confirmPasswordField.value;
    
    try {
      await signUp({ name, email, nationalId, password, confirmation });
      window.router.navigate('/sign-in');
    } catch (error) {
      let errorMsg = '';
      if (error.code === 'EMAIL_ALREADY_REGISTERED') {
        errorMsg = 'El correo ya está en uso';
      } else if (error.code === 'NATIONAL_ID_ALREADY_REGISTERED') {
        errorMsg = 'La cédula ya está en uso';
      } else if (error.code === 'INVALID_EMAIL') {
        errorMsg = 'Correo inválido';
      } else if (error.code === 'INVALID_NATIONAL_ID') {
        errorMsg = 'Cédula inválida';
      } else if (error.code === 'PASSWORD_MISMATCH') {
        errorMsg = 'Las contraseñas no coinciden';
      } else {
        errorMsg = 'Ocurrió un error inesperado';
      }
      errorLabel.style.display = 'block';
      errorLabel.textContent = errorMsg;
    }
  });
}