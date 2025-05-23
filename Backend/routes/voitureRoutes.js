// routes/voitureRoutes.js
const express = require('express');
const router  = express.Router();
const { authenticateClient } = require('../Middlewares/authMidleware');
const { 
  getAllVoituresEtReservations, 
  createCar 
} = require('../Controllers/voiturecontroller');

// POST - Création d'une nouvelle voiture
router.post('/', authenticateClient, createCar);

// GET - Voitures et réservations
router.get('/AllVoituresEtReservations', getAllVoituresEtReservations);

module.exports = router;
