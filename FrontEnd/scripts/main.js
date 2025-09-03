// -------------------
// Variables globales
// -------------------
const apiUrl = 'http://localhost:5678/api';
let allWorks = [];


// -------------------
// DOM Ready
// -------------------
document.addEventListener('DOMContentLoaded', () => {

  // -------------------
  // Gestion du token
  // -------------------
  const token = sessionStorage.getItem('authToken');
  const isTokenValid = token && isValidToken(token);

  // -------------------
  // Sélection des éléments du DOM
  // -------------------
  const filters = document.getElementById('buttonContainer');
  const editButtonContainer = document.getElementById('edit-mode-button');
  const editModeBanner = document.getElementById('edit-mode-banner');
  const modal = document.getElementById('edit-modal');
  

  // -------------------
  // Gestion lien login actif
  // -------------------
  const loginLink = document.getElementById('login_page');
  if (loginLink && window.location.pathname.endsWith('login.html')) {
    loginLink.classList.add('active-link');
  }

  // -------------------
  // Gestion UI selon connexion
  // -------------------
  if (!isTokenValid) {
    sessionStorage.removeItem('authToken');
    if (editButtonContainer) editButtonContainer.style.display = 'none';
    if (editModeBanner) editModeBanner.style.display = 'none';
    // IMPORTANT : quand on n’est PAS connecté, on montre les filtres
    if (filters) filters.style.display = 'flex';
  } else {
    showLoggedInUI();
    // Quand on est connecté → on masque les filtres
    if (filters) filters.style.display = 'none';
  }


  // -------------------
  // Premier chargement des données
  // -------------------
  fetchData();
});


// -------------------
// Vérification token
// -------------------
function isValidToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000; // secondes
    return payload.userId && payload.exp > now;
  } catch (error) {
    console.error("Erreur vérification token :", error);
    return false;
  }
}

// -------------------
// UI Connexion / Déconnexion
// -------------------

function showLoggedInUI() {
  const loginLogoutItem = document.getElementById('login_logout_container');
  const editButtonContainer = document.getElementById('edit-mode-button');
  const editModeBanner = document.getElementById('edit-mode-banner');
  const modal = document.getElementById('edit-modal');

  // -------------------
  // Lien Logout
  // -------------------
  if (loginLogoutItem) {
    loginLogoutItem.innerHTML = '<a href="index.html" id="logout">Logout</a>';
    const logoutLink = document.querySelector('#logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  }

  // -------------------
  // Bandeau "Mode édition"
  // -------------------
  if (editModeBanner) {
    editModeBanner.innerHTML = '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Mode édition';
    editModeBanner.style.display = 'flex';
    editModeBanner.style.alignItems = 'center';
    editModeBanner.style.justifyContent = 'center';
    editModeBanner.style.gap = '8px';
    editModeBanner.style.backgroundColor = 'black';
    editModeBanner.style.color = 'white';
    editModeBanner.style.padding = '12px';
    editModeBanner.style.fontSize = '18px';
    editModeBanner.style.fontWeight = 'bold';
    editModeBanner.style.width = '100%';
  }

  // -------------------
  // Bouton "Modifier" 
  // -------------------
  if (editButtonContainer) {
    editButtonContainer.innerHTML = `
      <button id="edit-button">
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Modifier
      </button>
    `;

    const editButton = document.getElementById('edit-button');

    // Styles du bouton
    editButton.style.display = 'inline-flex';
    editButton.style.alignItems = 'center';
    editButton.style.justifyContent = 'center';
    editButton.style.gap = '6px';
    editButton.style.backgroundColor = 'transparent';
    editButton.style.color = 'black';
    editButton.style.padding = '0px 30px';
    editButton.style.border = 'none';
    editButton.style.cursor = 'pointer';



  if (modal && modal.innerHTML.trim() === "") {
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h2>Galerie photo</h2>
        <div id="modal-gallery"></div>
        <button id="open-photo-form-btn">Ajouter une photo</button>
        <form id="photo-upload-form" style="display:none;">
          <div class="upload-zone">
            <input type="file" id="image-upload" accept="image/png, image/jpeg"/>
          </div>
          <input type="text" id="photo-title" placeholder="Titre"/>
          <select id="photo-category"></select>
          <button type="submit">Valider</button>
        </form>
      </div>
    `;
  }

  // -------------------
  // Listener ouverture modale
  // -------------------
  editButton.addEventListener('click', () => {
    modal.style.display = 'block';
    afficherImagesDansModale(allWorks);

  // Listener fermeture
  const closeModalBtn = modal.querySelector('.close-btn');
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');

    window.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    const openFormBtn = document.getElementById('open-photo-form-btn');
    const formAjout = document.getElementById('photo-upload-form');
    const modalGallery = document.getElementById('modal-gallery');
    const modalTitle = document.querySelector('.modal-content h2');

    if (openFormBtn && formAjout && modalGallery && modalTitle) {
      openFormBtn.addEventListener('click', () => {
        modalGallery.style.display = 'none';
        openFormBtn.style.display = 'none';
        modalTitle.style.display = 'none';
        formAjout.style.display = 'block';
        });
      }
    });
  }
}


function logout() {
  sessionStorage.removeItem('authToken');
  window.location.href = 'index.html';
}

function afficherInterfaceAdmin() {
}


// -------------------
// Galerie & filtres
// -------------------
function afficherDonnees(data, categoryId = 0) {

  const container = document.getElementById('gallery');
  if (!container) return;

  container.innerHTML = '';

  const filteredData = categoryId == 0
    ? data
    : data.filter(item => item.category.id === Number(categoryId));

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
      if (!response.ok) throw new Error('Erreur réseau : ' + response.status);
      return response.json();
    })
    .then(data => {
      allWorks = data;

      // Catégories uniques
      const categoriesMap = new Map();
      allWorks.forEach(work => {
        const cat = work.category;
        if (cat && !categoriesMap.has(cat.id)) categoriesMap.set(cat.id, cat.name);
      });

      const categories = [{ id: 0, label: "Tous" }];
      categoriesMap.forEach((name, id) => categories.push({ id, label: name }));

      // Remplir liste select
      remplirListeCategories(categories);

      // Boutons filtres
      const boutonContainer = document.getElementById('buttonContainer');
      if (boutonContainer) {
        boutonContainer.innerHTML = '';
        categories.forEach(cat => {
          const btn = document.createElement('button');
          btn.dataset.id = cat.id;
          btn.textContent = cat.label;
          btn.addEventListener('click', (e) => {
            afficherDonnees(allWorks, Number(e.target.dataset.id));
          });
          boutonContainer.appendChild(btn);
        });
      }

      afficherDonnees(allWorks);
      afficherImagesDansModale(allWorks);
    })
    .catch(error => {
      afficherErreur('Impossible de charger les travaux pour le moment.');
    });
}


// -------------------
// Modale
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
    deleteIcon.addEventListener('click', () => supprimerTravail(item.id));

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
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(response => {
      if (response.ok) {
        fetchData();
      } else {
        alert("Erreur lors de la suppression.");
      }
    })
    .catch(error => {
      alert("Erreur lors de la suppression.");
    });
}


// -------------------
// Formulaire
// -------------------
function remplirListeCategories(categories) {
  const select = document.getElementById('photo-category');
  if (!select) return;

  // Exclure "Tous"
  const filtredCats = categories.filter(cat => cat.id !== 0);

  // Vider select
  select.innerHTML = '';

  filtredCats.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.label;
    select.appendChild(option);
  });

  const photoUploadForm = document.getElementById('photo-upload-form');
  const imageInput = document.getElementById('image-upload');
  const uploadZone = document.querySelector('.upload-zone');

  if (imageInput && uploadZone && !imageInput.dataset.listenerAttached) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const fileType = file.type;
        const fileSize = file.size;

        if (!['image/jpeg', 'image/png'].includes(fileType)) {
          alert("Format non supporté. Choisissez un fichier JPG ou PNG.");
          imageInput.value = '';
          return;
        }

        if (fileSize > 4 * 1024 * 1024) {
          alert("Image trop lourde (max 4 Mo).");
          imageInput.value = '';
          return;
        }

        // Supprimer ancien aperçu
        const existingPreview = uploadZone.querySelector('img');
        if (existingPreview) existingPreview.remove();

        // Aperçu
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

    imageInput.dataset.listenerAttached = "true";
  }

  if (photoUploadForm) {
    photoUploadForm.addEventListener('submit', (e) => {
      e.preventDefault();

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
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
        .then(response => {
          if (response.ok) {
            fetchData();

            // Réinitialiser
            photoUploadForm.reset();
            photoUploadForm.style.display = 'none';
            document.getElementById('modal-gallery').style.display = 'flex';
            document.getElementById('open-photo-form-btn').style.display = 'block';
            document.querySelector('.modal-content h2').style.display = 'block';
          } else {
            response.text().then(text => {
              alert("Erreur lors de l'envoi de la photo.");
            });
          }
        })
        .catch(error => {
          alert("Erreur réseau.");
        });
    });
  }
}


// -------------------
// Fonction utilitaire erreur
// -------------------
function afficherErreur(message) {
  alert(message); // (ou un affichage plus élégant dans ton UI)
}
