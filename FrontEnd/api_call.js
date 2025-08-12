// URL de votre API back-end
const apiUrl = 'http://localhost:5678/api/works';



// Fonction pour afficher les données dans le DOM
function afficherDonnees(data) {
  const container = document.getElementById('portfolio');
  container.innerHTML = ''; // vider le contenu

  data.forEach(item => {
    const element = document.createElement('div');

    // création img
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;
    element.appendChild(img);

    // création titre
    const title = document.createElement('h3');
    title.textContent = item.title;
    element.appendChild(title);

    // ajout à la div container principale
    container.appendChild(element);
  });
}


function fetchData() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau : ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      afficherDonnees(data);
    })
    .catch(error => {
      console.error('Erreur lors du chargement des données :', error);
      afficherErreur('Impossible de charger les travaux pour le moment.');
    });
}


function afficherErreur(message) {
  const container = document.getElementById('gallery');
  container.innerHTML = '';
  const erreurElement = document.createElement('p');
  erreurElement.textContent = message;
  erreurElement.style.color = 'red';
  container.appendChild(erreurElement);
}

// Appeler la fonction pour charger les données
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});