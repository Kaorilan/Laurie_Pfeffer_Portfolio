// -------------------
// Variables globales
// -------------------
const apiUrl = 'http://localhost:5678/api';
let allWorks = [];



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
  // Bandeau "Mode édition" style en css createlement appenchild 
  // -------------------
  if (editModeBanner) {
    editModeBanner.innerHTML =
      '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Mode édition';
    Object.assign(editModeBanner.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: 'black',
      color: 'white',
      padding: '12px',
      fontSize: '18px',
      fontWeight: 'bold',
      width: '100%',
    });
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
    Object.assign(editButton.style, {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      backgroundColor: 'transparent',
      color: 'black',
      padding: '0px 30px',
      border: 'none',
      cursor: 'pointer',
    });

      // Création de la modale
    const modal = construireModalDynamique();

      // Et on ouvre la modale au clic
    editButton.addEventListener('click', () => {
      modal.style.display = 'block';
      afficherImagesDansModale(allWorks);
    });
    }
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
// Création de la modale complète
// -------------------
function construireModalDynamique() {
  const modal = document.createElement("div");
  modal.id = "edit-modal";
  modal.classList.add("modal");
  modal.style.display = "none"; // cachée par défaut

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Bouton fermeture
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "×";

  // Titre galerie
  const title = document.createElement("h2");
  title.textContent = "Galerie photo";

  // Galerie d’images
  const gallery = document.createElement("div");
  gallery.id = "modal-gallery";
  gallery.classList.add("modal-gallery");

  // Séparateur
  const separator1 = document.createElement("hr");
  separator1.classList.add("separator");

  // Bouton ouverture formulaire
  const openFormBtn = document.createElement("button");
  openFormBtn.id = "open-photo-form-btn";
  openFormBtn.textContent = "Ajouter une photo";

  // Formulaire ajout
  const form = document.createElement("form");
  form.id = "photo-upload-form";
  form.style.display = "none";
  form.enctype = "multipart/form-data";

  const formTitle = document.createElement("h2");
  formTitle.classList.add("form-title");
  formTitle.textContent = "Ajout de photo";

  const uploadZone = document.createElement("div");
  uploadZone.classList.add("upload-zone");

  const labelUpload = document.createElement("label");
  labelUpload.setAttribute("for", "image-upload");
  labelUpload.classList.add("custom-upload-label");
  labelUpload.innerHTML = `<i class="fa fa-image"></i><span>+ Ajouter une photo</span>`;

  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.id = "image-upload";
  inputFile.accept = "image/jpeg, image/png";
  inputFile.required = true;

  const uploadInfo = document.createElement("p");
  uploadInfo.classList.add("upload-info");
  uploadInfo.textContent = "jpeg, png : 4 Mo max";

  uploadZone.appendChild(labelUpload);
  uploadZone.appendChild(inputFile);
  uploadZone.appendChild(uploadInfo);

  // Champ titre
  const formGroupTitle = document.createElement("div");
  formGroupTitle.classList.add("form-group");

  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "photo-title");
  labelTitle.textContent = "Titre";

  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.id = "photo-title";
  inputTitle.required = true;

  formGroupTitle.appendChild(labelTitle);
  formGroupTitle.appendChild(inputTitle);

  // Champ catégorie
  const formGroupCat = document.createElement("div");
  formGroupCat.classList.add("form-group");

  const labelCat = document.createElement("label");
  labelCat.setAttribute("for", "photo-category");
  labelCat.textContent = "Catégorie";

  const selectCategory = document.createElement("select");
  selectCategory.id = "photo-category";
  selectCategory.required = true;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Choisir une catégorie";
  selectCategory.appendChild(defaultOption);

  formGroupCat.appendChild(labelCat);
  formGroupCat.appendChild(selectCategory);

  // Séparateur + bouton submit
  const separator2 = document.createElement("hr");
  separator2.classList.add("separator");

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.classList.add("submit-btn");
  submitBtn.textContent = "Ajouter";

  // Assembler formulaire
  form.appendChild(formTitle);
  form.appendChild(uploadZone);
  form.appendChild(formGroupTitle);
  form.appendChild(formGroupCat);
  form.appendChild(separator2);
  form.appendChild(submitBtn);

  // Assembler contenu modal
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(gallery);
  modalContent.appendChild(separator1);
  modalContent.appendChild(openFormBtn);
  modalContent.appendChild(form);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // -------------------
  // Listeners internes
  // -------------------
  // Fermer avec croix
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fermer en cliquant en dehors
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Basculer vers formulaire
  openFormBtn.addEventListener("click", () => {
    gallery.style.display = "none";
    openFormBtn.style.display = "none";
    title.style.display = "none";
    form.style.display = "block";
  });

  return modal;
}

// -------------------
// Affichage images dans la modale
// -------------------
function afficherImagesDansModale(data) {
  const modalGallery = document.getElementById("modal-gallery");
  if (!modalGallery) return;

  modalGallery.innerHTML = "";

  data.forEach((item) => {
    const container = document.createElement("div");
    container.classList.add("modal-gallery-item");

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    deleteIcon.addEventListener("click", () => supprimerTravail(item.id));

    container.appendChild(img);
    container.appendChild(deleteIcon);
    modalGallery.appendChild(container);
  });
}

// -------------------
// Suppression
// -------------------
function supprimerTravail(id) {
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    alert("Non autorisé.");
    return;
  }

  fetch(`${apiUrl}/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (response.ok) {
        fetchData();
      } else {
        alert("Erreur lors de la suppression.");
      }
    })
    .catch(() => {
      alert("Erreur lors de la suppression.");
    });
}

// -------------------
// Formulaire (inchangé)
// -------------------
function remplirListeCategories(categories) {
  const select = document.getElementById("photo-category");
  if (!select) return;

  // Exclure "Tous"
  const filtredCats = categories.filter((cat) => cat.id !== 0);

  // Vider select
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Choisir une catégorie";
  select.appendChild(defaultOption);

  filtredCats.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.label;
    select.appendChild(option);
  });

  const photoUploadForm = document.getElementById("photo-upload-form");
  const imageInput = document.getElementById("image-upload");
  const uploadZone = document.querySelector(".upload-zone");

  if (imageInput && uploadZone && !imageInput.dataset.listenerAttached) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (file) {
        const fileType = file.type;
        const fileSize = file.size;

        if (!["image/jpeg", "image/png"].includes(fileType)) {
          alert("Format non supporté. Choisissez un fichier JPG ou PNG.");
          imageInput.value = "";
          return;
        }

        if (fileSize > 4 * 1024 * 1024) {
          alert("Image trop lourde (max 4 Mo).");
          imageInput.value = "";
          return;
        }

        // Supprimer ancien aperçu
        const existingPreview = uploadZone.querySelector("img");
        if (existingPreview) existingPreview.remove();

        // Aperçu
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = document.createElement("img");
          preview.src = e.target.result;
          preview.alt = "Aperçu";
          preview.style.maxWidth = "100%";
          preview.style.maxHeight = "200px";
          preview.style.objectFit = "contain";
          preview.style.marginTop = "10px";
          uploadZone.appendChild(preview);
        };
        reader.readAsDataURL(file);
      }
    });

    imageInput.dataset.listenerAttached = "true";
  }

  if (photoUploadForm) {
    photoUploadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const imageInput = document.getElementById("image-upload");
      const titleInput = document.getElementById("photo-title");
      const categorySelect = document.getElementById("photo-category");

      const file = imageInput.files[0];
      const title = titleInput.value.trim();
      const category = categorySelect.value;

      if (!file || !title || !category) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("category", category);

      const token = sessionStorage.getItem("authToken");
      if (!token) {
        alert("Non autorisé.");
        return;
      }

      fetch(`${apiUrl}/works`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            fetchData();

            // Réinitialiser
            photoUploadForm.reset();
            photoUploadForm.style.display = "none";
            document.getElementById("modal-gallery").style.display = "flex";
            document.getElementById("open-photo-form-btn").style.display =
              "block";
            document.querySelector(".modal-content h2").style.display = "block";
          } else {
            response.text().then(() => {
              alert("Erreur lors de l'envoi de la photo.");
            });
          }
        })
        .catch(() => {
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



  // -------------------
  // Premier chargement des données
  // -------------------
  fetchData();
