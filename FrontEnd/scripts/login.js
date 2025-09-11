const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// -------------------
// Vérification token
// -------------------
function isValidToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.userId && payload.exp > now;
  } catch {
    return false;
  }
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();

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

    if (data.token && isValidToken(data.token)) {
      sessionStorage.setItem('authToken', data.token);
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = "Token invalide.";
      errorMessage.style.color = 'red';
    }
  } catch (err) {
    errorMessage.textContent = "Erreur réseau.";
    errorMessage.style.color = 'red';
    console.error(err);
  }
});
