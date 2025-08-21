function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      clearInterval(interval);
      callback(el);
    }
  }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("Script chargé et DOM prêt");

  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return console.error("Formulaire introuvable");
  if (!errorMessage) return console.error("#error-message introuvable");
  if (!submitBtn) return console.error("Bouton de soumission introuvable");

  // Optionnel : écouteur sur le clic du bouton 
  submitBtn.addEventListener('click', (event) => {
    console.log("Bouton cliqué");
  });


  waitForElement('#login-form', (form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log("Formulaire soumis");
   
    });
  });

  const emailElement = document.getElementById('email');
  const passwordElement = document.getElementById('password');

  if (!emailElement || !passwordElement) {
    console.error("Champ email ou mot de passe introuvable");
    return;
  }

  const emailInput = emailElement.value;
  const passwordInput = passwordElement.value;

  console.log("Email:", emailInput);
  console.log("Password:", passwordInput);

  const expectedEmail = "admin"; 
  const expectedPassword = "12345";

  if (emailInput === "admin" && passwordInput === "12345") {
    window.location.href = 'index.html';
  } else {
    errorMessage.textContent = "Erreur : identifiants incorrects, veuillez réessayer.";
    errorMessage.style.color = 'red';
  }
});
