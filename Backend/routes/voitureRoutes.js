const express = require('express');
const router = express.Router();
const {getAllVoituresEtReservations} = require('../Controllers/voiturecontroller');


// Route protégée par JWT pour récupérer les réservations du client connecté
router.get('/AllVoituresEtReservations', getAllVoituresEtReservations);



module.exports = router;
