const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');


// -------------------
// Soumission formulaire
// -------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

  //Préviens si un champs est vide, mais j'ai aussi mis "required dans l'html"
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
      errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
      errorMessage.style.color = 'red';
      return;
    }

    const data = await response.json();

    // Vérifie que le token est présent et valide
    if (response.ok) {
      // Stocke le token dans sessionStorage
      sessionStorage.setItem('authToken', data.token);

      // Redirige vers l'accueil
      window.location.href = 'index.html';
    } 
    
  } catch (err) {
    errorMessage.textContent = "Erreur réseau.";
    errorMessage.style.color = 'red';
    console.error(err);
  }
});
