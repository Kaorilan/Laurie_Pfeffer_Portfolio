document.addEventListener('DOMContentLoaded', () => {
  console.log("Script chargé et DOM prêt");

  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !errorMessage || !submitBtn) {
    console.error("Élément(s) introuvable(s) dans le DOM");
    return;
  }

  // Vérifie que les champs existent avant d'ajouter l'écouteur
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Formulaire soumis");

    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');

    if (!emailElement || !passwordElement) {
      console.error("Champ email ou mot de passe introuvable");
      return;
    }

    const emailInput = emailElement.value.trim();
    const passwordInput = passwordElement.value.trim();

    const expectedEmail = "admin";
    const expectedPassword = "12345";

    if (emailInput === expectedEmail && passwordInput === expectedPassword) {
      window.location.href = '../index.html'; // ajuster si nécessaire
    } else {
      errorMessage.textContent = "Erreur : identifiants incorrects, veuillez réessayer.";
      errorMessage.style.color = 'red';
    }
  });
});
