const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Fonction pour vérifier la validité du token (même logique que main.js)
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

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  // Vérification locale des champs avant appel API
  if (!email || !password) {
    errorMessage.textContent = "Veuillez remplir tous les champs.";
    errorMessage.style.color = 'red';
    return;
  }

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      errorMessage.textContent = "Identifiants incorrects.";
      errorMessage.style.color = 'red';
      return;
    }

    const data = await response.json();

    if (data.token) {
      // Vérification du token avant stockage et redirection
      if (isValidToken(data.token)) {
        sessionStorage.setItem('authToken', data.token);
        window.location.href = 'index.html';
      } else {
        errorMessage.textContent = "Token invalide, connexion impossible.";
        errorMessage.style.color = 'red';
      }
    } else {
      throw new Error("Réponse invalide du serveur.");
    }

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    errorMessage.textContent = error.message;
    errorMessage.style.color = 'red';
  }
});
