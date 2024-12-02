export default function HomePage(page) {
  const text = document.createElement("h1");
  text.setAttribute("class", "centered");
  text.textContent = 'Bienvenido a S.T.A.R!';

  page.appendChild(text);
}