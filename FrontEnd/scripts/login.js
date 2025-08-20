document.addEventListener('DOMContentLoaded', () => {
  console.log("Script chargé et DOM prêt");

  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.querySelector('#login-form button[type="submit"]'); // ou getElementById si vous ajoutez un id au bouton

  if (!form) return console.error("Formulaire introuvable");
  if (!errorMessage) return console.error("#error-message introuvable");
  if (!submitBtn) return console.error("Bouton de soumission introuvable");

  // Optionnel : écouteur sur le clic du bouton pour tester ou contourner un blocage
  submitBtn.addEventListener('click', (event) => {
    console.log("Bouton cliqué");
    // Vous pouvez ici forcer la soumission si nécessaire, sinon ça sert juste pour débugger
    // form.requestSubmit();
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Formulaire soumis");
	

    const usernameInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    const expectedUsername = "admin";
    const expectedPassword = "12345";

    if (usernameInput === expectedUsername && passwordInput === expectedPassword) {
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = "Erreur : identifiants incorrects, veuillez réessayer.";
      errorMessage.style.color = 'red'; // S’assurer que le texte est visible
    }

 });
});