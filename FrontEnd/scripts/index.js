document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('authToken');
  const isTokenValid = token && isValidToken(token);
  const filters = document.getElementById('buttonContainer');

  const loginLogoutItem = document.getElementById('login_logout_container');
  const editButton = document.getElementById('edit-button');
  const editModeBanner = document.getElementById('edit-mode-banner');

  if (isTokenValid) {
    showLoggedInUI();
  } else {
    sessionStorage.removeItem('authToken'); // Supprimer le token invalide
    window.location.href = 'login.html';     // Redirection automatique
    return;                                  // Pour ne pas exécuter le reste du code inutilement
  }

  fetchData();

  if (isTokenValid) {
    afficherInterfaceAdmin();
    buttonContainer.style.display = 'none';
  } else {
    cacherFonctionnalitésAdmin();
  }

  function isValidToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (!payload.userId) {
        console.warn("Token invalide : pas de userId");
        return false;
      }

      const now = Date.now() / 1000; // en secondes
      if (payload.exp && payload.exp < now) {
        console.warn("Token expiré");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      return false;
    }
  }

  function showLoggedInUI() {
    loginLogoutItem.innerHTML = '<a href="index.html" id="logout">Logout</a>';
    editButton.style.display = 'block';
    editModeBanner.style.display = 'block';

    document.querySelector('#logout').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  function showLoggedOutUI() {
    sessionStorage.removeItem('authToken'); // Supprimer le token invalide
    loginLogoutItem.innerHTML = '<a href="login.html" id="login-link">Login</a>';
    editButton.style.display = 'none';
    editModeBanner.style.display = 'none';

    bindLoginClick();
  }

  function bindLoginClick() {
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        goToLogin();
      });
    }
  }

  function logout() {
    sessionStorage.removeItem('authToken');
    cacherFonctionnalitésAdmin();
    showLoggedOutUI();
  }

  function goToLogin() {
    window.location.href = 'login.html';
  }

  function afficherInterfaceAdmin() {
    console.log("Affichage des outils d'administration");
  }

  function cacherFonctionnalitésAdmin() {
    console.log("Masquage des outils d'administration");
  }

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
