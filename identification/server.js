const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();

const cors = require('cors');
// Utiliser CORS pour autoriser toutes les origines
app.use(cors());

// Utilise body-parser pour parser le corps de la requête en JSON
app.use(bodyParser.json());

// Charge les utilisateurs à partir du fichier JSON
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));

// Clé secrète pour signer le JWT
const SECRET_KEY = 'votre_clé_secrète';

// Route pour la connexion
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;

  // Recherche l'utilisateur par email
  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  // Crée un token JWT
  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });

  // Renvoie le token au client
  res.json({ token });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
