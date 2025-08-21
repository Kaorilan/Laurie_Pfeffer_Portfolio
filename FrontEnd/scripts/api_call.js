const apiUrl = 'http://localhost:5678/api';
let allWorks = [];

const boutons = [
  { id: "0", label: "Tous" },
  { id: "1", label: "Objets" },
  { id: "2", label: "Appartements" },
  { id: "3", label: "Hotels & restaurants" }
];

const container = document.getElementById('buttonContainer');

if (container) {
  boutons.forEach(bouton => {
    const btn = document.createElement('button');
    btn.id = bouton.id;
    btn.textContent = bouton.label;
    btn.disabled = true;

    btn.addEventListener('click', () => {
      afficherDonnees(allWorks, bouton.id);
    });

    container.appendChild(btn);
  });
} else {
  console.warn("Le conteneur 'buttonContainer' n'existe pas.");
}

function afficherDonnees(data, categoryId = 0) {
  const container = document.getElementById('gallery');
  if (!container) return;

  container.innerHTML = '';

  const filteredData = categoryId == 0
    ? data
    : data.filter(item => item.categoryId === Number(categoryId));

  filteredData.forEach(item => {
    const element = document.createElement('div');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;
    element.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = item.title;
    element.appendChild(title);

    container.appendChild(element);
  });
}

function fetchData() {
  fetch(apiUrl + "/works")
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau : ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      allWorks = data;
      afficherDonnees(allWorks);

      const buttons = document.querySelectorAll('#buttonContainer button');
      buttons.forEach(button => {
        button.disabled = false;
      });
    })
    .catch(error => {
      console.error('Erreur lors du chargement des données :', error);
      afficherErreur('Impossible de charger les travaux pour le moment.');
    });
}

function afficherErreur(message) {
  const container = document.getElementById('gallery');
  if (!container) return;

  container.innerHTML = '';
  const erreurElement = document.createElement('p');
  erreurElement.textContent = message;
  erreurElement.style.color = 'red';
  container.appendChild(erreurElement);
}

document.addEventListener('DOMContentLoaded', () => {
  // Pas besoin de gérer le clic sur le lien login ici

  // Active l'état actif du lien login si sur login.html
  const loginLink = document.getElementById('login_page');
  if (loginLink && window.location.pathname.endsWith('login.html')) {
    loginLink.classList.add('active-link');
  }

  fetchData();
});
