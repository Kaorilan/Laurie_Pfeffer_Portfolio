document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  const loginLogoutItem = document.querySelector('login-logout');
  const editButton = document.getElementById('edit-button');
  const editModeBanner = document.getElementById('edit-mode-banner');

  if (token) {
    // Utilisateur connecté
    loginLogoutItem.innerHTML = '<a href="index.html" id="logout">Logout</a>';
    editButton.style.display = 'block';
    editModeBanner.style.display = 'block';

    // Déconnexion
    document.querySelector('logout').addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = 'index.html'; // Rediriger après déconnexion
    });
  } else {
    // Utilisateur non connecté
    loginLogoutItem.innerHTML = '<li><a href="login.html" id="login_page">login </a></li>';
    editButton.style.display = 'none';
    editModeBanner.style.display = 'none';
  }


  fetchData(); // Charger les travaux publics

  // Vérifier si l'utilisateur est autorisé à effectuer des actions d'administration
  if (token) {
    afficherInterfaceAdmin(); // Afficher les outils d'administration si l'utilisateur est connecté
  } else {
    cacherFonctionnalitésAdmin(); // Cacher les outils d'administration si l'utilisateur n'est pas connecté
  }
  


// Fonction pour afficher l'interface de l'utilisateur connecté
function displayLoggedInState() {
  // Afficher le mode édition dans le bandeau
  const editModeBanner = document.getElementById('edit-mode-banner');
  if (editModeBanner) {
    editModeBanner.style.display = 'block';
  }

  // Modifier le texte du menu "login" -> "logout"
  const loginLogoutItem = document.querySelector('login-logout');
  if (loginLogoutItem) {
    loginLogoutItem.textContent = 'Logout';
    loginLogoutItem.removeEventListener('click', goToLogin); // Supprimer l'ancien événement
    loginLogoutItem.addEventListener('click', logout); // Ajouter l'événement logout
  }

  // Masquer les filtres
  const filters = document.getElementById('filters');
  if (filters) {
    filters.style.display = 'none';
  }

  // Afficher le bouton de modification
  const editButton = document.getElementById('edit-button');
  if (editButton) {
    editButton.style.display = 'block';
  }
}

// Fonction pour afficher l'interface de l'utilisateur déconnecté
function displayLoggedOutState() {
  // Cacher le mode édition dans le bandeau
  const editModeBanner = document.getElementById('edit-mode-banner');
  if (editModeBanner) {
    editModeBanner.style.display = 'none';
  }

  // Modifier le texte du menu "logout" -> "login"
  const loginLogoutItem = document.getElementById('login-logout');
  if (loginLogoutItem) {
    loginLogoutItem.textContent = 'Login';
    loginLogoutItem.removeEventListener('click', logout); // Supprimer l'événement logout
    loginLogoutItem.addEventListener('click', goToLogin); // Ajouter l'événement de redirection vers login
  }

  // Afficher les filtres
  const filters = document.getElementById('filters');
  if (filters) {
    filters.style.display = 'block';
  }

  // Cacher le bouton de modification
  const editButton = document.getElementById('edit-button');
  if (editButton) {
    editButton.style.display = 'none';
  }
}

// Fonction de déconnexion
function logout() {
  // Supprimer le token du localStorage
  localStorage.removeItem('authToken');
  
  // Rediriger vers la page d'accueil
  window.location.href = 'index.html';
}

// Fonction de redirection vers la page de login
function goToLogin() {
  window.location.href = 'login.html';
}

// Fonction pour afficher les outils d'administration
function afficherInterfaceAdmin() {
  // Par exemple, montrer des boutons de gestion des travaux
  console.log('Affichage des outils d\'administration');
}

// Fonction pour cacher les outils d'administration
function cacherFonctionnalitésAdmin() {
  // Par exemple, masquer les boutons d\'administration
  console.log('Masquage des outils d\'administration');
}

// Charger les travaux publics
function fetchData() {
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Afficher les travaux sur la page
    })
    .catch(error => console.error('Erreur de chargement des travaux:', error));
}
});