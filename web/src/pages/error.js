// import '../styles/error.css'

export default function ErrorPage(page) {
  const container = document.createElement("div");
  container.setAttribute("class", "container");

  const title = document.createElement("h1");
  title.textContent = 'Algo salió mal';
  container.appendChild(title);

  const text = document.createElement("a");
  container.setAttribute("href", "javascript:history.back()");
  text.textContent = 'Regresar';
  container.appendChild(text);

  page.appendChild(container);
}