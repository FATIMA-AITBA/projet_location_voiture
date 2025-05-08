const express = require('express');
const router = express.Router();
const { register, login,updateProfile } = require('../Controllers/agencecontroller');
const { authenticateClient } = require('../Middlewares/authMidleware'); // Middleware d'authentification


// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API Agence est opérationnelle' });
});

// Routes pour l'inscription et le login
router.post('/register', register);
router.post('/login', login);
router.put('/update-profile', authenticateClient,updateProfile);


module.exports = router;
