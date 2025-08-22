const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Utilisation d'axios pour faire des requêtes HTTP externes
const cors = require('cors');

const app = express();
const port = 5678;
const SECRET_KEY = 'votre_clé_secrète';

// Utiliser CORS pour autoriser toutes les origines
app.use(cors());

// Utiliser body-parser pour parser le corps de la requête en JSON
app.use(bodyParser.json());

// Route pour la connexion
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Effectuer une requête vers une API externe pour valider l'email et le mot de passe
    const response = await axios.post('http://localhost:5678/api/users/login', {
      email,
      password
    });

    // Vérifie si la réponse contient un token
    if (response.data && response.data.token) {
      const token = response.data.token;

      // Crée un token JWT à partir des données de l'utilisateur
      const jwtToken = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: '1h' });

      // Renvoie le token JWT au client
      return res.json({ token: jwtToken });
    } else {
      // Si l'API externe n'a pas renvoyé un token, renvoyer une erreur
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    return res.status(500).json({ error: 'Erreur interne lors de la connexion' });
  }
});

// Exemple de route protégée (requérant un token JWT)
app.get('/api/protected-route', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    res.json({ message: 'Accès autorisé', user: decoded });
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
