const apiUrl = 'http://localhost:5678/api';
let allWorks = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM chargé");

  const token = sessionStorage.getItem('authToken');
  const isTokenValid = token && isValidToken(token);

  console.log("🔐 Token valide :", isTokenValid);

  const filters = document.getElementById('buttonContainer');
  const loginLogoutItem = document.getElementById('login_logout_container');
  const editButton = document.getElementById('edit-button');
  const editModeBanner = document.getElementById('edit-mode-banner');
  const modal = document.getElementById('edit-modal');
  const closeModalBtn = document.querySelector('.close-btn');
 
  const openFormBtn = document.getElementById('open-photo-form-btn');
  const formAjout = document.getElementById('photo-upload-form');
  const modalGallery = document.getElementById('modal-gallery');
  const modalTitle = document.querySelector('.modal-content h2');

  if (openFormBtn && formAjout && modalGallery && modalTitle) {
    openFormBtn.addEventListener('click', () => {
      // Cacher la galerie
      modalGallery.style.display = 'none';
      openFormBtn.style.display = 'none';
      modalTitle.style.display = 'none';

      // Afficher le formulaire
      formAjout.style.display = 'block';
    });
  }

  // Remplir la liste des catégories
  remplirListeCategories();

  const loginLink = document.getElementById('login_page');
  if (loginLink && window.location.pathname.endsWith('login.html')) {
    loginLink.classList.add('active-link');
  }

    // Si token invalide, rediriger
   if (!isTokenValid) {
    sessionStorage.removeItem('authToken');

    // Masquer les éléments d'administration
    if (editButton) editButton.style.display = 'none';
    if (editModeBanner) editModeBanner.style.display = 'none';

    console.log("❌ Token invalide, interface admin masquée");
  } else {
    showLoggedInUI();
    afficherInterfaceAdmin();

    if (filters) filters.style.display = 'none';

    if (editButton) {
      editButton.addEventListener('click', () => {
        afficherImagesDansModale(allWorks);
        modal.style.display = 'block';
      });
    }

    console.log("✅ Utilisateur connecté, interface admin affichée");
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    } else {
      // Non authentifié → masquer les outils admin si nécessaire
      if (!isTokenValid) {
        if (editButton) editButton.style.display = 'none';
        if (editModeBanner) editModeBanner.style.display = 'none';
        console.log("👀 Click hors modal - outils admin masqués (non connecté)");
      }
    }
  });

  console.log("📦 Appel à fetchData()");
  fetchData();
});

function isValidToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.userId && (!payload.exp || payload.exp > now);
  } catch (error) {
    console.error("Erreur vérification token :", error);
    return false;
  }
}

function showLoggedInUI() {
  const loginLogoutItem = document.getElementById('login_logout_container');
  const editButton = document.getElementById('edit-button');
  const editModeBanner = document.getElementById('edit-mode-banner');

  loginLogoutItem.innerHTML = '<a href="index.html" id="logout">Logout</a>';
  editButton.style.display = 'block';
  editModeBanner.style.display = 'block';

  document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

function logout() {
  sessionStorage.removeItem('authToken');
  window.location.href = 'index.html';
}

function afficherInterfaceAdmin() {
  console.log("Affichage des outils d'administration");
}

// -------------------
//  Galerie & Filtres
// -------------------

const boutons = [
  { id: "0", label: "Tous" },
  { id: "1", label: "Objets" },
  { id: "2", label: "Appartements" },
  { id: "3", label: "Hotels & restaurants" }
];

const boutonContainer = document.getElementById('buttonContainer');
if (boutonContainer) {
  boutons.forEach(bouton => {
    const btn = document.createElement('button');
    btn.id = bouton.id;
    btn.textContent = bouton.label;
    btn.disabled = true;

    btn.addEventListener('click', () => {
      afficherDonnees(allWorks, bouton.id);
    });

    boutonContainer.appendChild(btn);
  });
}

function afficherDonnees(data, categoryId = 0) {

  console.log("🖼️ Données à afficher :", data, "Catégorie :", categoryId);

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

  console.log("Chargement des travaux...");

  fetch(apiUrl + "/works")
    .then(response => {
      console.log("Réponse API :", response.status);

      if (!response.ok) {
        throw new Error('Erreur réseau : ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Données reçues depuis l'API :", data);

      allWorks = data;
      afficherDonnees(allWorks);
      afficherImagesDansModale(allWorks);

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

// -------------------
//      Modale
// -------------------

function afficherImagesDansModale(data) {
  const modalGallery = document.getElementById('modal-gallery');
  if (!modalGallery) return;

  modalGallery.innerHTML = '';

  data.forEach(item => {
    const container = document.createElement('div');
    container.classList.add('modal-gallery-item');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    deleteIcon.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

    deleteIcon.addEventListener('click', () => {
      supprimerTravail(item.id);
    });

    container.appendChild(img);
    container.appendChild(deleteIcon);
    modalGallery.appendChild(container);
  });
}

function supprimerTravail(id) {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    alert('Non autorisé.');
    return;
  }

  fetch(`${apiUrl}/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (response.ok) {
        fetchData(); // mise à jour galerie + modale
      } else {
        alert("Erreur lors de la suppression.");
      }
    })
    .catch(error => {
      console.error('Erreur API DELETE:', error);
      alert("Erreur lors de la suppression.");
    });
}


// -------------------
//      Formulaire
// -------------------

function remplirListeCategories() {
  const select = document.getElementById('photo-category');
  if (!select) return;

  // On exclut la catégorie "Tous" (id = "0")
  const categories = boutons.filter(cat => cat.id !== "0");

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.label;
    select.appendChild(option);
  });
}
