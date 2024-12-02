export default function DashboardPagePage(page) {
  const title = document.createElement("h1");
  title.setAttribute("class", "centered");
  title.textContent = 'Bienvenido a S.T.A.R!';

  page.appendChild(title);
}