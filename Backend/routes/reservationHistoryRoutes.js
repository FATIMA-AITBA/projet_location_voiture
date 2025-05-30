const express = require('express');
const router = express.Router();
const {getClientReservationsHistory,getAgenceReservationsHistory} = require('../Controllers/reservationhistorycontroller');
const { authenticateClient } = require('../Middlewares/authMidleware');

// Route protégée par JWT pour récupérer les réservations du client connecté
router.get('/mes-historiques', authenticateClient,getClientReservationsHistory);


// historique agence
router.get(
  '/agence/:id/historiques',
  authenticateClient,
  getAgenceReservationsHistory
);


module.exports = router;
