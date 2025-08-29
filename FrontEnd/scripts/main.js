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
    const now = Date.now() / 1000;//milli secondes
    return payload.userId && payload.exp > now;
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

  const photoUploadForm = document.getElementById('photo-upload-form');

  const imageInput = document.getElementById('image-upload');
  const uploadZone = document.querySelector('.upload-zone');

if (imageInput && uploadZone) {
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      const fileType = file.type;
      const fileSize = file.size;

      // Valider le format (JPEG, PNG) et la taille (max 4 Mo)
      if (!['image/jpeg', 'image/png'].includes(fileType)) {
        alert("Format non supporté. Choisissez un fichier JPG ou PNG.");
        imageInput.value = ''; // reset
        return;
      }

      if (fileSize > 4 * 1024 * 1024) {
        alert("Image trop lourde (max 4 Mo).");
        imageInput.value = '';
        return;
      }

      // Supprimer l'aperçu précédent s'il existe
      const existingPreview = uploadZone.querySelector('img');
      if (existingPreview) {
        existingPreview.remove();
      }

      // Afficher l'aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.createElement('img');
        preview.src = e.target.result;
        preview.alt = "Aperçu";
        preview.style.maxWidth = '100%';
        preview.style.maxHeight = '200px';
        preview.style.objectFit = 'contain';
        preview.style.marginTop = '10px';

        uploadZone.appendChild(preview);
      };

      reader.readAsDataURL(file);
    }
  });
}


  if (photoUploadForm) {
    photoUploadForm.addEventListener('submit', (e) => {
      e.preventDefault(); // éviter le rechargement de la page

      const imageInput = document.getElementById('image-upload');
      const titleInput = document.getElementById('photo-title');
      const categorySelect = document.getElementById('photo-category');

      const file = imageInput.files[0];
      const title = titleInput.value.trim();
      const category = categorySelect.value;

      if (!file || !title || !category) {
        alert('Veuillez remplir tous les champs.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('category', category);

      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert("Non autorisé.");
        return;
      }

      fetch(`${apiUrl}/works`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log("✅ Image ajoutée");
          // Recharger les données
          fetchData();

          // Réinitialiser le formulaire et réafficher la galerie
          photoUploadForm.reset();
          document.getElementById('photo-upload-form').style.display = 'none';
          document.getElementById('modal-gallery').style.display = 'flex';
          document.getElementById('open-photo-form-btn').style.display = 'block';
          document.querySelector('.modal-content h2').style.display = 'block';
        } else {
          response.text().then(text => {
            console.error("Erreur API :", text);
            alert("Erreur lors de l'envoi de la photo.");
          });
        }
      })
      .catch(error => {
        console.error('Erreur requête POST :', error);
        alert("Erreur réseau.");
      });
    });
  }
}
