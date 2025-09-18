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
// Vérification token
// -------------------
function isValidToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.userId && payload.exp > now;
  } catch (err) {
    console.error("Erreur vérification token :", err);
    return false;
  }
}

// -------------------
// Fetch des données
// -------------------
function fetchData() {
  fetch(`${apiUrl}/works`)
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

      // Remplir select dans formulaire et boutons filtres
      remplirListeCategories(categories);

      //bouton de filtre
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


// -------------------
// Remplir liste catégories
// -------------------
function remplirListeCategories(categories) {
  const select = document.getElementById("photo-category");
  if (!select) return;

  const filtredCats = categories.filter(cat => cat.id !== 0);
  select.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "";
  select.appendChild(defaultOption);

  filtredCats.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.label;
    select.appendChild(option);
  });
}

// -------------------
// Sélection du DOM
// -------------------
const filters = document.getElementById('buttonContainer');
const editButtonContainer = document.getElementById('edit-mode-button');
const editModeBanner = document.getElementById('edit-mode-banner');

// -------------------
// Lien login actif
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
  if (filters) filters.style.display = 'flex';
} else {
  showLoggedInUI();
  if (filters) filters.style.display = 'none';
}


// -------------------
// UI Mode connecté
// -------------------
function showLoggedInUI() {
  const loginLogoutItem = document.getElementById('login_logout_container');
  const editButtonContainer = document.getElementById('edit-mode-button');
  const editModeBanner = document.getElementById('edit-mode-banner');

  // Lien logout
  if (loginLogoutItem) {
    loginLogoutItem.innerHTML = '<a href="index.html" id="logout">logout</a>';
    const logoutLink = document.querySelector('#logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem("authToken");
        window.location.href = "index.html";
      });
    }
  }

  // Bandeau Mode édition
  if (editModeBanner) {
    editModeBanner.innerHTML = "";
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-pencil-square-o");

    const text = document.createElement("span");
    text.textContent = "Mode édition";

    editModeBanner.appendChild(icon);
    editModeBanner.appendChild(text);
    editModeBanner.classList.add("edit-mode-banner");
  }

  // Bouton Modifier
  let button;
  if (editButtonContainer) {
    editButtonContainer.innerHTML = "";
    button = document.createElement("button");
    button.id = "edit-button";

    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-pencil-square-o");

    const text = document.createElement("span");
    text.textContent = "Modifier";

    button.appendChild(icon);
    button.appendChild(text);
    button.classList.add("edit-button");

    editButtonContainer.appendChild(button);
  }

  // Création modale
  const modal = construireModalDynamique();

  if (button) {
    button.addEventListener('click', () => {
      modal.style.display = 'block';
      afficherImagesDansModale(allWorks);
    });
  }
}

// -------------------
// Modale complète
// -------------------
function construireModalDynamique() {
  const modal = document.createElement("div");
  modal.id = "edit-modal";
  modal.classList.add("modal");
  modal.style.display = "none";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Bouton fermeture
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "×";

  // Titre galerie
  const title = document.createElement("h2");
  title.textContent = "Galerie photo";

  // Galerie
  const gallery = document.createElement("div");
  gallery.id = "modal-gallery";
  gallery.classList.add("modal-gallery");

  const separatorModal = document.createElement("hr");
  separatorModal.classList.add("separator-modal");

  // Bouton accès formulaire
  const openFormBtn = document.createElement("button");
  openFormBtn.id = "open-photo-form-btn";
  openFormBtn.textContent = "Ajouter une photo";

  // Formulaire
  const form = document.createElement("form");
  form.id = "photo-upload-form";
  form.style.display = "none";
  form.enctype = "multipart/form-data";

  // Flèche retour
  const backArrow = document.createElement("span");
  backArrow.classList.add("back-arrow");
  backArrow.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
  backArrow.style.cursor = "pointer";
  backArrow.style.fontSize = "20px";
  backArrow.style.display = "block";
  backArrow.style.marginBottom = "10px";

  backArrow.addEventListener("click", () => {
    form.style.display = "none";
    gallery.style.display = "flex";
    openFormBtn.style.display = "block";
    title.style.display = "block";
    separatorModal.style.display = "block";
  });

  form.appendChild(backArrow);

  // Titre formulaire
  const formTitle = document.createElement("h2");
  formTitle.classList.add("form-title");
  formTitle.textContent = "Ajout photo";
  

  // Upload zone
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

  const separatorForm = document.createElement("hr");
  separatorForm.classList.add("separator-form");

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.classList.add("submit-btn");
  submitBtn.textContent = "Valider";

  form.appendChild(formTitle);
  form.appendChild(uploadZone);
  form.appendChild(formGroupTitle);
  form.appendChild(formGroupCat);
  form.appendChild(separatorForm);
  form.appendChild(submitBtn);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(gallery);
  modalContent.appendChild(separatorModal);
  modalContent.appendChild(openFormBtn);
  modalContent.appendChild(form);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Listeners
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  openFormBtn.addEventListener("click", () => {
    gallery.style.display = "none";
    openFormBtn.style.display = "none";
    title.style.display = "none";
    separatorModal.style.display = "none";
    form.style.display = "block";
  });

  // Gestion upload image + preview
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (!file) return;

    const fileType = file.type;
    const fileSize = file.size;

    if (!["image/jpeg", "image/png"].includes(fileType)) {
      alert("Format non supporté. Choisissez un fichier JPG ou PNG.");
      inputFile.value = "";
      return;
    }

    if (fileSize > 4 * 1024 * 1024) {
      alert("Image trop lourde (max 4 Mo).");
      inputFile.value = "";
      return;
    }

    const existingPreview = uploadZone.querySelector(".preview-wrapper");
    if (existingPreview) existingPreview.remove();

    const previewWrapper = document.createElement("div");
    previewWrapper.classList.add("preview-wrapper");
    const preview = document.createElement("img");
    preview.src = URL.createObjectURL(file);
    preview.alt = "Aperçu";
    preview.classList.add("preview-image");
    previewWrapper.appendChild(preview);
    uploadZone.appendChild(previewWrapper);

    //cache le label upload derriere l'image
    labelUpload.style.display = "none";
  });

  // Gestion soumission formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = inputFile.files[0];
    const titleValue = inputTitle.value.trim();
    const categoryValue = selectCategory.value;

    if (!file || !titleValue || !categoryValue) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", titleValue);
    formData.append("category", categoryValue);

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      alert("Non autorisé.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/works`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        alert("Erreur lors de l'envoi de la photo.");
        return;
      }

      fetchData();

      // Reset form
      inputFile.value = "";
      inputTitle.value = "";
      selectCategory.value = "";
      const preview = uploadZone.querySelector(".preview-wrapper");
      if (preview) preview.remove();
      labelUpload.style.display = "block";

      form.style.display = "none";
      gallery.style.display = "flex";
      openFormBtn.style.display = "block";
      title.style.display = "block";
      separatorModal.style.display = "block";
    } catch {
      alert("Erreur réseau.");
    }
  });

  return modal;
}

// -------------------
// Affichage images modale
// -------------------
function afficherImagesDansModale(data) {
  const modalGallery = document.getElementById("modal-gallery");
  if (!modalGallery) return;

  modalGallery.innerHTML = "";

  data.forEach(item => {
    const container = document.createElement("div");
    container.classList.add("modal-gallery-item");

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = '<i class="fa fa-trash"></i>';
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
  .then(response => {
    if (!response.ok) {
      alert("Erreur lors de la suppression.");
      return;
    }
    fetchData();
  })
  .catch(() => alert("Erreur lors de la suppression."));
}



// -------------------
// Erreur utilitaire
// -------------------
function afficherErreur(message) {
  alert(message);
}

fetchData();
