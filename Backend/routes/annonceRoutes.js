const express = require('express');
const router = express.Router();
const { authenticateClient } = require('../Middlewares/authMidleware');
const { getAnnonces } = require('../Controllers/annoncecontroller');

router.get('/', authenticateClient, getAnnonces);

module.exports = router;
