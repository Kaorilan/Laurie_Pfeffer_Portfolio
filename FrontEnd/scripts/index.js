document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');


function afficherInterfaceAdmin() {
  const adminBar = document.getElementById('admin-bar');
  const deleteIcons = document.querySelectorAll('.delete-icon');
  const editButtons = document.querySelectorAll('.edit-button');

if (adminBar) adminBar.style.display = 'block';

  deleteIcons.forEach(icon => icon.style.display = 'inline');
  editButtons.forEach(btn => btn.style.display = 'inline');
}

function cacherFonctionnalitésAdmin() {
  const adminBar = document.getElementById('admin-bar');
  const deleteIcons = document.querySelectorAll('.delete-icon');
  const editButtons = document.querySelectorAll('.edit-button');

if (adminBar) adminBar.style.display = 'none';

  deleteIcons.forEach(icon => icon.style.display = 'none');
  editButtons.forEach(btn => btn.style.display = 'none');
}


fetch('http://localhost:5678/api/works', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

  if (token) {
    console.log("Utilisateur connecté.");
    afficherInterfaceAdmin(); // Affiche les outils d'administration
  } else {
    console.log("Utilisateur non connecté.");
    cacherFonctionnalitésAdmin();
  }

  fetchData(); // Charger les travaux (publics)
});
