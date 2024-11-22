import '../styles/not-found.css'

export default function NotFoundPage(page) {
  const title = document.createElement("h1");
  title.textContent = '404';
  page.appendChild(title);

  const text = document.createElement("h1");
  text.setAttribute("class", "centered");
  text.textContent = 'Página no encontrada';
  page.appendChild(text);
}