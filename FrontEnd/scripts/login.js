document.addEventListener('DOMContentLoaded', () => {
  console.log("Script login chargé");

  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  if (!form || !errorMessage) {
    console.error("Formulaire ou zone d'erreur introuvable.");
    return;
  }

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('userId')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!email || !password) {
      errorMessage.textContent = "Veuillez remplir tous les champs.";
      errorMessage.style.color = 'red';
      return;
    }

    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects.");
      }

      const data = await response.json();

      if (data.token) {
        // Stocker le token dans localStorage
        localStorage.setItem('authToken', data.token);

        // Rediriger vers l'accueil
        window.location.href = 'index.html';
      } else {
        throw new Error("Réponse invalide du serveur.");
      }

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      errorMessage.textContent = error.message;
      errorMessage.style.color = 'red';
    }
  });
});
