const express = require('express');
const router = express.Router();
const {createFacture} = require('../Controllers/facturecontroller');
const { authenticateClient } = require('../Middlewares/authMidleware'); // Middleware d'authentification

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API est opérationnelle' });
});

// Route pour créer une facture
router.post('/createFacture', authenticateClient, createFacture);

module.exports = router;
