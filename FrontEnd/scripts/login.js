document.addEventListener('DOMContentLoaded', () => {
  console.log("Script chargé et DOM prêt");

  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return console.error("Formulaire introuvable");
  if (!errorMessage) return console.error("#error-message introuvable");
  if (!submitBtn) return console.error("Bouton de soumission introuvable");

  // Optionnel : écouteur sur le clic du bouton pour tester ou contourner un blocage
  submitBtn.addEventListener('click', (event) => {
    console.log("Bouton cliqué");
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le formulaire de recharger la page
    console.log("Formulaire soumis");
	
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    const expectedEmail = "admin";
    const expectedPassword = "12345";

    if (emailInput === expectedEmail && passwordInput === expectedPassword) {
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = "Erreur : identifiants incorrects, veuillez réessayer.";
      errorMessage.style.color = 'red';
    }

 });
});