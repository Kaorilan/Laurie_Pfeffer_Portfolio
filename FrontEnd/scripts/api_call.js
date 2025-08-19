const apiUrl = 'http://localhost:5678/api';
let allWorks = []; // Stocker toutes les données reçues

// Données pour chaque bouton
const boutons = [
  { id: "0", label: "Tous" },
  { id: "1", label: "Objets" },
  { id: "2", label: "Appartements" },
  { id: "3", label: "Hotels & restaurants" }
];


// Sélectionner le conteneur
const container = document.getElementById('buttonContainer');

// Vérifier que le conteneur existe
if (container) {
  // Parcourir chaque bouton et le créer
  boutons.forEach(bouton => {
    const btn = document.createElement('button');
    btn.id = bouton.id;                // Assigner l'ID
    btn.textContent = bouton.label;    // Définir le texte
    btn.disabled = true;               // Désactiver ici

    // Ajouter un écouteur d'événement si besoin
    btn.addEventListener('click', () => {
  afficherDonnees(allWorks, bouton.id);
});

// Insérer le bouton dans le conteneur
    container.appendChild(btn);
  });
} else {
  console.error("Le conteneur 'buttonContainer' n'existe pas.");
}

// Affiche les travaux filtrés selon la catégorie
function afficherDonnees(data, categoryId = 0) {
  const container = document.getElementById('gallery');
  container.innerHTML = '';

  // 0 ou "0" pour afficher tout, sinon filtre sur categoryId
  const filteredData = categoryId == 0 ? data : data.filter(item => item.categoryId === Number(categoryId));

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

// Charge les données depuis l'API, affiche tout, puis active le filtre
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

    // Activer tous les boutons après chargement
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

// Affiche un message d’erreur dans la galerie
function afficherErreur(message) {
  const container = document.getElementById('gallery');
  container.innerHTML = '';
  const erreurElement = document.createElement('p');
  erreurElement.textContent = message;
  erreurElement.style.color = 'red';
  container.appendChild(erreurElement);
}

// Initialisation après chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du clic sur login
  const login = document.getElementById('login_page');
  if (login) {
    login.addEventListener('click', () => {
      window.location.href = 'login.html';  // Chemin vers la page login
    });

    // Mettre le lien en gras si on est sur la page login
    if (window.location.pathname.endsWith('login.html')) {
      login.classList.add('active-link');
    }
  } else {
    console.error("L'élément #login_page n'existe pas.");
  }
 
  fetchData();
});