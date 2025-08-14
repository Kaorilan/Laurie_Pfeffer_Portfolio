const apiUrl = 'http://localhost:5678/api/works';
let allWorks = []; // Stocker toutes les données reçues

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
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau : ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      allWorks = data;
      afficherDonnees(allWorks);

      // Ajouter les écouteurs aux boutons pour filtrer
      const buttons = document.querySelectorAll('#filters button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          afficherDonnees(allWorks, button.id);
        });
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
  fetchData();
});